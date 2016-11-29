---
layout: post
title:  "Adding Shareable URLs to IceAgeMapper"
date:   2016-08-21 8:22:52 -0500
categories: Research Paleo
---
One of the features Rob suggested I add to Ice Age Mapper during our last meeting was a dynamic url that would record the current state of the application, and could thus be shared between users. I took a stab at that last week, and got it working pretty well.  I thought it would be a lot of re-coding from the ground up, but it turns out that most of what I had written previously could be easily converted to load a URL string.  My application only generates a shareable URL when the user clicks the 'Share' button, but in theory, the app could easily be modified to generate a new URL each time an action was taken.  I think this would actually ***Not*** be a good idea, because it would mean there would be an entry in the user's web history for each action they took inside of the application, meaning they would have to click the back button like a million times if they messed up.  Good to know support exists for that though.

Another plus of designing a dynamic state URL is that it can be used to share the current configuration on Twitter, GooglePlus, by email, or other social media.  While not critical for our purposes, it seems like it's never a bad thing to tap into social channels.

There are two main parts of implementing a dynamic state url: generating and parsing.  The generating phase includes functions that get the current state of the system and translate them into a URL variable, and then string the URL variables together into a complete URL.  In the parsing phase, the URL variable parse (or not, if they don't exist) and translate them into function calls to re-generate the desired state.  Before starting to code, make a list of the parts of the state you want to keep track of.  Do you want to keep track of every click made to get to a certain configuration or just the configuration itself?

I decided I want to keep track of the following parts of the application state:  

1.  *Taxon*: the data that is currently being displayed, as returned from a Neotoma API call.
2.  *Map Center*: Geographic center of current map view, as latitude and longitude.
3.  *Map Zoom*: Zoom level of current map view.
4.  *Minimum Year*: Minimum (most recent) year in temporal view.
5.  *Maximum Year*: Maximum (most distant) year in temporal view.
6.  *Panel Configuration*: For each panel, is it open or closed?  Currently, there are three panels: Taxonomy, Site, and NicheViewer.
7.  *Layer Configuration*:  For each layer, is it visible or hidden?  Currently, there are three layers: Ice Sheets, Sites, and Heatmap.

You'll likely find that there are things you want to add to the state at a later time, but with the general framework, such additions should be really easy.

### Part 1: Generation
To generate the URL, I used the ```URI.js``` library.  This [library](https://medialize.github.io/URI.js/) makes it easy to parse, add to, and validate URL strings on the current window, or another window.  Generate a new URI for the current window location:
{% highlight js %}
  uri = new URI()
{% endhighlight %}
And then add query variables as needed, using:
{% highlight js %}
  uri.addQuery('key', "value")
{% endhighlight %}

The next, and most intensive step in this phase to get the values of each state component at this point in time.  For some, like the leaflet map center and zoom, it will be easy to do this, because the leaflet map object already tracks these for you (```map.getCenter()``` and ```map.getZoom()```).  Depending on your coding style, you may already have pointers to some of the components, or you may need to devise a way of going to get the values.  Because I chose to only generate the new state URL once the user has requested it, we can write some functions to go get the values at the time they click the button. Mostly, though, I use a ```globals``` object, that keeps references to a variety of important properties that I might want to access throughout my code.  I think this is a good compromise between having a ton of global variables floating around, and totally scoping the variables into functions.  Maybe I'm wrong, not sure...

Anyways, for each of my state components, I go get it's value, and then set it to our new ```uri``` object.  Remember that the properties should be Boolean, String, or Numeric types, rather than object or something else that can't be easily serialized into the URI.  This can be a little tricky, but it's important so think about how you can make it work.  For example, if I want to populate a panel with data, I can't easily serialize the data into the URI string.  Instead, I tell the URL that I do want to populate that panel, and I want that panel to automatically open.  Then I write re-write the panel function so that it can automatically call Neotoma and populate the details with the API call results. More on that in the next section.

When the URI component contains all of your desired state components, you can get it's value by calling ```uri.toString()```.  If you set ```window.location.href=uri.toString()``` you will reload the page.  If that's what you want, go for that.  In my case, I set a text box to the value of the ```toString()``` method, which users can copy and paste if they want. In addition, I do add a history entry into the user's browser history.  This is accomplished by:

{% highlight js %}
  window.history.pushState("Ice Age Mapper", "Ice Age Mapper", uri.toString())
{% endhighlight %}

That's about all there is on the generation side of things.  The more involved coding comes when trying to parse a share url.

### Part 2: Parsing
Once you have a URL, you need to put in the infrastructure to generate the state that the URL calls for.  First though, you need to read the url string and parse it into its component parts.  To read the URL, I found that this function was super helpful (I borrowed it from [this StackOverflow post](http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript)):

{% highlight javascript %}
  function getURLParameterByName(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
{% endhighlight %}

***
You can then get the query parameters from the URL string like so:
{% highlight javascript %}
  var queryVar = getURLParameterByName("key")
{% endhighlight %}

For each state component, I parsed the URI variable associated with it.  I also added some checks to make sure that if the query was not in the URI, the application wouldn't crash, but would instead default to something smart.  For example, to get the currently displayed taxon:
{% highlight javascript %}
  taxon = getURLParameterByName('taxon')
  if (taxon){
    globals.taxon = taxon
    //set the name in the search box
    $("#searchBar").val(taxon.toProperCase())
    globals.autoload = true;
  }
{% endhighlight %}

Once all of the query variables have been parsed, we need a way of translating the new state information into the actual application state.  I do this in two steps.  First, I have a function that does all of the parsing.  During the parsing, the global variable objects gets property values for the configuration (e.g., ```globals.taxon = 'Quercus'```).  Next, I call a load function, which is pretty much the same as what I had when I didn't allow URL configuration, but instead of just setting the variables to ```Null``` at the start, it checks to see if the property has already been set during the parsing phase.  This method works really well for components like map zoom and time extent.  However, it will not automatically load the data from Neotoma, because loading the data requires a button click to send an AJAX request to the Neotoma API.  Therefore, we add a ```globals.autoload``` property, which automatically triggers a click on that button, if the necessary state configurtion variables (like taxon) are set in the URL.  


### Part 3:  Sharing on Social Media
One you've implemented the generating and parsing, and know that your share URL gives you a reliable application state representation, you can share the URL on twitter or other social media really easily.  
#### Copying to the clipboard
While not social, you may wish to allow users to copy the link directly to their copy-paste clipboard.  I read some discussion of how this may be a bad idea for security.  I'm not sure -- I added it anyways.
{% highlight js %}
// create hidden text element, if it doesn't already exist
$("#share-link").focus() //highlight the text element that contains the link
var succeed;
try{
  succeed = document.execCommand("copy") //do the copying
}catch(e){
  succeed = false
  console.log(e)
}
return succeed //Boolean
{% endhighlight %}

#### Sharing on Twitter
Twitter allows you to configure a link that pre-populates a tweet composer with message body, share url, hashtags, mentions, etc.  This was a little hard to get the hang of, and I still don't think it's quite right.  I used the ```URI.js``` library again to generate this URL, and then set it to the ```href``` property of a link.  The ```generateTwitterLink``` function is called right after the share URL is generated, so that it is available to the user if they choose to share on twitter. FYI: Even if you have a really long share url, it will only take up 22 characters of your tweet *if you are on a real server*.  If you are on localhost, which isn't a qualified domain, it will take up all of the characters, so might not work.

{% highlight js %}
function generateTwitterLink(){
  var twitterURL = new URI("http://twitter.com/share/") //base link
  twitterURL.addQuery("url", globals.shareURI) //prepopulate with a URL
  twitterURL.addQuery("text", "Check out my Ice Age Map!") //prepopulate text
  twitterURL.addQuery("hashtags", "paleo")
  twitterURL = twitterURL.toString() //generate the string from the object
  $(".twitter-share-button").attr("href", twitterURL) //set the link attribute so we actually use the dynamic URL
}
{% endhighlight %}

#### Sharing with Email
Perhaps the most likely way to share an application state for this application is by email, so I added a method that you can easily email the link out to your collaborators from inside the app. This is super easy, you just need to set the subject and body of the ```mailto:``` string inside of the link ```href```. Since we don't know who to send it to, we leave the ```to:``` field blank.

{% highlight js %}
link = "mailto:?to=&"
link += "subject=" + encodeURIComponent("Ice Age Mapper") //changes spaces to %20, etc
link += "&body=" + shareURI
$("#emailLink").data('href', link)
{% endhighlight %}

#### Sharing on Google+
Sharing on Google+, which I don't know if anyone actually uses -- I don't--  was really, really easy. Assuming you have the required script included, you can have your sharing element be something like:
{% highlight html %}
div class="g-plus" data-action="share"></div>
{% endhighlight %}

Then you can enable the sharing with your URL by setting the url data attribute inside of your javascript code, again, immediately after you generate the share URL.

{% highlight js %}
$(".g-plus").data('href', shareURI)
{% endhighlight %}
