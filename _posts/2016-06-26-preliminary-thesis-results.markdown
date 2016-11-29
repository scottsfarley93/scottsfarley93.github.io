---
layout: post
title:  "Preliminary Thesis Results: Update 6/26"
date:   2016-06-26 9:22:52 -0500
categories: Research Visualization
---

I've made it through 4,830 of the experiments I want to run for my thesis, so I'm taking this opportunity to reflect on the preliminary results that I have so far, visually check what I have so far, and make any necessary changes before doing the more expensive portion of the experiments.  So far, the results look okay, but definitely not what I expected.  The effect of the computing configuration on computing time seems to be minimal.  On the other hand, the effect of different experimental parameters is pretty significant.

### Status

#### Completion Statistics

| Property | Number Recored | Percentage of Completed | Percentage of Total |
| -------- | -------------- | ------------------ | ---------------- |
| Completed | 4830 | 92.18% | 5.72% |
| Error | 410 | 7.82% | 0.05% |
| Not Started | 59550 | 0% | 70.5 % |
| Removed* | 19680 | 0% | 23.3% |
| Total | 84470 | --% | 100% |

Removed experiments are those that specify fitting the BRT model with 10,000 training examples, which takes too long to be practical.  Instead, these were replaced with the *nSensitivity* experiment series, which tests the computing time sensitivity to different numbers of input points.





![Image](/assets/configs.png)


### Inspection of Results
One of the main problems I'm having in interpreting the results is that there are four separate experimental variables, which makes it difficult to properly interpret the influence of only one variable.  Of course, I want to isolate the effect of the computing memory and virtual cores.  



#### Influence of Additional Cores
![Cores](/assets/cores_totalTime.png)
If we plot vCPU vs. total time, there is no clear relationship.  The major spike at cores = 4 is due to the fact that I used a four core virtual machine to test the effect of different numbers of training examples.  These tests are not part of the experiments that I'm doing on every machine. If we remove these extraneous points, and treat them separately later, we can fit a linear model that shows a very slightly decreasing slope:

$$y=136.103 - 4.548Cores $$



#### Influence of Additional Memory
![Memory](/assets/mem_totalTime.png)
The effect of adding additional memory is slightly more clearly linear and decreasing than the effect of adding addition CPU cores, although it is still not particularly steep.  The linear model here takes the form:

$$y = 134.87 - 1.26GB $$



#### Influence of Spatial Resolution
As expected, higher resolution outputs take longer to process than their lower resolution counterparts. Because increasing spatial resolution results in an exponential number of cells, a linear model is not particularly well suited to this application.  An exponentially decreasing relationship can be seen in the prediction time.  

![Spatial Resolution](/assets/spatial_resolution.png)

The relationship between spatial resolution takes the form:

$$y = 145.27 - 52.78degree $$



#### Influence of Training Examples
The clearest relationship in all of the experimental variables is between total model time and number of training examples.  This relationship is clearly monotonically increasing, perhaps at a rate slightly more than linear.  The linear fit for these two variables is:

$$y = -180.5674 + 0.3348trainingExample$$

Nearly all of this additional time per training example comes from the time taken to fit the model.

![Training Examples](/assets/training_examples_totalTime.png)

### Fitting a Generalized Linear Model
Using the ```glm``` function in R, I fitted a generalized linear model to the data, using all four predictors.  Using all the predictors, the model takes the form:

$$y = -176.0644 + 0.3343trainingExamples - 2.2136Cores + 2.2905GBMemory - 50.6004degree $$

Using the Akaike Information Criterion (AIC) to evaluate the best model, I tried using different combinations of predictors. Using all four predictors, however, gives us the minimum AIC, so can be considered the best model out of all of the candidates.

$$AIC = 66800$$

### Evaluating the Accuracy of the GLM
Using an independent testing set of 200 random experiments, I used the glm above to predict the total time.  

![Prediction](/assets/obs_pred.png)

Unfortunately, our GLM doesn't do a great job at predicting the testing set to the observed values.  Perhaps I'm forgetting a variable...

We can also plot out the errors between observed ('true') values and predicted values.  Looking at the summary statistics, it appears my model will slightly under predict the total execution time.

![SummaryStats](/assets/summary.png)

### Variance Within Cells
One of the things I was most worried about when starting this project was the within-cell variance that I would encounter due to internal computer variations and other concurrent processes.  Looking at the preliminary data, it appears that the variance within the cells does increase as the total experiment time increases.  

![SD_Mean](/assets/sd_mean.png)

The linear model for standard deviation as a function of cell mean takes the form:

$$y = 15.7146 + 0.05261x$$

Where x is the cell mean.  Note: A cell is combination of cores, memory, training examples, and spatial resolution, and each cell is computed ten times.



### Computed Configurations

At this time I've computed:


| vCPU | Number Completed |
| ---------- | ---------------- |
| 1 | 1015 |
| 2 | 925 |
| 4 | 1435 |
| 6 | 1455 |


| GB Memory | Number Completed |
| --------- | ---------------- |
| 1 | 148 |
| 2 | 300 |
| 3 | 305 |
| 4 | 690 |
| 6 | 617 |
| 8 | 40 |
| 9 | 446 |
| 12 | 446 |
| 15 | 336 |
| 16 | 202 |
| 18 | 295 |
| 21 | 294 |
| 24 | 301 |
| 27 | 115 |
| 30 | 116 |
| 36 | 91 |
| 39 | 88 |
