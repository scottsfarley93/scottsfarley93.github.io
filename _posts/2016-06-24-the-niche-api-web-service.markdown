---
layout: post
title:  "Building the Niche API Database and Web Services"
date:   2016-07-16 8:22:52 -0500
categories: Research Paleoclimate
---

I've spent some time over the past couple of weeks building out the Niche API, a set of web services that enable you to get global climate model (GCM) simulated climate data for specific points in space and time.  For this project I've been mixing database design, backend web programming, and a bit of cloud computing.  It's been a fun process, and is turning into what I think will be a very useful tool.  In this post, I put down a few thoughts about the decisions I made, the techniques I used, and the problems I faced.

### The Challenge
Working with GCM output and other gridded climate products is always challenging. The data is large.  It's usually in a format that is designed for its transportation rather than its communication (NetCDF). It may be in the wrong projection for the work you need to do.  You might need to resample the spatial resolution of the grid to fit with the other layers in your project.  If you've ever done work with these datasets, you're probably familiar with these obstacles.  An additional challenge that we face in paleoclimate/paleoecological projects is the many different time periods that are included in each dataset. In a NetCDF, the different timestamps are typically shipped as different layers.  However, if you start to unpack these layers, you'll quickly end up with a tangled mess of rasters describing different time periods.  

In many cases, we don't need the whole gridded raster dataset for our work.  Maybe we need a small subset representing a study site, or very often, we just want to know the value of a variable at a discrete point in space and time.  In my work with species distribution models, I want to be able to ask the question: What was the precipitation (or maximum temperature, or annual mean temperature, etc) at the coordinates of a sample in the Neotoma database at the time when the sample was dated to.  Traditionally, I would need to manage all sorts of datasets, and use ArcMap or some other utility to get the datapoint I need.

### The Goal
 My goal with this project is to build a web service that does the management and extraction of climate datasets automatically. My objects include:

 1.  Store and manage gridded climate datasets in a way that preserves their metadata and makes them available via the internet
 2.  Be able to pass geographic coordinates and a calendar year and return an interpolated age for that space-time location
 3.  Be able to access the program scripts remotely through a web service
 4.  Make the platform generic enough to enable other users with other gridded datasets to contribute to the database
 5.  Maintain metadata on each dataset so that users can query for data by its attributes

My primary use case that I'm designing for is the [NicheViewer](http://paleo.geography.wisc.edu), which plots samples in Neotoma on environmental axes.  This requires that the program be relatively fast (I'm still working on this) and return in a web-digestable format (JSON).  I've made some decision along the way that really reflect having NicheViewer as my target user, but at the [C4P Hackathon](http://github.com/cyber4paleo) in Boulder, CO this weekend, people showed significant enthusiasm for the project, and I'll try to keep these other users in mind going forward.

### The Database
Climate datasets are typically stored at NetCDF objects, a format which has been optimized for the sharing and storage of gridded data.  These files are self describing, with all the metadata needed to use them included in a header.  However, they're difficult to extract data subsets from. Instead of relying on the NetCDF file type, I am going to the store the climate data as tables in a relational database.  
Postgres is a relational database management system that has a great collection of spatial types included in the PostGIS extension.  With this extension, postgres has the ability to store large gridded datasets and to query them spatially.  It also includes the ability to store lines, polygons, multipolygons, and many other types of geometry if you want. Spatial queries are perfect for my task, because I can ask for the value of the raster at a latitude/longitude point.  I could also ask things like which cells are crossed by a line, or included in a polygon, but we'll stick with points for now.

#### Raster Input to Database
Getting rasters into the database is pretty easy, if you have them in a supported format (which NetCDF is not).  The workflow here was to first convert each band of the NetCDF (they're not really bands, in this case they're the discrete time/month/variable combinations) to a tiff file.  Then, using the ```raster2pgsql``` tool included with postgres, I'll then convert each image file to a SQL table of the Binary Large Object (BLOb) type.  Finally, using the ```psql``` command shell, I can create a new table for this dataset in my dataset. I'll typically do this in a python script that loops over all files in a directory.
{% highlight python %}
{% endhighlight %}
