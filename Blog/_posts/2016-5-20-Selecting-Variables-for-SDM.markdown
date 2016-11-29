---
layout: post
title:  "Selecting Variables for Species Distribution Models"
date:   2016-05-20 11:22:52 -0500
categories: Research SDM
---

When running statistical models, like multiple linear regression or generalized linear models, it is typically not a good idea to use multiple predictor variables that are highly correlated with one another, as it may result in an unstable final model. This guideline also applies to many of various flavors of species distribution models (SDMs), which take in two or more (usually climatic) predictor variables to model a species response to environmental gradients.  Given modeled climate output, the SDM models can be used to estimate the probability of a species occurring in a different time period, say at the last glacial maximum -- 22,000 years ago--, or in 2100, once humans have contributed several degrees to the earth's temperature.  While these models differ in their statistical techniques, most behave a little like multiple regression, where a set of predict variables are combined in some parametric or non-parametric way to estimate the response as a function of these inputs.  Thus, just like in a standard regression, using highly correlated climatic predictor variables can  contribute to instability in the modeled response.  This post describes the methods I chose to identify correlated variables and choose the ones I wanted to remain in my study.
<blockquote>Collinearity can increase estimates of parameter variance; yield models in which no variable is statistically significant even though R<sup>2</sup><sub>y</sub> is large; produce parameter estimates of the “incorrect sign” and of implausible magnitude; create situations in which small changes in the data produce wide swings in parameter estimates; and, in truly extreme cases, prevent the numerical solution of a model <a href="http://web.unbc.ca/~michael/courses/stats/lectures/VIF%20articlea.pdf">(O’BRIEN, 2007)</a></blockquote>
<h3>The data</h3>
The data I am using here is a set of 19 <a href="https://pubs.usgs.gov/ds/691/ds691.pdf">bioclimatic variables</a>, commonly used in SDMs, that describe potentially meaningful ecological parameters, such as average precipitation in the warmest quarter of the year, and are derived from monthly climatic GCM output.  My data is derived from a 0.5x0.5 degree <a href="http://www.cesm.ucar.edu/models/ccsm3.0/">CCSM3</a> climate model run, and is in raster grid format.
<h3>Correlation</h3>
The first natural thing to do when looking at collinearity between variables would be to look at the pairwise correlation between them.  This will show us the correlation between each raster, and every other raster in the set.  We're going to first do this by taking a large random sampling of spatial coordinates from the raster  set.  I have my predictor variables stored as a RasterStack, so I can use the sampleRandom tool in the raster package to generate n random points over my grid.  I now how a dataframe that shows the climatic values at each of the random points. I can scatter them together, and interrogate each one for pearson's r correlation.  <a href="http://www.scottsfarley.com/blogblog_img/bio2_7.png"><img align="right" src="http://www.scottsfarley.com/blog/blog_img/bio2_7.png" alt="bio2_7" width="415" height="340" /></a>

The figure here shows an example of scattering biovariable 2 with biovariable 7, resulting in an R<sup>2 </sup> value of ~0.45. Now, I can do this procedure for all 19 of my predictor variables, but that would be kind of tedious.  We would be left with 361 R<sup>2 </sup>values to compare, and 361 scatter plots to <a href="http://www.scottsfarley.com/blog/blog_img/file-page1.jpg"><img class="wp-image-13 alignleft" align="right" src="http://www.scottsfarley.com/blog/blog_img/file-page1.jpg" alt="file-page1" width="337" height="436" /></a>interrogate.  Sounds annoying.  We can simplify the visual comparison somewhat by plotting the correlation matrix. You can derived the correlation matrix for pearson's r by using the <a href="http://www.inside-r.org/packages/cran/raster/docs/layerStats">layerStats</a> function in the raster package.  Using the corrplot library in R, we can format the correlation matrix so that we can easily visualization the magnitude and direction of the correlations.  But, pretty much all we get out of this is that some variables are very well correlated and others are less correlated.  Not easy to compare, still annoying.
<h3>Variance Inflation Factor</h3>
The variance inflation factor (VIF) was conceived for exactly this purpose -- comparing collinearity between regression predictors. The VIF quantified the expected amount of variance in a regression coefficient that is due to collinearity in the predictors. The VIF is bounded on the bottom by 1, and has no upper bound. A VIF of 1 indicates that that no extra variance is caused by collinearity in the factors.  A higher VIF indicates higher amounts of variances caused by collinearity, for example, a VIF of 5.1 suggests 510% extra variance in the regression coefficient. VIFs are comparable so we can directly compare and choose variables to eliminate based on this index.
<h6>Calculating the VIF:</h6>
Calculating the VIF index is pretty simple, actually, and can be done very quickly.  To calculate the index for layer <i>i</i>, run a regression of X<sub>i </sub> in terms of all of the other predictors that you wish to use.  The form of the equation is:

X<sub>i</sub> = α<sub>j</sub>X<sub>j</sub> + α<sub>k</sub>X<sub>k</sub> + ... + α<sub>n</sub>X<sub>n</sub> + ε<sub>i</sub>

Note that this is not a regression of the response variable for the model, instead, its a regression of the layer in terms of linear combinations of the other predictors.

Now, calculate the R<sup>2</sup><sub>i</sub> coefficient of determination value for X<sub>i</sub>.

Finally, calculate the VIF for predictor <i>i</i> by using VIF=1/(1-R<sup>2</sup><sub>i</sub>).

If R<sup>2</sup><sub>i</sub> is high for this layer, then the denominator of the VIF equation will be very small.  Once evaluated, if R<sup>2</sup><sub>i</sub> is close to 1 (perfectly correlated) then the VIF will go to infinity. On the other hand, if R<sup>2</sup><sub>i</sub> is not correlated with any of the other predictors at all (R<sup>2</sup><sub>i</sub> = 0), then the denominator of the VIF will be 1-0, and the VIF term will evaluate to just 1.  We can do this for each one of our raster predictor layers, and then compare apples-to-apples how collinear they are.

I calculated the inflation factor using the R package <a href="https://cran.r-project.org/web/packages/usdm/usdm.pdf">usdm</a>, which made the raster calculations quite convenient.  Since R is open source, you can check out the source to see exactly what it's doing, or you could probably roll your own VIF script pretty easily. In any case, the vifcor function in usdm was designed for finding collinear variables for species distribution models, returns both the VIF and the R<sup>2 </sup> value, was easy to use, and all-in-all, seemed like the right tool for the job.
<h3>Using the VIF</h3>
So, now we have the variance inflation factor for all of our layers we can figure out which ones are the most collinear and eliminate the ones might cause instability in our model. Plotting out the results of the VIF calculation, we can see what the correlation matrix plot suggested earlier. Some variables, like #11 and #1, are super, super correlated with the other variables in the set.  But now we know exactly how much that would affect the predictive model.
<a href="http://www.scottsfarley.com/blog/blog_img/vif_plot-1.png"><img align='right' src="http://www.scottsfarley.com/blog/blog_img/vif_plot-1-791x1024.png" alt="vif_plot-1" width="350" height="425" /></a>

Scholars debate how much inflation should be allowed in the model.  Some say 10 (which appears to the the internet's rule of thumb), some say five, some say 2.5.  In any case, variable 11's VF of ~7000 is probably above the acceptable threshold. For my purposes, all of the VIFs seemed quite high (none under 2.5).  So, perhaps I should use different predictor variables.  Since this set of biovariables is common standard for SDM modeling, I think its worth noting just how correlated they are with each other and the potential for instability that this causes.  However, since they are such a standard, I decided to just take the seven least correlated predictors and use those as my final predictor set.
<table width="500">
<tbody>
<tr>
<td width="53">Biovariable</td>
<td width="53">VIF</td>
<td width="234">Interpretation</td>
</tr>
<tr>
<td>2</td>
<td>36.405</td>
<td>Mean Diurnal Range</td>
</tr>
<tr>
<td>7</td>
<td>9.597</td>
<td>Temperature Annual Range</td>
</tr>
<tr>
<td>8</td>
<td>26.479</td>
<td>Mean Temperature of Wettest Quarter</td>
</tr>
<tr>
<td>15</td>
<td>94.520456</td>
<td>Precipitation Seasonality</td>
</tr>
<tr>
<td>18</td>
<td>17.879</td>
<td>Precipitation of Warmest Quarter</td>
</tr>
<tr>
<td>17</td>
<td>12.981</td>
<td>Precipitation of Driest Quarter</td>
</tr>
</tbody>
</table>

When we reduce our predictor to use these variables and re-run the VIF calculation, our variance inflation is much lower (since there are less correlated things to be collinear with), and the analysis falls within the accepted standards for variable collinearity.  The maximum correlation that remains is between #2 and #15, at only R=0.51, which seems reasonable.

<table width="250">
<tbody>
<tr>
<td width="76">Variable</td>
<td width="53">VIF</td>
</tr>
<tr>
<td>bio2</td>
<td>2.349056</td>
</tr>
<tr>
<td>bio7</td>
<td>1.554106</td>
</tr>
<tr>
<td>bio8</td>
<td>1.660181</td>
</tr>
<tr>
<td>bio15</td>
<td>1.721449</td>
</tr>
<tr>
<td>bio18</td>
<td>1.434528</td>
</tr>
<tr>
<td>bio19</td>
<td>1.362137</td>
</tr>
</tbody>
</table>

In most cases, it is good to reduce multicollinearity between predictors.  However, it's also important to remember to keep ecologically meaningful predictors in your set so that you're not just producing models of statistical artifacts.
