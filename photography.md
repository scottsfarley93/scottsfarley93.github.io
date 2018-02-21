---
layout: post
title: Photgraphy
description: Photography portfolio
nav-menu: true
image: assets/photography/IMG_7289.jpg
---
<p><i>I'd like to start showing off some of the beautiful photos I've been taking recently.
</i></p>

<div class="grid">
{% for image in site.static_files %}
    {% if image.path contains 'photography' %}
        <a href="{{ image.path  | relative_url }}" data-lightbox='photographs'><img src="{{ image.path  | relative_url }}" class='grid-item' /></a>
    {% endif %}
{% endfor %}
</div>
