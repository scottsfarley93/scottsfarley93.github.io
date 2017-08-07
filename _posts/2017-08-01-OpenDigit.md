---
layout: post
title:  "OpenDIGIT: Open Digital Infrastructure for GLobal Infection Tracking"
date:   2017-08-01 11:22:52 -0500
categories:  opendigit projects
---

<blockquote>
You want to make a map of confirmed cases of Zika virus that have occurred in the last month.
</blockquote>

Shouldn't be too hard, right?

This task is just about impossible. There are a couple issues, but basically what it comes down to is: the data just doesn't exist.

<iframe width="560" height="315" src="https://www.youtube.com/embed/OC27DpB49Dk" frameborder="0" allowfullscreen></iframe>

**A video I made to highlight the OpenDIGIT project**

I recently came across a great visualization of [every single](https://www.flightradar24.com/32.64,-80.74/4) commercial aircraft's location, in real time. It made me wonder, how can we know, with such precision and timeliness, the location of these aircrafts, but not know very much at all about very basic things, like the location of cases of infectious diseases that impact millions of people each year? It seems to me that having this dataset available for researchers, doctors, and the public to interact with is a no-brainer. The insight we could gain from studying epidemic progression through populations and across space in real-time would be massive.

There are a lot of parties with a little bit of this data; from individual doctors, hospitals, and clinics, to local, regional, and national public health agencies, to international governmental and non-governmental organizations. There is not a standardized reporting protocol among these parties, and even if there was, where would the data go? The WHO seems the most likely candidate, and they have a relatively good data repository, but a lot of cases are never reported up the ladder to higher level agencies, making the data incomplete. Furthermore, and perhaps more importantly, even aggregating organizations like the CDC and the WHO don't produce any data in real time. While both agencies yield relatively good data about past epidemics, there is no information at all about ongoing outbreaks. Finally, due to patient privacy concerns and laws, the data is almost always aggregated to large geographical units. Indeed, most of the best data I could find was reported at a national enumeration unit. Together, that's a one-two punch to being able to use this data in predictive algorithms for developing prevention strategies: the data that is reported is out of date *and* it has been aggregated to a point that it is almost no longer useful in models that take spatial position into account.

I envision a dedicated system of databases for reporting cases of infectious diseases in real time, by doctors and nurses in the field. The data therein would be completely free and open, and anyone who wanted to could download the most recent authoritative reports of disease occurrence. The system would allow many, many more people to work with the data, improving the quantity and quality of insights related to how outbreaks spread. The visualizations and models produced could be completely revolutionary. At a higher level, shouldn't we be able to identify potential threats to our own health?

This won't be an easy task. I see three categories of challenges we'll need to overcome in pursuit of the ultimate goal.

1. ***Technical***: The dataset I'm proposing to make available would be huge. Indeed, it could be on the order of several billion data points, collected annually. The data would need to be available in real time with little latency and no downtime, and would need to be efficiently indexed and highly searchable. To make matters more complicated, the data would be messy, come from many different pipelines, and would likely be incompletely attributed. Altogether, the technical challenges are pretty approachable.

2. ***Ethical***: As much as it would be a good idea to have all of this data available at the push of a button, it is health data, and it is sensitive. Whatever solution we come up with would have to protect patient privacy. If we can't do that, we're probably doing as much harm as good -- and we'd probably get sued a bunch too. I believe that by providing only spatiotemporal coordinates (latitude, longitude, time), and by obfuscating these coordinates to reduce precision, we could provide a much higher resolution product than currently available while still ensuring ethical guidelines were followed. Strong collaborations with established NGOs in the field could alleviate some of these challenges and build trust.

3. ***Practical***: Even if the system was engineered perfectly and met all ethical standards, it would be useless if people didn't use it. This seems like it'd be the hardest part of the whole project. Because the data resides with so many different organizations, it would take a lot of work to get people to contribute to a new repository. And there's a big trust barrier to overcome as well. I believe that getting a couple established organizations to partner with early in the project lifecycle would be very helpful to this end. I'm thinking Doctors without Border, local health agencies, even WHO. The practical challenges are really the make it or break it of this project.

National Geographic is giving out a small bit of cash money to innovative new projects. I [applied](http://www.natgeochasinggenius.com/video/347) -- cross your fingers. If you've got any other good sources of funding that I should apply for, let me know.

I know that, given the right team and some funding, the results of this project could be game changing.
