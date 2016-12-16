---
title: Climate Data Service Released (alpha)
layout: post
date:   2016-12-16 8:22:52 -0500
categories: Research Data
---

Several months back, I wrote about the [niche API](http://scottsfarley.com/research/paleoclimate/2016/06/26/the-niche-api-web-service.html) that I was putting together. I put that on hold for a hot minute while I was working on other projects, most notably, my thesis. Since the [Flyover Country](http://fc.umn.edu) team came to Madison in November, I've been pretty psyched up about it again, and have been working on it consistently for several weeks.  I'm pretty confident in it's current version, and I hope you head over to the [live demo](http://grad.wisc.edu/cds) page or the [github](http://github.com/scottsfarley93/niche-api) to check it out.

I attended the AGU annual fall meeting this week. I browsed the informatics talks and posters every day, which convinced me a data service like this is something that nobody is doing, and something that could be really special. Most folks are focused on NetCDF distribution and metadata. NetCDFs are great, and are (and will remain) and important method of disseminating climate model and earth observation data.  However, it doesn't allow programmatic access to arbitrary geometries. OpenDAP and other protocols let you extract some subsets of a remote NetCDF, but you've still got to deal with a grid object on the client end.  Putting data in a more structured database (or even unstructured -- there's potential for a graph/nosql database implementation here) allows clients to request portions of single or multiple bands along sets of points, lines, or polygons.  It opens the potential for statistics (mean, median, variance, etc) within a geometry for a climate variable, allowing you to aggregate over space or time. Finally, it makes life way easier on the client side: rather than having to manipulate a grid (whole or subset), the client can consume exactly what they want.  For example, plotting time series, histograms, or environmental space plots in-browser with javascript.

I think that (with a lot more work) this type of service could fundamentally change the way that people interact with climate model data.

I think that important things to take care of now are standardizing the variables and source metadata to make my system consistent with leading metadata standards.  Particularly, I think I'll work to conform my variable naming conventions to the NetCDF-CF metadata standard for variable names, and use the NASA Global Change Master Directory standards for temporal and spatial resolution conventions. I'm still looking around for climate model metadata standards, but I want to be able to differentiate the forcing scenarios, model versions, and resolutions.

[Simon Goring](http://goring.org) and I spent some time talking about interesting projects that could demonstrate the utility of this project. I'm not used to thinking of things in terms of papers that could be written, but it seems like there's at least one that could be viable. I tend to like to think of things in terms of their utility to the general community -- not exactly the way of the world in academia. Some potential things that we came up with:

1.  Correlate climate reconstructions build using transfer functions from data in the Neotoma Database with climate model output. This would simplify the process of both building the transfer function (you could hit the data service for modern climate) as well as for comparison against models (you could hit the exact space-time locations).  We could then build a map of correlation between GCM-modeled climates and pollen-reconstructed climates.

2.  Understand point-specific uncertainty in climate model projections to the end of the century. We know there is significant uncertainty both in the scenario (how much CO_2 in the atmosphere) and in the individual dynamics of the models. The climate data service could help to develop an understanding of inter-model variability at specific points.  For example, given business as usual (e.g., RCP8.5), what are the range of possible climates that Paris might experience in 2050, 2075, and 2100. Again, such an analysis would be possible without the development of my API, but it would enable public, programmatic consumption and, perhaps, promote broader public understanding.  For example, what if you could serve a visualization web-app where uncertainty ranges for any user-entered point? That'd be cool.


There's so much more I'd like to do on this.  Particularly, on the top of my list are:

1. Redesign temporal data model. Not all data will have the same resolution, and not all will have 1950 as an appropriate benchmark time. Develop a new temporal data model so that the system can handle both past and future data, as well as data that only represents a single point in time.

2. Ingest more models. Currently, I've only got the Lorenz et al. downscaled CCSM 3 data from North America. I'd like to ingest at least one more data source in the near future as a proof of concept for model inter-comparison.

3. Source, model, and variable metadata development. Enhance metadata so that variables and sources are well defined and can be programmatically consumed.

4.  Develop an automated ingestion pipeline.  Allow authenticated users (me) to upload raw data (NetCDFs, raster grids, etc), convert them to the proper format, then ingest the data and the metadata into the database.  This could vastly improve the speed at which I added to the database, since everything is done by interactively now. It requires a lot of complex geoprocessing on the server though -- I don't know if the geography department will be okay with that...

If this sounds interesting to you, let me know! If you want to consume my data service, that'd be awesome. I'd be happy to modify the existing returns to fit your needs. Here are up-to-date [docs](http://grad.geography.wisc.edu/cds/docs) with examples. If you want to help develop, that'd be awesome too. I'm super excited about this project, but pushing the limits of what I know. Send me an [email](mailto:sfarley2@wisc.edu) -- let's talk.
