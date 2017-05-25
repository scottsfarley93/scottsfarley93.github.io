---
layout: post
title:  "Scraping record stats from the Paleobiology Database"
date:   2017-05-25 11:22:52 -0500
categories: research
---

I'm writing a review paper that synthesizes some of the recent literature in Big Data and ecoinformatics and situates ecoinformatics as a Big Data science. I'm drawing on some work I did for my Masters thesis that examines the growth curves of the Neotoma Database and GBIF. Jack and I have wanted to see how the Paleobiology Database lines up with these other allied resources, but their API is not as user friendly for getting stats as the other two. GBIF wins in the stats category, with a whole endpoint and ```r``` function designed for getting custom stats reports.

Anyways, I finally wrote up a short script to get the records out and turn them into a growth curve. It turned out to not be that difficult, except all of the occurrences had to be downloaded, so it took a long time. The database appears to follow a nearly linear growth curve, in contrast, to say, GBIF, whose growth curve is clearly exponential.

![PBDB Occurrence Records](/assets/pbdb_trends.png)

The data and code to get it follows. I made the chart in excel -- pretty simple stuff.

<script src="https://gist.github.com/scottsfarley93/92d271b9eedb21582648260f4e30ab57.js"></script>
