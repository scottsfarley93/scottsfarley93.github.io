---
layout: post
title:  "Automating my workflow: Building a (somewhat) distributed and (moderately) fault-tolerant system"
date:   2016-06-16 8:22:52 -0500
categories: Research CloudComputing
---

I've made significant progress in getting a couple of Google's computers to do my bidding (aka my thesis), in an automated way, so I thought I would share my experience setting up my cluster, and, specifically, the configuration of computing nodes and database/control nodes.  My setup draws on a bit on the design of larger systems like Hadoop, which create frameworks for massively large and distributed fault-tolerant systems.  In short, I have one Master Node that hosts a database and a control script, and a pool of compute nodes that are fault-tolerant and designed only for computing.  The compute nodes don't have to know anything about the progress of the entire project and can handle being shut down mid-run, and the control node doesn't have to know anything about the simulations being computed.

### Requirements:
1.  *Database:* Needed to store the potentially large number of results obtained from the simulations
2.  *Configurable Computers:*  A main point of my thesis is that I can control the (virtual) hardware parameters of different computers and see how the simulation time responds.  Thus, I need a pool of computers with which I can control these parameters.
3.  *Automation:* I've proposed the collection of ~84,400 different simulations on approximately 2,000 different hardware configurations. I don't have the time or willpower to set all of these up manually, so I need a way to automate the process.
4.  *API Access (optional):* I am into API design and visualization, so I want to have an internet based method of getting the completion statistics for the project.  That way I can build a cool dashboard for the results and stuff, but this is last on the list of requirements.

### Platform:
I've decided to use the [Google Cloud](http://cloud.google.com) platform because of (a.) Its option for creating custom machine types that do not conform to predefined cloud computing servers and (b.) because of its free trial that allowed me to get a bunch more experiments in without the cost.  So far, my experience with google cloud has been overall positive, but not great.  There is an extensive amount of documentation on it, but it's very dense and challenging if you don't already have experience working within their frameworks.  There is only a limited amount of blogs/stackoverflows/etc to refer to if you encounter an error or problem.  On the other hand, there's multiple ways of accessing your resources (console, REST api, command line), and several dashboards that give you a visualization of what's happening.  So we've chosen the platform.

### Approach
Based on the need to many, many different computing configurations and the automation/database needs, I think it makes sense to split the virtual servers I'll have on the cloud into two groups. At any one time I will have one or many servers that will actually be doing the job of computing the species distribution models and assessing their time and accuracy (compute nodes).  At the same time, I will have one server that hosts the database and the API, starts and stops the computing instances, and cleans up the workspace when necessary (Master Node). This approach allows me to use Google's preemptible instances, which cost much less, but have the potential to be dropped due to system demand at any time.

### Top-Level Infrastructure
The top-level infrastructure is composed of two parts: the central database and the Master Node.  In truly distributed systems, the system would not need access to a centralized database, instead each compute node would be able to do its own thing.  This strategy seemed like overkill and difficult to implement for this project, so I kept a single centralized database -- hope it doesn't crash.  I started out using Google's CloudSQL, which was really a pain to set up, a pain to get data into, and a pain to get data out of.  So I stopped using it. Instead I run a small virtual server (f1-micro) so that I can SSH into it and not need the [very confusing](% post_url 2016-6-2-adventures-in-google-cloud-I %) CloudSQL Proxy required for I/O into the database.

Also hosted on this small server, but conceptually different is a set of scripts that make up the 'brain' of the experiment. One of these scripts runs standard SQL queries against the database to determine the current position within the pool of experiments I want to accomplish.  This is the basis for the API, developed in node.js, and also the basis for the script that controls the setup and teardown of the compute nodes.  

#### Configuring and building the virtual instances
The steps to building and configuring the pool of computing nodes takes follows this general process:
1.  The MasterNode.py script uses the (daemonized [always running]) node.js web backend to query the database to ask "What experiments have not yet been marked as DONE?".  The computing script could also mark experiments as "LEGACY", "INTERRUPTED", or "ERROR" depending on the conditions at runtime.  If they have not yet been computed, they are marked in the database as "NOT STARTED". So MasterNode asks for everything that's not "DONE", and forces a re-compute if a simulation errored or was cut short.

2.  The central database, via the API, responds with a JSON object that contains the number of cores and memory needed for the next experiment (but not the other experimental parameters like number of training examples or spatial resolution).

3. MasterNode parses the JSON and then uses the ```gcloud``` tools to create a pool of computers that have the memory and number of cores specified by the database response.  This pool of virtual instances is automatically created with a startup script that installs the necessary software and files to run the computing experiments.

#### Running the simulations; Reporting the results
Now that I have the pool of virtual instances at my disposal, I can use them to run the SDM simulations, time their execution, and report back to the central database.  There are typically between 160 and 400 simulations to be done for every computing configuration (cores & memory), so on each node is an inner loop that looks like this:

0.  Startup script installs git, mysql, and R.  Git clones the most recent version of the project repository which has all of the files needed for the computation.  R starts execution of the timeSDM.R script which controls the flow of execution for this node.
1.  RScript queries the central database to ask "I am a compute of x cores and y GB memory, what experiments can I do?".  
2.  The database responds with a single JSON row that contains all of the necessary parameters to actually run the SDM simulation (spatial resolution, taxon, number of training examples, etc).
3.  RSCript parses the response and loads the correct set of variables, then runs the SDM model.
    1.  Fit the model (fitTime)
    2.  Project the model to AD 2100 (predictTime)
    3.  Evaluate accuracy (accuracyTime)
    4.  Return overall time, fitTime, predictTime, accuracyTime, and several measures of accuracy
4.  RScript reports results back to the database.
5.  Repeat until no experiments that are not "DONE" remain to be completed by a computer of this number cores and amount of memory.

If an instance gets shut down due to preemption (or my incompetence) a shutdown script will be fired. This script records in the database that the experiment was cut off (INTERRUPTED) at some point before successful completion, and that it should be completed again in the future.

#### Managing virtual infrastructure
Because Google charges you by the minute as you use their servers, and because I have to do a lot of different experiments and don't have that much time do them, it is ideal to automatically tear down the servers and start a new pool as soon as one computing configuration has finished. So, while the computing nodes are doing their computing thing, the MasterNode is doing this:
1.  Repeated polling every 30 seconds:
    1.  MasterNode used the API to ask the database "What percentage of the experiments in this group have been completed?"
    2.  The database responds with a percentage ("DONE" / total)
2.  If the percentage is 100%, everything has been completed, so MasterNode will use ```gcloud``` to delete the individual server instances, the instance group pool the they are part of, and the template used to create the instances.  After this, only the Master Compute Node server with the database on it still remains in my pool of Google resources.
3.  Repeat.  Configure and build a new pool of instances for the next memory/cores combination.

### Conclusion
This method so far works pretty well.  Sometimes, the shutdown scripts don't actually fire (there are known bugs), and so I have one or two experiments that are continuously marked as "STARTED".  This is a problem for the MasterNode, because the database will continuously report something link 99.75% complete, but will never reach 100%.  When this happens, I need to go in and manually mark the session as closed and the experiments as INTERRUPTED, and then the normal flow of execution can continue.  So I have to remain watchful, but I don't have to do everything.
