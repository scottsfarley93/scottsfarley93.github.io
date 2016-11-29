---
layout: post
title:  "Managing Long-Running Processes on Linux"
date:   2016-06-12 11:22:52 -0500
categories: Research CloudComputing
---

In my work, I have several times encountered the need to run a script for an extended period of time, or as a daemon (always running as a service).  Whether you're on your own personal computer or SSHed into a virtual machine in the cloud, managing processes that take a long time can be annoying. If you finish your work day and close your laptop, you're going to stop your script.  In the cloud (or I guess on a desktop/personal server too) you can take a couple steps to run scripts as services that will not stop when you end your work day.  There are a couple of ways of doing it that I've found.  Here are two that matched my needs.

### Forever

#### Scenario:
I have a node.js based api server (to be discussed in a future post) that runs common sql queries for me so I can see the progress of my experiments over HTTP instead of typing out the commands manually.  I wrote the app, and can run it with <code>node app.js</code>.  Works great -- until I log off of SSH.  Because its a web server, I want it to be running all the time, so I can see it from anywhere on the internet, not just when I am actively working on my projects.  So I need a way to make this run automatically, 24/7.

#### Solution:
Forever is a super simple tool designed to make your app run continuously. It is both written in node and designed to run node apps, so it's a good choice for our scenario.  Also, it's [open source](https://github.com/foreverjs/forever).  

To install <code>forever</code>, I will use the node package manager (npm).  <code>cd</code> into your application's project directory, then install the package with <code>[sudo] npm install forever -g</code>.  The g flag should make the package available globally, and, importantly for us, available as a command line tool.  Y

So I've got my app, I've debugged it both on a localhost and on the remote machine I'll be hosting the server on, so I know it is going to work, and I've installed the package.  To start the process <code>cd</code> into the directory you're going to use, and then start the app with <code>forever [APPLICATION-NAME].js</code>. In my case, it's <code>forever app.js</code>.  And that's it.  You can check by examining the logs, or, more simply, going to wherever your application is serving content.  I have mine running on the 8080 port of the server I'm using as the master node / database of my project.  If I go there in my web browser, I see that my node project is running as expected.

If you update your app, you'll need to restart the service.  You can list the running services controlled by <code>forever</code> by using <code>forever list</code>.  Find your process (if you have more than one running), and then stop by <code> forever stop [ID]</code>. If you have exactly one process running, you can shortcut the listing and just run <code>forever stop 0</code>.  

In all, <code>forever</code> is a very simple and easy to use solution for running node apps as services on virtual machines.  I think that we could use it to run scripts in other languages, like python, but I decided to use another tool for that.

### Supervisor

#### Scenario:
I have a python script that I call MasterNode which controls the creation and deletion of all of the other virtual machines that I need to work with for my project.  MasterNode starts, figures out what the next core/memory combination is that has not be finished yet, then fires up a group of servers to do this job. When all of the experiments are complete, the script kills them, deletes them, and starts a new configuration.  The whole point of having MasterNode is that I don't have to worry about specifying which configuration comes next, I can just sit back and relax while MasterNode figures it out for me.  This only works, though, if MasterNode is running, which stops after I log out of the virtual machine. I like sitting back and relaxing -- So clearly I need a way to make it run continuously. I found a tool called <code>supervisor</code> which is very similar to <code>forever</code> but looks more robust and versatile.  


#### Solution:
Getting it up and running was slightly more challenging -- [this post](https://serversforhackers.com/monitoring-processes-with-supervisord) was very helpful. To install <code>supervisor</code> use <code>apt-get</code>.  Specifically, we will use ```sudo apt-get install -y supervisor```.  The ```-y``` flag indicates that you will answer yes to any question the system asks you (like 'Are you sure you want to install this package?').  Now we've installed the package, we need to define a program for it to run.  

Create a new program configuration file using ```nano [APPLICATION-NAME].conf```.  Inside of the file, you will write the details about where the program executable is located, whether it restarts, etc.  Details are confusing but can be found [here](http://supervisord.org/configuration.html).  My configuration file looks like this: (comments are added, remove them)

{% highlight bash linenos%}
[program:masterNode]  ## name your process
command=python -u masterNode.py ## this is the command that supervisor will use to start your script
directory=/home/rstudio/thesis-scripts/python  ## this is the directory that your script lives in
stdout_logfile=/home/rstudio/thesis-scripts/logs/masterNode.log ## this is where the output of your script will go
redirect_stderr=true ## put errors into your log too
{% endhighlight %}

Now, move the configuration file into the directory used by the supervisor program:

<pre>
sudo mv [APPLICATION-NAME].conf /etc/supervisor/conf.d
</pre>

The ```conf.d``` directory holds all of the programs you want to be run by supervisor.  When it starts, it will look in this directory for any ```.conf``` files.

The first time you run the program, it might try to automatically start your program.  That's cool, but if it doesn't you can start your script running under supervisor with these steps:

1.  Open the supervisor tool with ```supervisorctl```, which opens up a new supervisor shell.
2.  Load any new configuration files with ```reread```, which will print out a list of available programs that you could run.
3.  Start your program with ```add [programName]```, which will put your program under supervisor's control.  Now you can sit back and relax :)

You can review the logs of your scripts by looking at them directly in the folder where you put them, or better, you can view them in real time with ```tail -f [programName]``` from the supervisor shell.

To stop the program, you can ```stop [programName]```, which puts your application into paused mode. If you want to remove it from supervisor's control all together, you can then enter ```remove [programName]``` to take it off of supervisor's list.  

This technique seemed to work well for me.  It auto-starts and auto-restarts your programs if they get cut off.  The package also comes with a web based manager on port 9001, which you can use to control your processes remotely.  Nifty.

### Conclusion
There are many ways to control your long running processes.  One of the ones I did not mention here is to create the script as its own service.  However, I like the management and flexibility of the tools I discussed here.  Both of these tools would work to do either job too, so I think its really a matter of preference to pick one out.
