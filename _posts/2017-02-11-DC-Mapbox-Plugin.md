---
layout: post
title:  "DC-Mapbox: A Library for Creating Geographically Enabled Dashboards with Mapbox-GL and DC.js"
date:  2017-02-11 12:00:00 -0500
categories: cartography coding
---

![Screenshot]({{ site.url }}/assets/dc-mapbox-thumb.png)

I was recently chatting with Shane Loeffler -- the brains behind [Flyover Country](http://fc.umn.edu/) -- who mentioned that they're upgrading to some new frameworks, including Mapbox-GL. I didn't want Ice Age Mapper to fall behind, so I figured I should see about integrating vector tiles. Vector tiles are really cool -- easy to style, fast, fun to interact with. They also seem to be all the rage in most new mapping applications.

The new Ice Age Mapper (v2.0 onwards) has hard dependencies on lots of things, including Crossfilter and DC.js. DC.js and Leaflet play nicely together via the [DC.leaflet](https://github.com/dc-js/dc.leaflet.js) plugin, which enables dashboard with geographic information to have either a points layer or choropleth layer on a Leaflet map attached to the rest of the chart group. Unfortunately, the new Mapbox-GL library, which enables GPU-leveraged vector tiles, didn't have nicely developed bindings to DC.js. I think I could have used the [Mapbox-GL-Leaflet](https://github.com/mapbox/mapbox-gl-leaflet) bindings and then put the DC-Leaflet map on top, but this would have come at the price of some of the cool features of using Mapbox-GL in the first place.

Since I wanted to maintain the look and feel of the existing version of Ice Age Mapper, while supporting things like pitch and rotation and fractional zoom, I decided the best course of action was to write the bindings myself. What resulted was this plugin here. While it's far from perfect, it does the job of linking together a DC.js dashboard and a Mapbox-GL map.

When the map is moved, an event is triggered to redraw all the other charts in the dashboard with only the points currently in the map view. Similarly, when another chart is brushed, the map is filtered and redrawn to include only points meeting the filter criteria. Filtering is all done via crossfilter, which is super efficient at handling large multidimensional datasets. Filter events are handled via DC, which enabled all of the charts at once to be updated and redrawn.

There were a couple tricky parts to this project. The first was to filter the map using the ```layer``` on the map. Since, in Mapbox's new gl tools, the data is not an overlay, but part of the map data, it's not as simple as iterating through existing markers to see if they should be included in the current view. Instead, I had to first convert everything to geojson, add it as a map source, and render it as a map layer. Then, when a filter event was received, I used the ```map.setFilter``` method on the geojson layer to filter appropriately. Also tricky was adding popups. Since crossfilter reduces dimensions to groups, you loose the contextual information you might want to display in a popup. While it's kind of hacky -- and can cause performance issues -- I used the crossfilter dimension instead of the crossfilter group to plot the points on the map, which lets use have popups with contextual information. Finally, the map events are now asynchronous, which means that settings are harder to apply using the getter/setter methods common in D3/DC, since they have to wait until after the map and layer are loaded to be applied. To overcome this, I used a ```mapOptions``` argument in the chart constructor, so properties can be set directly on map initialization.

There's a live demo [here](http://scottsfarley.com/dc-mapbox/examples) and some annotated source and example code on my [github](http://github.com/scottsfarley93/dc-mapbox). Tell me what you think and feel free to contribute if you like what you see or think it could be better.
