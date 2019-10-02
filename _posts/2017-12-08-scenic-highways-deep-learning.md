---
layout: post
title:  "Idea -- Scenery-based routing: A deep learning approach"
date:   2017-12-05 11:22:52 -0500
categories: machine-learning
---

<style>
  .blogImg{
    width: 50%;
  }
</style>


Here's an idea I've been tossing around in my head for a awhile now that I want to get out there.

*Scenario*: You've got a bit of extra time on your commute, or road trip, or other driving-based activity. Your ultimate goal is to get from point A to point B, but you'd like to maximize the level of scenic-ness on your drive. In other words, you'd prefer to drive on nice, pretty roads rather than ugly, boring roads.

<img class='blogImg' src="{{site.url}}/assets/scenic.jpg">
<br />
**Drive on this**

<img class='blogImg' src="{{site.url}}/assets/ugly.jpg">
<br />
**Not on this**

The idea is to populate a road graph with edge weights that represent the `scenic-ness score` of that segment of road. If we had that, then we could calculate shortest path algorithms that maximize time spent on beautiful scenic byways.

Here's how I am thinking about going about it:

1. Obtain street-level imagery from road segments using `Mapillary` or similar service.

2. Use image classification to rank each street-level images on its `scenic-ness`. Using images from officially designated scenic highways as positive training examples and images from urban areas or freeways as negative examples, we obtain the degree of similarity to a scenic road.

3. Average the scenic-ness scores for each image and associate this metric with each segment geometry.

4. Load up the new segments with their scores to `pg-routing` engine.

5. Route based on scenic-ness.


More specifically:

1. We already know that some roads are more scenic than others, because they've been officially designated as such. According to the California Department of Transportation:

> A highway may be designated scenic depending upon how much of the natural landscape can be seen by travelers, the scenic quality of the landscape, and the extent to which development intrudes upon the traveler's enjoyment of the view. [link](http://www.dot.ca.gov/design/lap/livability/scenic-highways/faq.html)

Therefore, we know that road segments that are labeled by the state as scenic highways should score very highly on the scenic-ness metric `scenic=1`.

We can get the locations of the scenic highways [here](https://gist.github.com/scottsfarley93/61ec24b2378b3708c4669dde671b593b).

We can get other roads from a source like [TIGER](https://catalog.data.gov/dataset/tiger-line-shapefile-2013-state-california-primary-and-secondary-roads-state-based-shapefile).

2.  Obtain images of the roads. We'll use street-level imagery taken along each route to estimate scenic-ness. From along each segment of road, randomly sample *N* positions along the line. Using the Mapillary A
