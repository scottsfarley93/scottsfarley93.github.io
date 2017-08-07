---
layout: post
title:  "Cats and Dogs: Experimenting with Deep Learning"
date:   2017-08-01 11:22:52 -0500
categories:  opendigit projects
---

I've recently been trying to wrap my head around  deep learning algorithms and the frameworks used to
implement them. I've done most of my ML work in R and that's been great. However, R doesn't have great support for neural nets and its design is not great for huge datasets. There are several frameworks out there now that are specifically designed for implementing neural networks and simplifying their computation. Most of these libraries seem to be written in C (high speed) with python (numpy) wrappers. Specifically, I've been starting to experiment with TensorFlow and Caffe. Both are widely used. Both are in python.

As a fun project, I decided to teach my computer to tell the difference between pictures of dogs and pictures of cats. As recently as 2007, this was a very difficult computer vision problem, but advances in deep learning have made it relatively trivial. It's now a common toy example used to demonstrate the setup and execution of convolutional neural nets.  In this post, I'll introduce some of the code I used to build my cat/dog classifier, using TensorFlow, and specifically, a high-level wrapper called `TFLearn`. `TFLearn` is designed to make the coding of CNN models easier -- and man, it's pretty easy. The hardest part of developing the model, I found, was keeping track of the dimensions of your numpy arrays. Note: There are a lot of great tutorials out there that I drew heavily on while putting this script together. When I get a bit more time, I'd like to put together a more in-depth tutorial.

In the end, I was able to get a classifier with a ~99% accuracy on a validation set. I was pretty psyched about this, since this was my first foray into deep learning. It goes to show that these framework (TensorFlow, TFLearn, Caffe) can vastly simplify the process of building and training complex models.

There are four main parts of our program.

1. Get the data into python.
2. Prepare the data for the algorithm.
3. Define the network architecture.
4. Train the model and get the results.

**Input**: I used the cat/dog dataset available on Kaggle. This gives 25,000 labeled images of cats and dogs to work with. CNNs work with (multidimensional) arrays of pixel values, not raw images. Therefore, the first thing to do is to read the images into python.I actually found this first step to be the most challenging, since I haven't done much with image I/O in python. Most posts I found on the interwebs skipped this part entirely. In the end, I found that the step was pretty much trivial. The `CV2` and `skimage` libraries both provide simple methods of reading images to numpy arrays of pixel values.

{% highlight python %}
def load_img(filename, do_resize=True, do_save=False):
    _file = os.path.split(filename)[1]
    imx = x = io.imread(filename)
    if do_resize:
        x = imresize(imx, (IMG_SIZE, IMG_SIZE, 3))
    if do_save:
        io.imsave( "./../smalltrain/" + _file,x)
    if _file[0:3] == "cat":
        label = [1, 0]
    elif _file[0:3] == "dog":
        label = [0, 1]
    return (x, label)
{% endhighlight %}

*My function to read the pixel values and parse the label from a filename*

Of course, we have an entire directory of labeled training images, all of which we'd like to process.

{% highlight python %}
def load_dir(dir=IMAGE_DIR):
    X = np.zeros((n, IMG_SIZE, IMG_SIZE, 3), dtype='float64')
    Y = np.zeros((n, 2))
    idx = 0
    for _file in os.listdir(dir)[0:n]:
        filename = os.path.join(dir, _file)
        x, y = load_img(filename, do_resize=False, do_save=False)
        if x is not None:
            # x = resize_img_array(x)
            X[idx] = np.array(x)
            Y[idx] = y
        idx += 1
    return (X, Y)
{% endhighlight %}

*A function to read a directory of images to a big array of 3-D arrays of pixel values and a big 1-D array of labels*

TFLearn has its own image loader. However, it expects your images to be in separate directories for each category. I decided that (1) I liked having all my training examples in a single directory, and (2) I wanted the experience of writing a custom loader.

**Preprocessing**: The images you feed into a a CNN should all be of the same size. The loader I wrote above has an optional resize argument that will resize each image to `IMG_SIZE` x `IMG_SIZE` pixels, and save them to another diretory, so they can be loaded more quickly (without resizing) later on.

{% highlight python %}
...
x = imresize(imx, (IMG_SIZE, IMG_SIZE, 3)) ## 3 color channels
...
{% endhighlight %}

*Resize the images to be a consistent square size.*

You also often want to scale and center the training data to make it more consistent. TFLearn has built-in utilities for this.

{% highlight python %}
...
img_prep = tflearn.ImagePreprocessing()

# ZCenter
img_prep.add_featurewise_zero_center()

# Scale
img_prep.add_featurewise_stdnorm()
...
{% endhighlight %}

*Scale and center the data*

And finally, preprocessing the labels. TF expects a so-called 'one-hot' representation of the labels. Basically a binary vector of length *n* (for *n* classes) with a one for the class being represented and zeros for all other classes.

{% highlight python %}
...
if _file[0:3] == "cat":
    label = [1, 0]
elif _file[0:3] == "dog":
    label = [0, 1]
...
{% endhighlight %}

*Parse the labels*

**Defining network architecture**: With TensorFlow and TFLearn in particular, it is quite easy to build complex CNN (and other deep learning) models. The mathematics are all wrapped in tidy functions, so it's basically just plug-in-play. Yay abstraction!

{% highlight python %}
# Define the input
network = input_data(shape=[None, IMG_SIZE, IMG_SIZE, 3],
                 data_preprocessing=img_prep, name='input') ## do the image processing described above

# 32 conv filters, 3x3x3
conv_1 = conv_2d(network, 32, 3, activation='relu', name='conv_1')

# max pooling downsampling
network = max_pool_2d(conv_1, 2)

# 64 conv filters, 3x3x3
conv_2 = conv_2d(network, 64, 3, activation='relu', name='conv_2')

# max pool
network = max_pool_2d(conv_2, 2)

# 128 conv filters, 3x3x3
conv_3 = conv_2d(network, 128, 3, activation='relu', name='conv_3')

# max pool
network = max_pool_2d(conv_3, 2)

# 128 conv filters, 3x3x3
conv_4 = conv_2d(network, 128, 3, activation='relu', name='conv_4')

# max pool
network = max_pool_2d(conv_4, 2)

# 128 conv filters, 3x3x3
conv_5 = conv_2d(network, 128, 3, activation='relu', name='conv_5')

# max pool
network = max_pool_2d(conv_5, 2)

# first fully connected layer
network = fully_connected(network, 512, activation='relu')

# random dropout
network = dropout(network, 0.5)

# second fully connected layer
network = fully_connected(network, 512, activation='relu')

# second random dropout
network = dropout(network, 0.5)

# third fully connected layer
network = fully_connected(network, 512, activation='relu')

# third random dropout
network = dropout(network, 0.5)

# the classification --> 2 classes
network = fully_connected(network, 2, activation='softmax')

# Describe the optimizer
acc = Accuracy(name="Accuracy")
network = regression(network, optimizer='adam',
                     loss='categorical_crossentropy',
                     learning_rate=0.0005, metric=acc)
{% endhighlight %}

*Blueprint the CNN architecture*

I am far from an expert at the architecture. To be honest, I just dropped a lot of layers, in order, together. I did a bit of reading, and know the general sequences (conv-> pool) and (fully-connected -> dropout -> softmax) are pretty standard. Big name CNNs (AlexNet, etc) put a ton of thought into the sequence of the layers. I wonder what additional accuracy I could get by reordering the layers I have here.

**Train the model**: Finally, it is time to train the classifier. Here, I'm telling it to train on the training set `X` with labels `Y`. I also tell it to use a validation set for determining how accurate it is. I tell it to train for 12 epochs, meaning that all the data will be seen 12 times.

{% highlight python %}

model = tflearn.DNN(network, tensorboard_verbose=0)

model.fit(X, Y, validation_set=(test_X, test_Y),
      n_epoch=12, show_metric=True)
{% endhighlight %}
*Train the model*

** *Bonus* Saving/loading the model**

One thing I encountered that turned out to be very useful was saving and loading models. To save a model once it has been fitted,

{% highlight python %}
model.save('/path/to/model')
{% endhighlight %}
*Save the model*

You can reload your model using
{% highlight python %}
model.load('/path/to/model')
{% endhighlight %}
*Load the model*

And then you can just keep on chugging away at the training. The architecture of the model must be the same, between loads, and I believe the size of the input must be the same as well. But it allows you to easily pause your model training between epochs. A handy block then is,

{% highlight python %}
if os.path.exists("/path/to/model.meta"):
  model.load("/path/to/model")

model.fit(X, Y)

model.save("/path/to/model")
{% endhighlight %}

*Continue training if the model already exists*

***The complete code***

Here is the complete code I used in building this model:

{% highlight python %}

from skimage import color, io ## for reading the images
from scipy.misc import imresize ## for resizing the images

import tflearn
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import os
import random
import tflearn
from tflearn.layers.core import input_data, dropout, fully_connected
from tflearn.layers.conv import conv_2d, max_pool_2d
from tflearn.layers.normalization import local_response_normalization
from tflearn.layers.estimator import regression
from tflearn.data_utils import shuffle, to_categorical
import numpy as np
from sklearn.cross_validation import train_test_split
from tflearn.metrics import Accuracy


img_prep = tflearn.ImagePreprocessing()

IMAGE_DIR = "./../smalltrain/"
IMG_SIZE = 64
n = 25000

print "Imported all modules..."
def load_img(filename, do_resize=True, do_save=False):
    _file = os.path.split(filename)[1]
    imx = x = io.imread(filename)
    if do_resize:
        x = imresize(imx, (IMG_SIZE, IMG_SIZE, 3))
    if do_save:
        io.imsave( "./../smalltrain/" + _file,x)
    if _file[0:3] == "cat":
        label = [1, 0]
    elif _file[0:3] == "dog":
        label = [0, 1]
    return (x, label)



def load_dir(dir=IMAGE_DIR):
    X = np.zeros((n, IMG_SIZE, IMG_SIZE, 3), dtype='float64')
    Y = np.zeros((n, 2))
    idx = 0
    for _file in os.listdir(dir)[0:n]:
        filename = os.path.join(dir, _file)
        x, y = load_img(filename, do_resize=False, do_save=False)
        if x is not None:
            # x = resize_img_array(x)
            X[idx] = np.array(x)
            Y[idx] = y
        idx += 1
        if (idx % 1000 == 0):
            print "Processed " + str(idx)
    return (X, Y)




X, Y = load_dir()
X, test_X, Y, test_Y = train_test_split(X, Y, test_size=0.1, random_state=42)
# Y = to_categorical(Y, 2)
# Y_test = to_categorical(test_Y, 2)



img_prep.add_featurewise_zero_center()
img_prep.add_featurewise_stdnorm()

print "defining network"

network = input_data(shape=[None, IMG_SIZE, IMG_SIZE, 3],
                 data_preprocessing=img_prep, name='input')

conv_1 = conv_2d(network, 32, 3, activation='relu', name='conv_1')
network = max_pool_2d(conv_1, 2)
conv_2 = conv_2d(network, 64, 3, activation='relu', name='conv_2')
network = max_pool_2d(conv_2, 2)
conv_3 = conv_2d(network, 128, 3, activation='relu', name='conv_3')
network = max_pool_2d(conv_3, 2)
conv_4 = conv_2d(network, 128, 3, activation='relu', name='conv_4')
network = max_pool_2d(conv_4, 2)
conv_5 = conv_2d(network, 128, 3, activation='relu', name='conv_5')
network = max_pool_2d(conv_5, 2)
network = fully_connected(network, 512, activation='relu')
network = dropout(network, 0.5)
network = fully_connected(network, 512, activation='relu')
network = dropout(network, 0.5)
network = fully_connected(network, 512, activation='relu')
network = dropout(network, 0.5)
network = fully_connected(network, 2, activation='softmax')
acc = Accuracy(name="Accuracy")
network = regression(network, optimizer='adam',
                     loss='categorical_crossentropy',
                     learning_rate=0.0005, metric=acc)
model = tflearn.DNN(network, tensorboard_verbose=0)


print "Training network"
if os.path.exists("~/Documents/cats_and_dogs/tensorflow/model.model.meta"):
  model.load("model.model")

model.fit(X, Y, validation_set=(test_X, test_Y),
      n_epoch=12, show_metric=True)

model.save("model.model")
{% endhighlight %}
