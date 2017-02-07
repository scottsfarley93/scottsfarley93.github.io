---
layout: post
title:  "Converting NetCDF to Raster"
date:   2017-02-05 12:00:00 -0500
categories: Research Data Cartography
---

Sometimes, especially when working with climate data, it is necessary to work with NetCDFs (Network Common Data Format -- standard data packaging for scientific data).  While NetCDF is good for data distribution, storage, and provenance, it is less good for working into standard raster data processing workflows. If you're used to working with Tiffs or JPEGs, the following command might be helpful, assuming you have gdal installed on your machine.

{% highlight bash %}
# convert the specified dimension to Raster
gdal_translate NETCDF:[PATH_TO_NC_FILE]:[DIMENSION_OF_INTEREST] -of "[FORMAT_DESIRED]" [OUTPUT_FILE_NAME]
{% endhighlight %}


This will create an N-banded raster with one band for each time dimension related in your dataset.

For example, to convert a netcdf file called ```trace.01-36.22000BP.csim.aice.22000BP_decavg_400BCE.nc``` (climate data from the SynTrace paleoclimate experiment) using the dimension ```aice``` (area of gridcell covered in glacier) to a tiff (```GTiff```), I might enter:

{% highlight bash %}
gdal_translate NETCDF:trace.01-36.22000BP.csim.aice.22000BP_decavg_400BCE.nc:aice -of "GTiff" aice.tif
{% endhighlight %}


This creates a 2204 band raster representing ice area in the tiff format. Super handy for then converting into a format to be digested by a web application.
