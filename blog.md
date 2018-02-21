---
layout: page
title: Blog
description: Research blog
image: assets/images/books.jpg
nav-menu: true
---

<html>

{% include head.html %}

<body>

    {% include header.html %}



<!-- Main -->
<div id="main" class="alt">

<h1 class='txt txt-h2 px24'>Blog</h1>
<p class='txt txt-light px24 txt-l'><i>Things I've been thinking about...</i> </p>

<!-- One -->
<section id="one">
	<div class="inner pt12">
    {% for post in site.posts %}
		<!-- <header class="major"> -->
        <div class='m12'>
            <h3 class='txt txt-h3 txt-light mb12'><a href="{{post.url}}">{{ post.title }}</a></h3>
            <!-- </header> -->
            {% if post.image %}<span class="image main"><img src="{{ site.baseurl }}/{{ post.image }}" alt="" /></span>{% endif %}
            {% if post.date %}<p>{{ post.date | date: "%-d %B %Y" }}</p>{% endif %}
            <p>{{ post.excerpt }}</p>
        </div>
    {% endfor %}
	</div>
</section>

</div>
