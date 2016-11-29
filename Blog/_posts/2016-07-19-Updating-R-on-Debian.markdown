---
layout: post
title:  "Updating R on Debian Linux"
date:   2016-07-19 9:22:52 -0500
categories: Research CloudComputing
---

Why the ```apt-get``` package manager doesn't contain the latest version of ```R``` automatically, I'm not sure. I recently realized I have been downloading a 2+ year old distribution for all of my SDM timing runs by running the standard ```sudo apt-get install r-base``` command at the shell.  For several weeks, this was fine, but today the package ```Rcpp```, which wraps compiled C++ code in the R environment failed to compile.  I spent most of the afternoon trying to figure out what was going on.  I didn't even occur to me that the  ```r-base``` package I was using was the root cause.  

It is not easy to figure out how to update the core R package, but, like most things in linux, it comes down to a correctly ordered set of calls to a package manager.

*Note:* I am using a Debian 8 Jessie image, version v20160718

###Steps:

1.  ```sudo apt-get remove r-base```.  Remove the old version of R.
2.  ```sudo nano /etc/apt/sources.list```.  This file holds all of the package repositories for ```apt-get```.  
3.  Inside of it, copy and paste:
    <pre>
    deb http://cran.rstudio.com/bin/linux/debian jessie-cran3/
    </pre>

    This tells the manager to look in this repository for a copy of the R distribution.
4.  Save and close the text editor.
5.  At the shell, type:
      <code>
      gpg --keyserver keyserver.ubuntu.com --recv-key E084DAB9
      </code>
      and then
      <code>
      gpg -a --export E084DAB9 | sudo apt-key add -
      </code>
  What does this do? I'm not exactly sure, but I think it has to do with the package integrity checks down when downloading things from a package manager.

6. ```sudo apt-get update```.  Update the installed packages.
7. ```sudo apt-get install r-base```.  Install the core R functionality, hopefully this time using the newest version.
8.  ```sudo apt-get install r-base-dev```.  Install the development headers to allow packages that are not in debian repositories.

At this point, you should have a newly updated R version.  You can check with R.version.  For me, this worked for updating from R version ```3.0.1``` to R version ```3.3.1```.  

If you have package install error, it's definitely worth checking if an update in the r-base package could be responsible.  
