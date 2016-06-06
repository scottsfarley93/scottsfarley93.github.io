---
layout: post
title:  "Startup and Shutdown Scripts in Google Cloud Compute Engine"
date:   2016-06-05 11:22:52 -0500
categories: Research CloudComputing
---

In continuing my meditations on beginning to use the Google Cloud Computing platform, this post will describe the use of startup and shutdown scripts. If you want to start multiple instances that are all the same in terms of programs, data, etc (but perhaps of different size), you have two options. First, you could save your fully configured machine as an image, or more likely, as a snapshot.  Booting with this configuration is easy, just select the option from the menu when starting the new instance. Proceeding in this way has several potential drawbacks, however.  Most notably, it is very difficult to keep everything updated with this method.  Unless you manually update the snapshot pretty often, your software is going to be out of date.  Moreover, if you decide to make a small change in the scripts or programs you're running on the instance, you will need to make an update to the snapshot.  

Instead of using a pre-configured snapshot, you can make use of Google Cloud's ability to automatically run a script at boot time.  Using this script allows us to automatically install the latest version our programs using the <code>apt-get</code> or other linux package manager, and if using version control software like git, download the latest working version of the scripts.  Google provides fairly easy-to-follow documentation about startup scripts [here](https://cloud.google.com/compute/docs/startupscript).  In the same vein, Google provides a beta feature to run a script on machine termination, so you can save your work, etc.  There are a variety of limitations described in the [shutdown-script documentation](https://cloud.google.com/compute/docs/shutdownscript), but they can be handy to run short cleanup jobs.

As noted in the documentation, you can write the script in a number of languages by changing the shebang line at the top of the script.  To run a bash script, the first line of the script should be <code>#! /bin/bash</code>.  A python script could be run by changing this line to <code>#!/usr/bin/python</code>.

### Adding a script to a single instance
If you want to add a startup script to a single instance that is currently running:
1.  Click on the instance properties in the Console
2.  Click on edit, at the top
3.  Scroll to the 'Custom Metadata' section
4.  For key, enter <code>startup-script</code>
5.  In the value field, write your script
6.  Click save at the bottom and restart the instance.

### Adding a script to all instances in your project:
These items will be applied to all *new* instances in your project.  
1.  Open the Cloud Computing Console
2.  Click 'Metadata' in the lefthand navigation bar
3.  Click 'Edit' at the top
4.  Click 'Add item' to add a new key value pair
5.  As above, for key enter <code>startup-script</code>, and for value write your script
6.  Save and close.

It can be confusing sometimes because the metadata added here in this panel is automatically applied to all of your new instances.  You cannot see these key-value pairs in the metadata section of instance, so just remember it's there.  

#### Adding a shutdown script
Follow the same steps as to run a startup script, but instead of the <code>startup-script</code> key, put <code>shutdown-script</code>.  Super easy.  Be warned, though, that shutdown scripts are not guaranteed to run, Google completes them on a 'best effort basis.'

### My Startup Script
I'll describe my startup script and what I choose to do for each instance to set them up to run the experiments I am working with.  In general, I download, install, and update a bunch of software, I configure the google cloud proxy, and then I clone my github repository which contains all of my working files.  Then, when all is complete, I automatically start my experiments to run through an <code>Rscript</code> and then terminate the machine when they're complete.  The script is automatically run as root, from the root directory, so all of the <code>sudo</code>'s are repetitive.

<pre>#! /bin/bash

-->Tell the computer I'm working in a bash script

</pre>

<pre>sudo apt-get update

-->Update the base packages that are installed on the instance
</pre>

<pre>sudo apt-get -y install git
-->Install Git version control.  
</pre>

The <code>-y</code> flag automatically answers <code>y</code> to any queries presented by the download manager (i.e., are you sure you want to download this package? y/n).


<pre>sudo apt-get -y install r-base
-->Install R
</pre>

<pre>sudo apt-get install -y gdebi-core
-->Install a utility dependency for use in installing RStudio
</pre>

<pre>sudo apt-get install -y aptitude
--> Install the aptitude package manager
</pre>

Aptitude is a [different](http://askubuntu.com/questions/1743/is-aptitude-still-considered-superior-to-apt-get) package manager for linux systems.  This is the only one I could find that has a gdal package.

<pre>sudo aptitude install -y libgdal-dev
sudo aptitude install -y libproj-dev

-->Install gdal and proj4 libraries.
</pre>


<pre>sudo apt-get install -y  libmariadb-client-lgpl-dev

-->Install a database dependency necessary for installing RMySQL
</pre>

<pre>
wget https://download2.rstudio.org/rstudio-server-0.99.902-amd64.deb
sudo gdebi -y rstudio-server-0.99.902-amd64.deb

--> Download and install RStudio
</pre>

<pre>
wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64
mv cloud_sql_proxy.linux.amd64 cloud_sql_proxy
chmod +x cloud_sql_proxy

-->Download the cloud proxy script into your root directory and make it an executable.
</pre>

<pre>
sudo mkdir cloudsql; sudo chmod 777 cloudsql

-->Make a directory for your cloudsql proxy sockets
</pre>


<pre>
rm -rf /home/rstudio/thesis-scripts

-->Remove any old version of the script directory I'll be using.
</pre>


<pre>git clone http://github.com/scottsfarley93/thesis-scripts /home/rstudio/thesis-scripts

-->Clone the latest and greatest version of my repo into my instance.
</pre>

<pre>sudo ./cloud_sql_proxy  -dir=/cloudsql -instances=thesis-1329:us-central1:sdm-database-3 &

-->Start the cloudsql proxy so we can make database connections.
</pre>

<pre>Rscript /home/rstudio/thesis-scripts/R/time_sdm.R 50 TRUE
-->Start the experiment script to run 50 iterations and then shutdown the machine.
</pre>
