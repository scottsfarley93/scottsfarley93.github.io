---
layout: post
title:  "On Finding Data for Cartography Projects, Part I: Reading Existing Source Code"
date:   2016-05-8 11:22:52 -0500
categories: cartography
---

Sometimes, it can be hard to find the data we want.  We spend hours looking in all our normal places.  We cruise the census bureau, hit the EPA's data portal, and browse UW's collection of geospatial resources. If you have a topic or a storyline in mind, it can be really frustrating to find that you can't find the right data.  In most cases, the data you seek is actually out there, it might just be a little harder to find that you might hope.  I'll discuss a couple of techniques I use from time to time when I find myself in this situation.  This is my first blog post, so stay with me.

### Reverse engineer someone else's work
Chances are, if you're exploring a topic, you've seen a map that shows some data that you'd like to use.  If you haven't seen a map like this, either (a) you're doing a topic that shouldn't be mapped/isn't spatial, (b) you already have your data in hand and don't need to reverse engineer someone else work, or (c) you haven't looked hard enough.  In many cases, these maps will show the <em>exact </em>data that you want to map with, just presented in a different way than what you're thinking.  If the map you've found is made in-browser (slippy map, svg illustration, etc), chances are you can find the data that was used to create it.  If you find a pdf, png, or other more traditional desktop format, you'd be hard pressed to reverse engineer the data -- I wouldn't bother, since the spatial information has been lost.

I recently wanted to make a map of Syrian refugee routes to Europe.  I found that UNHCR has a great data portal, which supports some nice visualizations. It's hard, though, to pull the data out of the visualizations, since the specific numbers are only shown when elements are moused over.  I will use this case as an example, and walk through the steps I took before eventually finding an excel file that contained all the data I wanted and more! The data portal can be found (here)[ http://data.unhcr.org/mediterranean/regional.php].

#### View-Source:
So you've found a map to take a look at.  The first thing you want to do is to dig into the source code of the web page.  This can be overwhelming if you're not familiar with html, css, and, particularly, javascript.  However, there's a couple key things to look for that might lead to data discovery. They won't work for every website, but some mixing and matching might yield good results for you. In any case, it'll probably take some time, so be prepared to look at code for a hot minute. To look at a webpage's source code, enter view-source: directly before the pages url.
<pre>view-source:http://data.unhcr.org/mediterranean/regional.php</pre>
Now I can see all of the html written on the page.

Things to look for at this stage: javascript files and iframes. iframes: iframes are a somewhat outdated method of putting a whole external webpage inside of another page, they can be holders for visualizations.  Javascript files: Many (most?) modern interactive web maps are written in javascript, so they are what we eventually want to get to.  It can take some practice and some time to browse through the source and find things that look important.  HTML sources will link to external the js files, so click on these so you can look at them.  Also it can be helpful to open both the page source and the rendered HTML page at the same time in different tabs, so that you can keep track of what you're looking at in the source.

In the UNCHR page example, I see both a main.js file and an iframe. I see at lot more written in the page, but it's all below the map in the rendered page.  I browse the main.js file, but its not quite what I'm looking for. I don't see anything that looks like its drawing a visualization, so I skip it for now -- may I'll need to come back later.  Next, I examine the iframe, click the link, and see the map in its own web page, without the extra information provided in the portal entry point. One step closer!  Let's take a look at the source of the iframe.  The iframe is the link:
<pre>http://data.unhcr.org/medportalviz/dist/index.html?year=2016&amp;cache=4</pre>


#### Unminify:
When looking at the source of the iframe, things get a little more complicated.  Everything is much more condensed, and less readable.  But, its shorter, so there are less items to consider. There's a couple of different links in the html part of the page, and I see two javascript &lt;script&gt; links.  Main.js usually contains custom written components, so its a good place to start.  I would recommend pursuing the main.js file over other, more generically named js files. When I click to look at the main.js script of the iframe, I see that its been minified.  Its totally impossible to read.  The solution: unminify!

Minification is a way to reduce file size, and thus improve performance of the application, because less data has to be transferred across the network. Minification is done by removing extra characters, comments, and whitespace, resulting in a compact, but unreadable file.  One solution when looking at other people's sources is to use a tool like [http://unminify.com/]('http://unminify.com'), which will expand the code, add whitespace, and make it much more readable.

When I unminify the code, I finally see the javascript that is controlling the map.  There's two benefits to reaching this point: (1) I can see how the original developer of the application wrote the code.  Often the code will contain a license clause showing ownership and reusability.  If there is no license, be careful about copying the code.  In any case, it is okay to look at the general coding strategy and use it as an example for developing your own applications in the future. In this case, we see that the authors use some D3 and some additional third part libraries.

More importantly for our purposes right now, though, is (2): We can find the data that the javascript visualization is pulling from.  It will often be from an api, json file, or csv file.  In this case, we see several local files that are clearly the boundary and basemap files. Finally, I find the line:
<pre> dataSrc = "http://data.unhcr.org/data_sources/mediterranean/data.xls"</pre>
Seems promising! I copy and paste the link into my browser -- Jackpot! an excel file containing all of the data that the original visualization was built on.  In fact, in this case, theres much more data than just what is shown in the UN visualization. I am free to build new and creative visualizations from the data, or just to look and inspect it.

Lessons Learned:
<ol>
 	<li>Use view-source: to look at the webpage source</li>
 	<li> Look for iframes and javascript files</li>
 	<li>Make use of tools like unminify.com to make minified code more readable.</li>
 	<li>Prioritize main.js files over other files.</li>
 	<li>Practice! You might not always find what you want and you might waste some time, but in any case, you will learn how other developers structure their web pages and develop web visualizations.</li>
</ol>
<em>Disclaimer: Use the advice here at your own discretion.  Sometimes, it may not be appropriate to use other people's data, so make sure that you're ethical in what you're doing.</em>
