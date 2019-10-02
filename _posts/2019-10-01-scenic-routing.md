---
layout: post
title:  "Scenery-based routing: A deep learning approach"
date:   2019-10-01
categories: machine-learning
---

<style>
  .blogImg{
    width: 50%;
  }
</style>

tl;dr; as a hobby project, I’ve been developing a method for routing vehicles over a road network optimizing for the scenic-ness of the path by using street-level imagery. Here are some take-aways I thought could be more broadly applicable.

What if we could give directions not based on time or distance, but on characteristics of the road the user will drive on?

If all else were equal, I’d rather drive on this…

![](https://d2mxuefqeaa7sj.cloudfront.net/s_F816EA582A1DC83209F892C5D7B2B73978791B5CF81606E539981E26315FE35B_1513980153115_thumb-2048.jpg)


than on this…

![](https://d2mxuefqeaa7sj.cloudfront.net/s_F816EA582A1DC83209F892C5D7B2B73978791B5CF81606E539981E26315FE35B_1513980145644_thumb-2048+1.jpg)


Typically, we route users by minimizing the time it will take them to get from Point A to Point B. While this will be the best objective in most cases, there are cases when a user may maximize other objectives, such as the beauty of the scenery encountered along their route. Consider a user planning a road trip or who has extra time in a foreign city. They know they’d like to travel from A to B, but they’d rather experience the place than solely minimizing the time it takes to traverse the route.

\ I’ve tinkered with a way to assign quantitative metrics of scenic value based on street-level imagery to ways in a network graph so that the network can be used in routing applications. I think this could be of broader interested, so I’m sharing some of my explorations here.


## Approach

**Objective**: build a routable road network where the edge weights are a quantitative metric of the "scenic-ness" of that edge.

To accomplish this we’ll use a machine learning approach to classify road segments as “scenic” or “not scenic”. First, we’ll gather a bunch of Mapillary images from "scenic" road segments and a bunch of images from “un-scenic” road segments. Then we’ll build a model to learn the difference between the two. Using this model, we’ll test images from all roads in our network to a 0 (not scenic) to 1 (very scenic) score for each image. We can test multiple images for each segment and then assign the average value of these images as the “scenic score” for that segment. Then we ingest the road graph into a routing engine (postgres/postgis/pgrouting stack).


## Data


1. **Positive Labels:** We know that some road segments are objectively more scenic than others. State and local governments classify roads that are especially beautify and natural as scenic highways. In California,


> A highway may be designated scenic depending upon how much of the natural landscape can be seen by travelers, the scenic quality of the landscape, and the extent to which development intrudes upon the traveler's enjoyment of the view.

We can get the location of official scenic highway designations from the Caltrans, the state highway department. Any images taken from along these segments should, thus, have a high scenic quality. These images will serve as our positive training examples.

![](https://d2mxuefqeaa7sj.cloudfront.net/s_F816EA582A1DC83209F892C5D7B2B73978791B5CF81606E539981E26315FE35B_1513981117131_Screen+Shot+2017-12-22+at+2.18.22+PM.png)

2. **Negative Labels:** Negative image labels are harder to come by without manual tagging. There are plenty of non-scenic roads that are just regular roads, without any official designation. However, I didn’t feel like doing any manual image tagging, so I used **interstates** as road segments that were prototypically un-scenic.
![](https://d2mxuefqeaa7sj.cloudfront.net/s_F816EA582A1DC83209F892C5D7B2B73978791B5CF81606E539981E26315FE35B_1513981240871_Screen+Shot+2017-12-22+at+2.18.59+PM.png)

3. **Testing/Routing Network:** To maximize the number of roads that would have Mapillary coverage, while keeping compute times reasonable, I chose primary and secondary roads as the routing dataset. This means that there won’t be a lot of local variation, but it let’s us experiment with the whole state pretty easily.
![](https://d2mxuefqeaa7sj.cloudfront.net/s_F816EA582A1DC83209F892C5D7B2B73978791B5CF81606E539981E26315FE35B_1513981462004_Screen+Shot+2017-12-22+at+2.24.05+PM.png)

##
4. **Images:** I iterated over all the features in each dataset. For each feature, I randomly sampled ten points along the line. For each randomly sampled location, I downloaded (up to) ten randomly selected streetview images from within 100m of that location, using the Mapillary API.


## Visual Analysis

To see if an algorithm had even a chance of learning the difference between these two classes, I did a TSNE on the images. I plotted the results and checked to see how clearly discriminated the clusters were. If all the images were really jumbled together, any algorithm would have little change to delineate between the classes.


It turns out that groups of positive and negative images are pretty tightly clustered across the embedded space.

![](https://d2mxuefqeaa7sj.cloudfront.net/s_F816EA582A1DC83209F892C5D7B2B73978791B5CF81606E539981E26315FE35B_1513985376886_embedding_2.png)


They’re not perfectly clustered, but it looks like we’ll have a good shot at choosing one class or the other.

These figures are also just fun to look at.


![](https://d2mxuefqeaa7sj.cloudfront.net/s_F816EA582A1DC83209F892C5D7B2B73978791B5CF81606E539981E26315FE35B_1513986009415_embedding_4.png)



## Training

I used Keras to train a pretty simple deep neural net. It looked like this (but could definitely used some optimization):


   
    _________________________________________________________________
    Layer (type)                 Output Shape              Param #  
    =================================================================
    conv2d_32 (Conv2D)           (None, 100, 100, 50)      1400      
    _________________________________________________________________
    batch_normalization_29 (Batc (None, 100, 100, 50)      400      
    _________________________________________________________________
    max_pooling2d_28 (MaxPooling (None, 50, 50, 50)        0        
    _________________________________________________________________
    conv2d_33 (Conv2D)           (None, 50, 50, 50)        22550    
    _________________________________________________________________
    batch_normalization_30 (Batc (None, 50, 50, 50)        200      
    _________________________________________________________________
    max_pooling2d_29 (MaxPooling (None, 25, 25, 50)        0        
    _________________________________________________________________
    conv2d_34 (Conv2D)           (None, 25, 25, 50)        22550    
    _________________________________________________________________
    batch_normalization_31 (Batc (None, 25, 25, 50)        100      
    _________________________________________________________________
    max_pooling2d_30 (MaxPooling (None, 12, 12, 50)        0        
    _________________________________________________________________
    conv2d_35 (Conv2D)           (None, 12, 12, 50)        22550    
    _________________________________________________________________
    batch_normalization_32 (Batc (None, 12, 12, 50)        48        
    _________________________________________________________________
    max_pooling2d_31 (MaxPooling (None, 6, 6, 50)          0        
    _________________________________________________________________
    conv2d_36 (Conv2D)           (None, 6, 6, 50)          22550    
    _________________________________________________________________
    batch_normalization_33 (Batc (None, 6, 6, 50)          24        
    _________________________________________________________________
    max_pooling2d_32 (MaxPooling (None, 3, 3, 50)          0        
    _________________________________________________________________
    flatten_8 (Flatten)          (None, 450)               0        
    _________________________________________________________________
    dense_22 (Dense)             (None, 512)               230912    
    _________________________________________________________________
    dense_23 (Dense)             (None, 256)               131328    
    _________________________________________________________________
    dense_24 (Dense)             (None, 1)                 257      
    =================================================================
    Total params: 454,869
    Trainable params: 454,483
    Non-trainable params: 386
    _________________________________________________________________
   

It contains five convolutional layers and three dense layers.

After some training, I was able to get to about **87% accuracy** on a validation set. There were more scenic road segments than interstate segments in my dataset, so I selected an even number of images in each class to prevent the model output having a class imbalance bias.

More training, more images, and a better network architecture could probably lead to better accuracy. But 87% accuracy seems pretty good for now.


## Model Predictions

Below are some randomly chosen model predictions and their associated scenic-score (1 is most scenic).

1. What did it think was scenic?
![](https://d2mxuefqeaa7sj.cloudfront.net/s_F816EA582A1DC83209F892C5D7B2B73978791B5CF81606E539981E26315FE35B_1513982402423_image.png)

2. What did it think was not scenic?
![](https://d2mxuefqeaa7sj.cloudfront.net/s_F816EA582A1DC83209F892C5D7B2B73978791B5CF81606E539981E26315FE35B_1513982426770_image.png)

4. What did it **incorrectly** predict as scenic (but actually wasn’t):
![](https://d2mxuefqeaa7sj.cloudfront.net/s_F816EA582A1DC83209F892C5D7B2B73978791B5CF81606E539981E26315FE35B_1513982463345_image.png)

5. What did it **incorrectly** predict as not scenic (but actually was):
![](https://d2mxuefqeaa7sj.cloudfront.net/s_F816EA582A1DC83209F892C5D7B2B73978791B5CF81606E539981E26315FE35B_1513982533854_image.png)


It looks the network is doing a pretty good job at delineating roads that appear scenic from those that appear not scenic.

## Routing

After training the model, I downloaded multiple images for every segment in the testing network. Some segments didn’t have Mapillary images on them (😞 ), so they were assigned a default value of 0.5 (neither scenic nor unscenic). For those segments that did have images, each images was given a predicted score of [0, 1]. For segments with more than one image (most segments), the image scores were averaged together to create a single numeric scenic-ness score for each segment.

I then ingested the geojson with the road geometries and the scenic-ness scores into a postgres/postgis table.

Follow some tutorials I found online, I made it routable by creating a network topology. Once it was properly set up, I could query the resulting table with sql to find the most scenic route between two points:


    SELECT * FROM pgr_dijkstra(
      'SELECT id,
           source,
           target,
           1 - meanScore as cost
          FROM edges_noded',
      1, 5,
      directed := false);


I had to correct for the fact that the scenic-ness scoring routine I developed gave more scenic routes a higher score (closer to one), but the shortest path algorithms attempt to find the lowest cost routes through a graph (e.g., I selected `1-meanScore` as cost instead of just `meanScore` as cost).

![Shortest Route](https://d2mxuefqeaa7sj.cloudfront.net/s_F816EA582A1DC83209F892C5D7B2B73978791B5CF81606E539981E26315FE35B_1513986747492_Screen+Shot+2017-12-22+at+3.52.13+PM.png)

Shortest Route

![Least Scenic Route](https://d2mxuefqeaa7sj.cloudfront.net/s_F816EA582A1DC83209F892C5D7B2B73978791B5CF81606E539981E26315FE35B_1513986747552_Screen+Shot+2017-12-22+at+3.52.02+PM.png)

Least scenic route

![Most Scenic Route](https://d2mxuefqeaa7sj.cloudfront.net/s_F816EA582A1DC83209F892C5D7B2B73978791B5CF81606E539981E26315FE35B_1513986747641_Screen+Shot+2017-12-22+at+3.51.52+PM.png)

Most scenic route


*Optimal routes between San Diego and Eureka, according to different optimization criteria.*

![](https://d2mxuefqeaa7sj.cloudfront.net/s_F816EA582A1DC83209F892C5D7B2B73978791B5CF81606E539981E26315FE35B_1513986997322_Screen+Shot+2017-12-22+at+3.56.25+PM.png)


*The most scenic route between San Jose and the Inner Sunset, according to the model.*


## What’s Next?

There’s a lot more we could do with this type of model.


- Improve the model:
  - More training epoches
  - More training data
  - More layers
- Expand the model:
  - Include more states than just California. Different states’ scenic roads are likely to run through vastly different types of environments. To capture this variety, we’d want to train the model with data from these different environments.
- Improve the network
  - Normalize the graph.
  - There are some topology issues in the graph that, if corrected, would improve routeability
  - Include more than just primary roads. Mapillary covers more than just the primary and secondary roads. To really get good routes, we’d need to include many more roads than the skeleton network shown here. This would vastly increase computation, but would probably be worth it because we could do much better small-scale routing (like across a city).
- Improve the cost function — develop something like a distance-weighted scenic score. This would favor scenic roads of non-scenic ones, but wouldn’t take me all the way across the state.


- Extend the ideas to different objectives.
  - ***bike-ability:*** train on images of [bicycle boulevards](https://en.wikipedia.org/wiki/Bicycle_boulevard) — streets that have been optimized for bicycle traffic. Then predict the level of bicycle friendly-ness for the road network. This could be a nice addition to biking directions by ensuring that, when a street is not technically classed as a bike-lane, it is still nice to bike on. It might also allow better biking directions in cities that do not have officially designated bike-ways or in cities for which this data is not available.
 