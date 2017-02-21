---
layout: post
title:  "What to do with 360 degrees of longitude?"
date:   2017-02-21 11:22:52 -0500
categories: cartography analysis
---

I recently spent several days trying to solve a (seemingly) simple problem: vectorizing some rasters. I'm making an interactive of ice sheet volume during deglaciation, and I needed the data in geojson format to put into my mapboxgl map. After finding the [data](https://pmip2.lsce.ipsl.fr/design/ice5g/) there were two main problems I encountered:

1. The data was in NetCDF format.
2. The data had longitude coordinates from 0-360 degrees instead of -180 to 180 degrees.

In my experience, if it's in NetCDF, you're going to spend some time getting frustrated trying to work it into a traditional GIS/web mapping workflow. Luckily, gdal has native support for multidimensional netcdfs, so processing isn't totally impossible.

The second problem was much more challenging for me and one that required me to download and install no less than four obscure and poorly documented software packages, work in three different languages, and cause general headache. Figure 1 shows a screenshot of the problem.

![Bad]({{ site.url }}/assets/bad.png)
**Figure 1**: The problem

In this post, I'll discuss some of the problems I encountered and how I eventually came upon my solution.

***TL;DR; Use R***

*  *Start Simple* Okay, so I've got these weird coordinates in this weird netcdf format. The first logical thing for me to do was to convert to an ASCII ```.xyz``` file so that I could directly manipulate the coordinates. The ```.xyz``` file format is a space-delimited file that lists the x, y, and value (z) data on regular grid. It's inefficient space-wise, but gives you direct access to both the coordinates and the attributes of a raster file. Using gdal I can convert directly to xyz using something like ```gdal_translate NETCDF:in.nc:varname -of "XYZ" output.xyz```. Easy. Then I can directly modify the x (longitude) coordinates -- coercing them into a -180 to 180 range using the formula:

{% highlight python %}
newLongitude = ((oldLongitude+180) % 360) - 180
{% endhighlight %}

This does the correct conversion but isn't an easily viable technique because of the ```.xyz``` file specification. Specifically,

> For a same Y coordinate value, the lines in the dataset must be organized by increasing X values. The value of the Y coordinate can increase or decrease however.  
>
>(GDAL Reference: http://www.gdal.org/frmt_xyz.html)

So, I'd have to do some nifty sorting to get this to actually work. Moreover, using this method requires direct manipulation of my data's coordinates, which seems bad.  

* *Combining subsets into single grid*: The next technique I considered was to split the offending portion of the data (longitude > 180) into it's own tiff file. Make another tiff file for the non-offending longitudes (< 180). Modify the coordinates on the offending file and then merge the two together using ```gdal_merge.py```. This seemed totally reasonable and very logical. Unfortunately, it caused some weird distortion on the grids, and caused things to not line up properly. I'm not exactly sure what the problem was here, but it caused the dataset to be entirely unusable.


* *Use Proj4 and ```gdalwarp```*: Inspired by [this post](http://gis.stackexchange.com/questions/37790/how-to-reproject-raster-from-0-360-to-180-180-with-cutting-180-meridian) I tried to use the ```gdalwarp``` to do the coordinate manipulations directly by reprojecting the existing coordinate info. The post suggests:
{% highlight bash %}
gdalwarp -t_srs WGS84 ~/0_360.tif 180.tif  -wo SOURCE_EXTRA=1000 --config CENTER_LONG 0
{% endhighlight %}

However, if you try do execute this command directly on a netcdf, you get an error: ```ERROR 1: Input file NETCDF:ice5g_v1.2_03.0k_1deg.nc has no raster bands```. In theory, you could first convert to a 360 degree geotiff, then do this coordinate wrapping, but it seemed like that could cause issues with the coordinates, since geotiffs are not designed to have longitudes > 360. I also tried some stuff with writing new coordinates using proj4 and the lon_wrap parameter.

* *Do more googling*: It looks like there are packages out there that will do this conversion for you. Most are difficult to figure out exactly how to work them or if they'll work with netcdfs. I downloaded, installed, and messed with the [NCAR Command Language (NCL)](http://www.ncl.ucar.edu/Applications/), [Generic Mapping Tools](http://gmt.soest.hawaii.edu/projects/gmt), a package of [Climate Data Operators](https://code.zmaw.de/projects/cdo/embedded/index.html), and a promising looking python package. All seem to be (1) poorly documented, (2) hard to use, (3) lacking in examples, (4) extremely esoteric and (5) obscure. **Update** As I'm writing up this post, it looks like the CDO package actually does work -- you can create a new netcdf with rotated grid coordinates using ```cdo sellonlat,-180,180,-90,90 infile.nc outfile.nc```.

* *Use R*: I should have considered using R earlier in the process, but I was convinced that command line GIS tools would be the way to approach this problem. Nonetheless, R has everything I need: (1) support for netcdf files using the ```raster``` package, (2) geospatial manipulation tools, again in the ```raster``` package (among others), and (3) can write to new formats. In fact, the whole thing can be done in only three lines of R code:

{% highlight R %}
a <- raster(inNC, varname=varName)
rotated <- rotate(a)
writeRaster(rotated, outRaster)
{% endhighlight %}

R definitely appears to be the way to go.

![Good]({{ site.url }}/assets/good.png)
**Figure 2:** Correct alignment!
