---
layout: post
title:  "My Thesis Proposal in A Nutshell"
date:   2016-05-22 11:22:52 -0500
categories: Research
---
I was recently tasked with writing a formal proposal for my thesis as the final paper in one of my courses.  The final draft of the proposal was 21 single spaced pages.  I figured I would write a shorter and perhaps more accessible summary of the work I am starting on so those of you out there that are curious what I'm working on don't have to wade through that.  If you do want to see the real thing, references, equations, and all, you can find it <a href="http://scottsfarley.com/assets/Farley_Thesis_Proposal_final.pdf">here</a>.
<h4>In One Sentence:</h4>
I am attempting to develop a well-performing predictive model that, given a species distribution model user's goals and requirements, determines the optimal computing configuration for that modeling routine by balancing the time spent modeling with the cost of the computing equipment used.


<h4>More computers: more money, faster execution?<a href="http://www.scottsfarley.com/blog/blog_img/figure1.png"><img class="alignright wp-image-19 " src="http://www.scottsfarley.com/blog/blog_img/figure1.png" alt="figure1" width="385" height="271" /></a></h4>
We work in a modern computing world, where infinitely many computing resources (CPUs, memory, etc) are available for an infinite  cost.  As cloud computing becomes increasingly popular, I can purchase a seemingly endless number of computing nodes to do my work on. Rather than purchasing these resources, providers like Google or Amazon front the cost of buying and maintaining thousands of servers in a massive datacenter somewhere, and then charge me a utility fee for their use based on how many hours I use them for.  On the other hand, I can still purchase a desktop, laptop, or server, and use it continuously for several years -- a solution that will likely be of cheaper and less powerful than a cloud solution.  <a href="http://www.scottsfarley.com/blog/blog_img/figure2.png"><img class="alignright wp-image-20 " src="http://www.scottsfarley.com/blog/blog_img/figure2.png" alt="figure2" width="390" height="258" /></a>

So, I can get as much computing power as, say, Netflix, but (1) I couldn't pay for it, and (2) adding a gargantuan amount of computing power to my modeling problems probably wouldn't be worth it.  Faster CPUs and additional CPUs can decrease the running time of an algorithm by increasing the number of instructions per second that can be executed by the computer. Adding more memory reduces the number of times the computer has to go all the way to the hard disk to get new instructions.  In any case, if my algorithms don't run in parallel 100% of the time (theoretically impossible [I think]), I will always run into a lower bound on execution time called Amdhal's Law, which says that the addition of machines to a computer program increases its execution time proportional to the fraction of the algorithm that can be run in parallel.  Since I will be working with serial algorithms, running on only a single CPU core, this doesn't totally apply, but it makes the point that throwing more and more and more computing power at an algorithm, especially one not specially designed to run in a super-computing environment, doesn't always come with large gains in performance. Moreover, most people, especially those in an academic setting, don't have the financial ability to buy a really large amount of time on advanced cloud systems.  Potential of going over budget, in either time or money, will typically result in a modification of the project towards a less computationally intensive research question.
<h4>Models and Model Users</h4>
In this work, I'm focusing specifically on species distribution models.  These are a class of statistical models that relate a species' abundance (or presence) with environmental gradients. In simpler terms, I know where a plant species grows now, so I can look at all of the properties that make up its niche at each occurrence -- precipitation, winter temperature, annual mean temperature, etc-- to build a model of how it responds to changes in these variables.  I then use this model to predict how a species may fare in a new place, or, in my case, a new time period, such as 2100AD after humans have totally messed up the climate system.

These models get used for a lot of things: reserve planning, invasive species identification, ecological theory testing, phylogeographic studies, climate model verification, etc.  Everyone using these models has a specific goal they wish to accomplish by employing the modeling framework: each study has some required geographic extent, spatial resolution, number of points used to train the model, number of predictors used to fit the model, accuracy required, number of time periods to project onto, etc...

<a href="http://www.scottsfarley.com/blog/blog_img/figure4.png"><img class="alignright wp-image-22 " src="http://www.scottsfarley.com/blog/blog_img/figure4.png" alt="figure4" width="410" height="305" /></a>Because of the diverse array of traits that each user brings to the modeling table, each is going to spend a different amount of time spent modeling.  For example, <a href="http://onlinelibrary.wiley.com/doi/10.1111/j.2006.0906-7590.04596.x/abstract">a study that compares 226 species, 16 modeling algorithms, over six world regions, </a>is going to spend a lot longer modeling than a study that say, looks at the invasive potential of a single species at 2100, using a single modeling technique.  The first study might benefit from a cloud computing solution, where the latter probably would not.

But there are other things that affect a modeling workflow's time to complete as well, beyond just time time needed to compute a model. If I am starting a modeling project, I need to go and find the data, both for the points of occurrence, usually from a natural history museum collection or other information facility, and for the predictor layers, which are usually climate rasters.  I need to manage all of this data, keep it in the right projection, spatial extent, and spatial resolution, and not lose it on my hard drive (there is a lot of data to keep track of).  I need also need to keep track of the output from the models, and keep that organized.  Finally, I need to be able to evaluate the output of the model, see if it did an accuracy job of predicting species abundance, and determine whether the output answers my original questions.

All of these get tacked on to the raw computing time of the algorithm, and are mostly a factor of the data (what is it? how large is it? how complex is it?) and me (how skilled am I at manipulating the data? how familiar am I with interpreting SDM output?).  I can add all of these time costs up, along with the time to execute, and for any combination of model data, user, skill level, and computing configuration, get an estimate of how long that modeling procedure would take. For my work, I will hold model data, user, and skill level constant as experimental parameters, and look at how the total time to execute changes with the addition of more advanced computing solutions. Future work could look at differences in interface complexity, data management, and other facets to get a more complete picture of the modeling workflow.
<h4>Hypothesis</h4>
Now we have all of the pieces in place:
<ul>
 	<li>Each model user has her own set of modeling traits, and thus, her own continuous curve of model execution time,</li>
 	<li>Computer programs will decrease in execution time with the addition of more computing power, but the time will never go to zero,</li>
 	<li>More computers = more money<a href="http://www.scottsfarley.com/blog/blog_img/figure3.png"><img class="alignright wp-image-21 " src="http://www.scottsfarley.com/blog/blog_img/figure3.png" alt="figure3" width="324" height="294" /></a></li>
</ul>
&nbsp;

So, my hypothesis is that we can find an optimal computing solution for each set of modeling activities, and that optimal will occur at the joint of time spent modeling and dollars spent on computing time.
<h4>Research Questions</h4>
Based on my hypothesis, I am asking the following research questions:
<ol>
 	<li>Does this seem reasonable? Do different algorithm configurations really respond differently to different computing configurations? Does the addition of cloud computing and/or high powered servers affect the outcome of the models?</li>
 	<li>Can I build a predictive model for the total time to complete a modeling study that outperforms a null model that suggests that all researchers just buy a single desktop computer to do their modeling on?</li>
 	<li>Can I identify any users whose modeling traits suggest that they should perform their work in a cloud environment? Are there any other clear clusters of modeling activities about which we can make a statement regarding their modeling and computing resources?</li>
</ol>
&nbsp;

&nbsp;
