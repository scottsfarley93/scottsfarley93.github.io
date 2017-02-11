---
layout: post
title:  "Proportional Clusters: A Plugin for Leaflet"
date:   2016-05-8 11:22:52 -0500
categories: cartography coding
---

![Screenshot]({{ site.url }}/assets/pclusters.png)

I've been working hard on Ice Age Mapper lately, and I've been thinking a lot about the symbolization of the points on the map. I've done a lot for the representation of the other dimensions, by using the multidimensional dashboards in the new analytics panel. But, the map just has so many points on it (for a lot of taxa) that it's hard to figure out how and if to group them. One of the things I came up with is to make a multi-scale proportional symbol map that clusters the points and makes a symbol sized according to how many children are in the cluster. Drawing heavily on the [Leaflet.MarkerCluster](https://github.com/Leaflet/Leaflet.markercluster) plugin, I developed a separate plugin that allows you to make a proportional cluster map with your own data. It includes options for scaling the radius of the symbols and styling the points.

You can see a live demo [here](http://scottsfarley.com/leaflet.proportionalClusters) and you can find the annotated source for the library and example [here](http://github.com/scottsfarley93/leaflet.proportionalClusters).

There's a few more things I want to add to the library. Right now, it's got a dependency on d3, to do the radius scaling. If I can port the d3 scale module into this library, it would remove that, making it a better standalone module. I'd also like to improve the styling, which is currently a combination of jQuery and CSS. Ideally, I'd like to remove all dependence on external stylesheets, and have everything be styled by calls to the constructor function.
