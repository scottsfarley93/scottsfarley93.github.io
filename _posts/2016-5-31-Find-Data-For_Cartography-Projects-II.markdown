---
layout: post
title:  "On Finding Data for Cartography Projects, Part II: Spatial Data Services and APIs"
date:   2016-05-31 11:22:52 -0500
categories: cartography
---

<h3>Using APIs and Data Services</h3>
This is the second installment in my series about finding data from new and different sources for use in your cartography or GIS projects.  Last time I discussed looking through existing source code to find hidden datasets that might be useful. Today, I will walk through using an API service to tap into an organization's database.  As a simple google search will reveal, there are other resources, blogs, and tutorials out there that talk about how to use an API as a data source, but I will focus particularly on converting data from an API into a useful spatial data format that can be used in mapping and analysis.  Tons of APIs have spatial data (usually latitude and longitude) attached to their responses, its just a matter of finding the data service and massaging it into the right format.
<h4>What is an API?</h4>
An API, which stands for Application Programming Interface, is a set of protocols and methods that define how two computers should talk to each other.  An API is a documented set of building blocks (of code) that define how an existing application works.  A programmer can put these blocks together to extend the existing program, or create a new app that uses portions of the existing program.  Consider <a href="http://twitter.com">Twitter</a>.  Twitter is super popular, and a lot of people use it for various things -- documenting every facet of their daily lives, reporting news, <a href="http://chrisscheele.com/">observing disasters and severe weather</a>, etc.  To build the platform, Twitter needed to make a whole bunch of computers talk to each other. When a user writes a tweet, it is sent to twitter's central database, where it is stored, and then pushed back out to other clients.  Multiply this by Twitter's &gt;310 million users, both reading and writing tweets, and you have a lot of clients that need to communicate with minimal friction.

Twitter could have kept the language that all of these clients and servers spoke to each other in a secret.  That's what is called a private API.  Details of private APIs are not released to outside developers, but are (usually) documented and (sometimes) logical for the internal use of the organization or company that created it.  Sometimes they can be hacked (see Google Maps, before they released a public version of their API), but do not promote easy outside development. There are a lot of private APIs that support how your computer works, but we won't talk about those today.

Instead of keeping their API private, they released it to the world as a public API. Each method for user management, posting tweets, reading tweets, etc is documented and given with examples on <a href="https://dev.twitter.com/overview/documentation">twitter's development website</a>. Now any developer in the world can sign up with twitter and start posting and reading tweets through their own code.  If you've ever used TweetDeck or another twitter application that isn't just the twitter app, its based on the public API.  Lots of companies build APIs so that developers outside of the organization can build apps on top of the company's existing platform.
<h4>Using an API</h4>
So if I know a little coding, I should be able to tap into any existing public API in a few steps.  Basically, our process will be (1) build a query, (2) submit the query to the API, (3) get the result, (4) use the response.

For the remainder of this post, I will use the <a href="http://neotomadb.org">Neotoma Paleoecological Database </a>as an example, because (1) I think they have a well-designed, well-documented data service available through an API, and (2) I work on the Neotoma project. The Neotoma database aggregates and disseminates Quaternary fossil plant and animal data that support paleoecological research.  For this example, I want to make a list of fossil sites above 4,000 meters. The neotoma API docs are <a href="http://api.neotomadb.org/doc">here</a>, and might be helpful for following along.

#### *API Organization*
An API is typically accessed through a web URL.  The URL is made up of a root, a resource, and a set of key-value pairs that define the parameters of your query. For Neotoma, the root of our query will be
<pre>http://api.neotomadb.org/v1/data</pre>
On top of the root, we need to specify an resource. The resource is the name of the data that you are trying to obtain.  This requires you to be a little familiar with the organization whose API you are using.  You can usually figure out which resource you want by browsing the API documentation.  For twitter, the resources include 'friends', 'statuses', 'timeline', etc.  In the case of Neotoma, we have 'Sites', 'Taxa', 'Datasets', 'Downloads', 'SampleData', 'Publications', 'Contacts', and 'DBTables'.  Because I want a list of locations, I decide that I want to use the Sites endpoint, though if I want more detailed information, or the actual pollen counts, I might consider using the downloads or SampleData resources.  I add the resource on to my url string like so:
<pre>http://api.neotomadb.org/v1/data/sites</pre>
If I enter this query into my web browser, it will return every single site that Neotoma stores in its database (several thousand). While this can be useful in some scenarios, it is not what I want right now.  Instead, I want to filter down the result set to show only those sites above 4,000 meters.  I do this through using service parameters.  Each resource can have different parameters, and the parameters each resource has is determined by the developer of the API (not you). We see on the <a href="http://api.neotomadb.org/doc/resources/sites">Sites documentation page</a>, that this resource accepts the parameters 'sitename', 'altmin', 'altmax', 'loc', and 'gpid'.  All parameters are option, and are additive, so you can filter in really customizable ways.  Parameters are just added onto the query string:
<pre>?key1=value1&amp;key2=value2&amp;...&amp;keyN=valueN</pre>
So our query string becomes
<pre>http://api.neotomadb.org/v1/data/sites?altmin=4000</pre>
When we enter this into the web browser, we see that the results set is much smaller.

#### *API Response*
Every organizations API will return a different response, and every resource within an API can return a different response.  Of course, documentation can help you determine when you are looking at, but it can also be super help to just enter your desired query string into your web browser and look at what you are getting back.  Most APIs these days will return JSON formatted responses, though some will return geojson, csv, plain text, xml, or some other data type.  If you are getting a lot of JSON back, a pretty printer like the plug-in for <a href="https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc?hl=en">chrome</a> can really make your life easier.

In our Neotoma example, our response returned a big json object.  The top level keys are 'success' and 'data'.  If success is false, or 0, you probably entered an invalid query string (specified a resource that does not exist, or gave a parameter that is not accepted), but might also be due to a server outage.  In this case there will also be a 'message' key that will tell you the reason that your call failed.  When success is true, or 1, you will get an array of json objects that each have the properties listed in the documentation page for that resource.  We see that our objects will have the properties: 'SiteID', 'SiteName', 'LatitudeNorth', 'LatitudeSouth', 'LongitudeWest', 'LongitudeEast', 'SiteNotes','SiteDescription', 'Altitude'.

#### Implementing an API call: Javascript and AJAX
The next two section will demonstrate implementations of the API call that was developed above, the first in asynchronous javascript for use in a web application, and below, in python, to build a CSV that can be used in ArcMap or other projects.

Here is an example of asking Neotoma for all of the sites above 4,000 meters.  The most important thing to remember is that this an asynchronous AJAX call, so it will take second to respond, and your code has to be able to handle this in its organization.  First we will build the query string, next we will send it to Neotoma using jQuery's $.ajax function, and finally, we will deal will the response. Another important facet of using jQuery and javascript's ajax technique is that you don't have to build the response yourself, you can just pass in a <code>data</code> parameter in the ajax call, and the string will be built automatically. You can still see the built query string by <code>console.log</code>-ing the <code>this.url</code> on <code>beforeSend</code>.

{% highlight javascript linenos %}
function getNeotomaData(minAlt){
  endpoint = 'http://api.neotomadb.org/v1/data/sites' //this is the root and resource
  $.ajax(endpoint, { //make an ajax call with the query string url
    dataType: "jsonp", //its json, but coming from a remote server, so jsonp
    beforeSend: function(){ //optional, but helpful for debugging
      console.log(this.url) //to see exactly where the call is going to
    },
    data:{
      altmin: minAlt //pass in the key-value parameters
    },
    success: function(response){
      //called when the call succeeds
      if (response['success']){//check whether the server said okay
        data = response['data'] //just take the data from the response
        doStuffWithData(data) //callback function to proceed with the script
      }else{
        //the server threw an error, so check what it was
        console.log("Error on the API call.")
        console.log(response['message']) //the server will tell you what's wrong
      }
    },
    error: function(xhr, status, error){
      //there was an AJAX error (communcation problem)
      console.log("AJAX error.")
      console.log(error)
    }
  })
}

function doStuffWithData(dataArray){
  //do stuff here
  //put the data on a map?
  //make a table of the sites?
  //do analysis?
  //the world is your oyster
  console.log(dataArray) //or just print the message
}
{% endhighlight %}

If you have a page with jQuery included on it and call <code>getNeotomaData</code>, you should see the response get logged into the console.

Pulling from an API in a web app is great because (1) You don't have to store and maintain a file, and (2) you have access to updates whenever the organization's database is updated.

#### IMPLEMENTING AN API CALL: Python to CSV
If you're not making an interactive map for a web app, you're unlikely to be using javascript and AJAX, but you still might want to tap into the data service.  Here I will demonstrate a simple json to csv conversion script that calls the same API query in the examples above.

There are some web-based tools to convert json to csv.  However, since JSON can be hierarchical and a csv is flat, it can be difficult for these tools to work correctly.  If you have some level of competency using python, I recommend custom-rolling your conversions each time you need to call a new resource, to make sure you get the fields that you need in your CSV.  This example uses the <code>csv</code> module for writing the file and the <code>requests</code> module for making the api call.

{% highlight python linenos %}
import csv
import requests

def saveDataFromNeotoma(minAlt, outfile):
    ## set up the output file
    f = open(outfile, 'w') ## open the file buffer
    fields = ['SiteID','SiteName','LatitudeNorth',
        'LatitudeSouth', 'LongitudeEast', 'LongitudeWest',
        'Altitude', 'SiteDescription', 'Notes'] ## fields to use as the header for the CSV
    writer = csv.DictWriter(f, fieldnames=fields, lineterminator='\n')## write a line when we pass a dictionary
    writer.writeheader() ## write the top header row
    ## make the query string
    endpoint = "http://api.neotomadb.org/v1/data/sites?"
    url = endpoint  + "altmin=" + str(minAlt)## this is the complete query string
    try:
        response = requests.get(url).json() ## make the call and parse the response as json
    except Exception as e: ## there was a communication error
        print "Failed to reach the neotoma server."
        print str(e)
        exit() ## die
    if not response['success']:
        ## there was an error on the call
        print "There was a communication error"
        print response['message'] ## this is the error message
        exit()
    data = response['data']
    for site in data: ## iterate through all the sites
        ## the fields in the header are all the same as the fields in the response objects
        ## so we can just write with the response objects
        ## otherwise, we could do more manipulation here
        try:
            # the encoding can be funky when writing to excel, so fix it
            site['SiteName'] = site['SiteName'].encode("utf-8")
            site['SiteDescription'] = site['SiteDescription'].encode("utf-8")
        except AttributeError: ## site didn't have site description
            pass ## don't worry about it
        writer.writerow(site) ## write the row
    # finish up
    f.close()

saveDataFromNeotoma(4000, "/path/to/your/intended/file.csv")
{% endhighlight %}

In this way, you can create a file just like it had been made available for public downloading, but (1) you've done it on a resource that was not available as a file download, and (2) you were able to exactly configure the response how you want it, so you don't have to mess around in excel filtering and sorting.  

Hopefully this post was helpful in getting you started on using APIs and data services, and that you can maybe use these techniques in your own work at some point.  Spatial data APIs are everywhere -- happy hunting.
