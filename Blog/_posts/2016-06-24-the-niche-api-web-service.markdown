---
layout: post
title:  "Building the Niche Database and Web Services"
date:   2016-06-26 8:22:52 -0500
categories: Research Paleoclimate
---

I've spent some time over the past couple of weeks building out the Niche API, a set of web services that enable you to get global climate model (GCM) simulated climate data for specific points in space and time.  For this project I've been mixing database design, backend web programming, and a bit of cloud computing.  It's been a fun process, and is turning into what I think will be a very useful tool.  In this post, I put down a few thoughts about the decisions I made, the techniques I used, and the problems I faced.

### The Challenge
Working with GCM output and other gridded climate products is always challenging. The data is large.  It's usually in a format that is designed for its transportation rather than its communication (NetCDF). It may be in the wrong projection for the work you need to do.  You might need to resample the spatial resolution of the grid to fit with the other layers in your project.  If you've ever done work with these datasets, you're probably familiar with these obstacles.  An additional challenge that we face in paleoclimate/paleoecological projects is the many different time periods that are included in each dataset. In a NetCDF, the different timestamps are typically shipped as different layers.  However, if you start to unpack these layers, you'll quickly end up with a tangled mess of rasters describing different time periods.  

In many cases, we don't need the whole gridded raster dataset for our work.  Maybe we need a small subset representing a study site, or very often, we just want to know the value of a variable at a discrete point in space and time.  In my work with species distribution models, I want to be able to ask the question: What was the precipitation (or maximum temperature, or annual mean temperature, etc) at the coordinates of a sample in the Neotoma database at the time when the sample was dated to.  Traditionally, I would need to manage all sorts of datasets, and use ArcMap or some other utility to get the datapoint I need.

### The Goal
 My goal with this project is to build a web service that does the management and extraction of climate datasets automatically. My objects include:

 1.  Store and manage gridded climate datasets in a way that preserves their metadata and makes them available via the internet
 2.  Be able to pass geographic coordinates and a calendar year and return an interpolated age for that space-time location
 3.  Be able to access the program scripts remotely through a web service
 4.  Make the platform generic enough to enable other users with other gridded datasets to contribute to the database
 5.  Maintain metadata on each dataset so that users can query for data by its attributes

My primary use case that I'm designing for is the [NicheViewer](http://paleo.geography.wisc.edu), which plots samples in Neotoma on environmental axes.  This requires that the program be relatively fast (I'm still working on this) and return in a web-digestable format (JSON).  I've made some decision along the way that really reflect having NicheViewer as my target user, but at the [C4P Hackathon](http://github.com/cyber4paleo) in Boulder, CO this weekend, people showed significant enthusiasm for the project, and I'll try to keep these other users in mind going forward.

### The Database
Climate datasets are typically stored at NetCDF objects, a format which has been optimized for the sharing and storage of gridded data.  These files are self describing, with all the metadata needed to use them included in a header.  However, they're difficult to extract data subsets from. Instead of relying on the NetCDF file type, I am going to the store the climate data as tables in a relational database.  
Postgres is a relational database management system that has a great collection of spatial types included in the PostGIS extension.  With this extension, postgres has the ability to store large gridded datasets and to query them spatially.  It also includes the ability to store lines, polygons, multipolygons, and many other types of geometry if you want. Spatial queries are perfect for my task, because I can ask for the value of the raster at a latitude/longitude point.  I could also ask things like which cells are crossed by a line, or included in a polygon, but we'll stick with points for now.

#### Raster Input to Database
Getting rasters into the database is pretty easy, if you have them in a supported format (which NetCDF is not).  The workflow here was to first convert each band of the NetCDF (they're not really bands, in this case they're the discrete time/month/variable combinations) to a tiff file.  Then, using the ```raster2pgsql``` tool included with postgres, I'll then convert each image file to a SQL table of the Binary Large Object (BLOb) type.  Finally, using the ```psql``` command shell, I can create a new table for this dataset in my dataset. I'll typically do this in a python script that loops over all files in a directory.  Once I have a directory of tif files, I can do something like:
{% highlight python %}
import os
import subprocess
import psycopg2
# connect to the database
connectString = "dbname='" + str(database) + "' user='" + str(username) + "' host='" + str(host) + "' password='" + str(password) + "'"
conn = psycopg2.connect(connectString)
cursor = conn.cursor()
# look through my local directory
basePath = "/my/dir/of/files"
for f in os.listdir("/my/dir/of/files"):
    # get the file name
    fullName = f + "/" + basePath
    tableName = "RandomStringOfLettersAndNumbers"
    # build the command
    command = "raster2pgsql "
    command += " -s 4326" ##wgs 1984 coordinate system
    command += " -d" ## overwrite this table name if it already exits
    command += " -I" ##spatial index
    command += " -C " ##enforce constraints
    #command += " -M " ##vaccuum analyze
    command += rasterOnDisk
    command += " -t 5x5 " ##pixels per tile, the smaller the better
    command += tableName ##
    # run the command we've just built
    process = subprocess.Popen(command, stdout=subprocess.PIPE, shell=True)
    (sql, err) = process.communicate()
    # run the SQL through the database connection
    cursor.execute(sql) # now the table is in the database
{% endhighlight %}

#### Table Metadata
The only way a database like this can succeed is if there is sufficient metadata to allow users to search and filter based on a layer's metadata: *who produced this layer? what are its units? what variable does it represent?*

My database keeps track of raster layer metadata in a set of postgres tables. These tables are divided into two types: those describing the model and/or entity that produced the dataset and those describing the variable described by the dataset.  I think this is a natural basis for the data model, because GCM models can produce multiple variable types, but each raster layer can have only one variable and one model source.  Similarly, each the details of each variable (units, measurement type, etc) can be the same for different time stamps, and for different climate model sources.  

The metadata is tracked using foreign keys from a central index table.  The index table stores a pointer to the actual data layer table, which is identified by a 64-bit unique identifier.  The random string is used as a table name to ensure that table names will be uniquely mapped to their metadata, even if a lot of tables get added to the database.  The index table also stores layer-specific metadata, such as the spatial resolution of the raster and the time period being represented, which do not map on to sources or variables.  Finally, the table has columns for variables and sources that are further described in those respective tables.

**Source Metadata**

The *sources* metadata table keeps track of the model and entity that produced the data layer in the first place. The sources table includes:

*  *Producer:* The name of the modeling entity or research group that produced the layer set, (e.g. National Center for Atmospheric Research [NCAR])
*  *Model:* The name of the model that produced the layer set, (e.g. Community System Climate Model [CCSM])
*  *ModelVersion:* The version of the model that produced the layer set (e.g. 3.0),
*  *Scenario:* The forcing scenario under which the model was run (e.g., UN IPCC RCP8.5),
*  *ProductURL:* The web address of the citation of the model, ideally a permanent [doi](https://www.doi.org/)

**Variables Metadata**

The *variables* tables keep track of the thing that is being modeled.

*  *variableType:* The climate variable being modeled, (e.g. Precipitation)
*  *variableUnits:* The units in which the variable is measured (e.g. centimeters [cm])
*  *variablePeriod:* The time frame over which the variable was measured, as represented by the layer (e.g., January [1])
*  *variablePeriodType:* The type of measuring time frame (e.g. Month, Quarter, Annual)
*  *averagingPeriod:*  The length of time over which the variable has been averaged, (e.g. 10)
*  *averagingPeriodType:*  A description of the units of time describing the averaging period (e.g. Years)

These properties can be combined together such that there are many combinations, and detailed metadata can still be kept track of.  The structure is such that a SQL query can enable a machine API to query and search the variables layers.  Each layer must have all properties specified.

One of the things I am looking at implementing is coming closer to the [cf metadata standard](http://cfconventions.org/cf-conventions/v1.6.0/cf-conventions.html) that describes NetCDF files and already has a controlled vocabulary for climate layers.  I also want to change the variablePeriod implementation to reflect finer variations in represented time period, such as the difference between DJF and JFM.  

### The API
Once the database is in place, and has some data in it, we can enable programmatic access to its contents using an API. I have the both the database and the API running on a Google Compute Engine server running Debian Linux in the cloud.  This has proved really useful.  The API currently has way too many endpoints -- you can add, modify, or delete nearly anything in the database -- but that makes it really scalable if others want to start using it later on.  It's been pretty RESTfully designed, and makes full use of the HTTP verbs.  The API is public, and the latest version of the documentation is [here](http://paleo.geography.wisc.edu/docs/).  The full YAML declarations file is [here](http://paleo.geography.wisc.edu/docs/api_version_1_swagger.yaml).  The API is [served from here](http://130.211.157.239:8080/).

#### Modeling the API
I wanted to be very methodical and document my progress in the development of this project, so I decided to use a modeling language that records the input and output properties of each endpoint.  I used the [swagger](http://editor.swagger.io/#/) modeling language and editor, which let me produce documentation and really think through my decisions before I started coding the application.  It's designed to produce good documentation and is capable of generating client side code stubs for different languages which is kind of nifty.  

| HTTP request | Description
| ------------- | -------------
| **DELETE** /averagingTypes/{averagingTypeID} | Delete an averaging type using its averagingTypeID
| **GET** /averagingTypes/{averagingTypeID} | Get details about a specific averaging type using its averagingTypeID
| **PUT** /averagingTypes/{averagingTypeID} | Update details of a specific averaging type using its averagingTypeID
| **GET** /averagingTypes | Get a list of the averaging types in the database
| **POST** /averagingTypes | Add a new averaging period to the database
| **GET** /data | Get the value of one or more layers at a space-time location
| **GET** /layers | Get a list of the layers in the database
| **DELETE** /layers/{layerID} | Delete a layer and its raster table using its layerID
| **GET** /layers/{layerID} | Get details about a specific layer using its layerID
| **PUT** /layers/{layerID} | Update a layer&#39;s details using its layerID
| **POST** /layers | Add a layer to the databases
| **GET** /sources | Get a list of the data sources and models in the database
| **POST** /sources | Add a new source to the database.
| **DELETE** /sources/{sourceID} | Delete a source using its souce id
| **GET** /sources/{sourceID} | Get details about an specific source using its sourceID
| **PUT** /sources/{sourceID} | Update details about a specific source using its sourceID
| **GET** /variableUnits | Get a list of variable units in the database
| **POST** /variableUnits | Add a new variable unit to the database
| **DELETE** /variableUnits/{variableUnitID} | Delete a variable unit using its database id
| **GET** /variableUnits/{variableUnitID} | Get details about a specific variable unit instance
| **PUT** /variableUnits/{variableUnitID} |
| **GET** /variablePeriodTypes | Get a list of the variable period types in the database.
| **POST** /variablePeriodTypes | Add a new variable period type to the database
| **DELETE** /variablePeriodTypes/{variablePeriodTypeID} | Delete an variable period instance using its variablePeriodTypeID
| **GET** /variablePeriodTypes/{variablePeriodTypeID} | Get a details about a specific variable period type using its variablePeriodTypeID.
| **PUT** /variablePeriodTypes/{variablePeriodTypeID} | Update the details of a specific variable period using its variablePeriodTypeID
| **GET** /variableTypes | Get a list of variable types in the database.
| **POST** /variableTypes | Add a new variable type to the database
| **DELETE** /variableTypes/{variableTypeID} | Delete a variable type instance using its variableID
| **GET** /variableTypes/{variableTypeID} | Get details about a specific variable type
| **PUT** /variableTypes/{variableTypeID} | Update details about a specific variable type in the database
| **GET** /variables | List Niche Variables
| **POST** /variables | Add a new niche variable
| **DELETE** /variables/{variableID} |
| **GET** /variables/{variableID} | Get details about a specific variable
| **PUT** /variables/{variableID} |

#### Writing the API
Once modeled, the API script was written in python using the [bottle](http://bottlepy.org/docs/dev/index.html) web framework and a paste python-based web server.  Eventually it will be migrated to a windows server housed in our lab, and run behind an apache web server as a CGI module.  Basically, all the API does is receive HTTP requests, route them to functions, then the functions make SQL queries, and return the results as JSON. Pretty simple.  As you can see, there are a lot of endpoints included on the API right now, but the most important one is the *data* endpoint, where you can actually get data from the database.

The server runs forever using the ```supervisor``` linux module (see my post on long running linux programs).

**Making a request**:

{% highlight python %}
from bottle import route, run, template, response, request, get, post, delete, put, hook
import psycopg2 ## database connector
import datetime ## for timestamp formatting
import json


class JSONResponse(): ## base response class that returns the json fields I want
    def __init__(self, data = (), success=True, message = "", status=200, timestamp='auto'):
        if data != ():
            self.data = data
        self.sucess = success
        self.message = message
        self.status = status
        if timestamp == 'auto':
            self.timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        else:
            self.timestamp = timestamp
    def toJSON(self): ## just report the class's fields as a dictionary that will get converted to real json when bottle returns it
        return self.__dict__

def connectToDefaultDatabase():
    '''Connect to the database using the settings configured in conf.txt'''
    ## read from the conf.txt file
    f = open("conf.txt", 'r')
    i = 0
    header = ['hostname', 'password', 'user', 'dbname']
    d = {}
    for line in f:
        fieldname = header[i]
        line = line.replace("\n", "")
        line = line.replace("'", "")
        d[fieldname] = line
        i += 1
    hostname = d['hostname']
    db = d['dbname']
    pw = d['password']
    user =d['user']
    conn = psycopg2.connect(host=hostname, user=user, database=db, password=pw)
    return conn

# now we can start making requests
@get("/someroute")
def doGetStuff():
    # do some get stuff here!
    # the query parameters are stored in request.query
    params = request.query
    return JSONResponse()

#  make it serve
run(server='paste', host='0.0.0.0',  port=8080, debug=True)
{% endhighlight %}

**Logging**

I want to be able to see who calls the API, which endpoints they call, and what kind of tech they're using to call it.  I set up request logging on every request into a table called ```call_log```.  I accomplish this using a ```hook``` which is fired before every request is passed on to its respective routing function, and basically just creates an apache style server log.

{% highlight python %}

# this is the route that happens every time a request to anything is made
@hook('before_request')
def log_this_request():
    logRequest(request)

## this function deconstructs the request and puts it into a table
def logRequest(req):
    con = connectToDefaultDatabase()
    cursor = con.cursor()
    reqEnv = req.environ
    method = reqEnv['REQUEST_METHOD']
    server_protocol = reqEnv['SERVER_PROTOCOL']
    user_agent = reqEnv['HTTP_USER_AGENT']
    remote_ip = reqEnv['REMOTE_ADDR']
    path =  req.path
    args = req.query_string
    sql = '''INSERT INTO call_log VALUES(default, %(resource)s, %(method)s, %(server_protocol)s, %(user_agent)s, %(remote_ip)s, %(args)s, default);'''
    params = {
        'method' : method,
        'server_protocol' : server_protocol,
        'user_agent' : user_agent,
        'remote_ip' : remote_ip,
        'resource' : path,
        'args' : args
    }
    cursor.execute(sql, params)
    con.commit()
    cursor.close()
    con.close()
{% endhighlight %}

**CORS**

To make post requests from the server where NicheViewer lives, I also needed to enable CORS.  CORS is always a pain in the ass, but its handled in the API like this:

{% highlight python %}

# define the headers
_allow_origin = '*'
_allow_methods = 'PUT, GET, POST, DELETE, OPTIONS'
_allow_headers = 'Authorization, Origin, Accept, Content-Type, X-Requested-With'

# attach them after every response
@hook('after_request')
def enable_cors():
    '''Add headers to enable CORS'''

    response.headers['Access-Control-Allow-Origin'] = _allow_origin
    response.headers['Access-Control-Allow-Methods'] = _allow_methods
    response.headers['Access-Control-Allow-Headers'] = _allow_headers

# if the browser sends an Options request, let it know that it's safe to send over a post request
@route("/data", method=['OPTIONS'])
def returnOptions():
    return bottle.HTTPResponse(status=200)

__
{% endhighlight %}

**Interpolating the Ages**

One of the biggest challenges for me was getting the correct query to interpolate variables between ages.  The code ended up looking like this (yes, it is convoluted):

{% highlight python %}

#...import stuff and set up the connections

@get("/data")
def getData():
  #...collect query parameters
  #...get a new DB cursor
  ## fetch the table names that match our query
  # this query gets the tables and associated metadata that meet the user's query that have an age OLDER than the query year.
   greaterThanQuery = '''
       SELECT
           "tableName", rasterIndex.yearsBP, sources.sourceID, sources.model, sources.producer, sources.productVersion, variables.variableID,
           variables.variabledescription, variableTypes.variableType, variableUnits.variableUnitAbbreviation, variables.variablePeriod,
           variablePeriodTypes.variablePeriodType, variables.variableAveraging, averagingPeriodTypes.averagingPeriodType, sources.producturl
       from rasterIndex
       INNER JOIN variables on rasterIndex.variableID=variables.variableID
       INNER JOIN    sources on rasterIndex.sourceID = sources.sourceID
       INNER JOIN    variableTypes on variables.variableType = variableTypes.variableTypeID
       INNER JOIN    variableUnits on variables.variableUnits = variableUnits.variableUnitID
       INNER JOIN    averagingPeriodTypes on variables.variableAveragingType = averagingPeriodTypes.averagingPeriodTypeID
       INNER JOIN    variablePeriodTypes on variables.variablePeriodType = variablePeriodTypes.variablePeriodTypeID
       WHERE rasterIndex.recordID IN
           (SELECT MIN(recordID) FROM rasterIndex
                       WHERE 1 = 1
                       AND (%(variableType)s is NULL or %(variableType)s LIKE lower(variableTypes.variableTypeAbbreviation) )
                       AND (%(variablePeriod)s is NULL or %(variablePeriod)s = variables.variablePeriod )
                       AND (%(variablePeriodType)s is NULL or %(variablePeriodType)s LIKE lower(variablePeriodTypes.variablePeriodType) )
                       AND (%(averagingPeriod)s is NULL or %(averagingPeriod)s = variableAveraging )
                       AND (%(averagingPeriodType)s is NULL or %(averagingPeriodType)s LIKE lower(averagingPeriodTypes.averagingPeriodType) )
                       AND (%(variableUnits)s is NULL or %(variableUnits)s LIKE lower(variableUnits.variableUnitAbbreviation))
                       AND (%(variableID)s is NULL or %(variableID)s = variables.variableID)
                       AND (%(sourceID)s is NULL or %(sourceID)s = sources.sourceID)
                       AND (%(resolution)s is NULL or %(resolution)s = resolution)
                       AND (%(modelName)s is NULL or %(modelName)s LIKE lower(sources.model) )
                       AND (%(sourceProducer)s is NULL or %(sourceProducer)s LIKE lower(sources.producer) )
                       AND (%(modelVersion)s is NULL or %(modelVersion)s = sources.productVersion )
                       AND (%(modelScenario)s is NULL or %(modelScenario)s LIKE lower(scenario) )
                       AND (yearsBP >= %(yearsBP)s)
                       GROUP BY variableID
           )
       ORDER BY sourceID, variableID;
       '''
   params = {
       'variableType' : variableType,
       'variablePeriod':variablePeriod,
       'variablePeriodType' :variablePeriodType,
       'variableUnits' : variableUnits,
       'variableID' : variableID,
       'averagingPeriod' : averagingPeriod,
       'averagingPeriodType' : averagingPeriodType,
       'sourceID': sourceID,
       'sourceProducer':sourceProducer,
       'modelName' :modelName,
       'modelVersion' : modelVersion,
       'resolution': resolution,
       'modelScenario' : modelScenario,
       'yearsBP' : yearsBP
   }
   cursor.execute(greaterThanQuery, params) ## execute this query
   greaterThanRows = cursor.fetchall() ## get and store the request

   ## THIS IS THE LESS THAN query
   ##This is the same query, but gets tables YOUNGER than the query age.
   lessThanQuery = '''
           SELECT
               "tableName", rasterIndex.yearsBP, sources.sourceID, sources.model, sources.producer, sources.productVersion, variables.variableID,
               variables.variabledescription, variableTypes.variableType, variableUnits.variableUnitAbbreviation, variables.variablePeriod,
               variablePeriodTypes.variablePeriodType, variables.variableAveraging, averagingPeriodTypes.averagingPeriodType, sources.producturl
           from rasterIndex
           INNER JOIN variables on rasterIndex.variableID=variables.variableID
           INNER JOIN    sources on rasterIndex.sourceID = sources.sourceID
           INNER JOIN    variableTypes on variables.variableType = variableTypes.variableTypeID
           INNER JOIN    variableUnits on variables.variableUnits = variableUnits.variableUnitID
           INNER JOIN    averagingPeriodTypes on variables.variableAveragingType = averagingPeriodTypes.averagingPeriodTypeID
           INNER JOIN    variablePeriodTypes on variables.variablePeriodType = variablePeriodTypes.variablePeriodTypeID
           WHERE rasterIndex.recordID IN
               (SELECT MIN(recordID) FROM rasterIndex
                           WHERE 1 = 1
                           AND (%(variableType)s is NULL or %(variableType)s LIKE lower(variableTypes.variableTypeAbbreviation) )
                           AND (%(variablePeriod)s is NULL or %(variablePeriod)s = variables.variablePeriod )
                           AND (%(variablePeriodType)s is NULL or %(variablePeriodType)s LIKE lower(variablePeriodTypes.variablePeriodType) )
                           AND (%(averagingPeriod)s is NULL or %(averagingPeriod)s = variableAveraging )
                           AND (%(averagingPeriodType)s is NULL or %(averagingPeriodType)s LIKE lower(averagingPeriodTypes.averagingPeriodType) )
                           AND (%(variableUnits)s is NULL or %(variableUnits)s LIKE lower(variableUnits.variableUnitAbbreviation))
                           AND (%(variableID)s is NULL or %(variableID)s = variables.variableID)
                           AND (%(sourceID)s is NULL or %(sourceID)s = sources.sourceID)
                           AND (%(resolution)s is NULL or %(resolution)s = resolution)
                           AND (%(modelName)s is NULL or %(modelName)s LIKE lower(sources.model) )
                           AND (%(sourceProducer)s is NULL or %(sourceProducer)s LIKE lower(sources.producer) )
                           AND (%(modelVersion)s is NULL or %(modelVersion)s = sources.productVersion )
                           AND (%(modelScenario)s is NULL or %(modelScenario)s LIKE lower(scenario) )
                           AND (yearsBP <= %(yearsBP)s)
                           GROUP BY variableID
               )
           ORDER BY sourceID, variableID;
           '''

   params = {
       'variableType' : variableType,
       'variablePeriod':variablePeriod,
       'variablePeriodType' :variablePeriodType,
       'variableUnits' : variableUnits,
       'variableID' : variableID,
       'averagingPeriod' : averagingPeriod,
       'averagingPeriodType' : averagingPeriodType,
       'sourceID': sourceID,
       'sourceProducer':sourceProducer,
       'modelName' :modelName,
       'modelVersion' : modelVersion,
       'resolution': resolution,
       'modelScenario' : modelScenario,
       'yearsBP' : yearsBP
   }
   cursor.execute(lessThanQuery, params) ## execute
   lessThanRows = cursor.fetchall()

   ## these are the fields that will be returned with the response
   header = [ "tableName", "yearsBP", "sourceID", "Model", "Producer", "ModelVersion", "variableID",
   "VariableDescription", "VariableType", "variableUnits", "variablePeriod", "variablePeriodType", "averagingPeriod", "averagingPeriodType", "dataCitation"]

   ## start building the response
   out = []
   ## fetch the actual point data from each of the returned tables
   i = 0
   while i < len(greaterThanRows):
       ## the row order should match so we can interpolate between the sets of values
       greaterRow = greaterThanRows[i]
       lesserRow = lessThanRows[i]
       try:
           ## go get the actual values from the raster  
           greaterTable = greaterRow[0]
           greaterYear = greaterRow[1]
           ## for the higher value
           greaterQuery = '''SELECT ST_Value(rast,ST_SetSRID(ST_MakePoint(%(longitude)s, %(latitude)s), 4326)) FROM public.''' + greaterTable + '''
               WHERE ST_Intersects(rast, ST_SetSRID(ST_MakePoint(%(longitude)s, %(latitude)s), 4326));
           '''
           params = { 'latitude' : latitude, 'longitude' : longitude}
           cursor.execute(greaterQuery, params)
           greaterValue = cursor.fetchone()
           ## for the lesser value
           lesserTable = lesserRow[0]
           lesserYear = lesserRow[1]
           lesserQuery = '''SELECT ST_Value(rast,ST_SetSRID(ST_MakePoint(%(longitude)s, %(latitude)s), 4326)) FROM public.''' + lesserTable + '''
               WHERE ST_Intersects(rast, ST_SetSRID(ST_MakePoint(%(longitude)s, %(latitude)s), 4326));
           '''
           params = { 'latitude' : latitude, 'longitude' : longitude}
           cursor.execute(lesserQuery, params)
           lesserValue = cursor.fetchone()
           if len(greaterValue) == 0: ## no results were returned, likely because point was outside of north america
               greaterValue = 0
           else:
               greaterValue = greaterValue[0]

           if len(lesserValue) == 0: ## no results were returned, likely because point was outside of north america
               lesserValue = 0
           else:
               lesserValue = lesserValue[0]
           ## now do the Interpolation
           x = (lesserYear, greaterYear)
           y = (lesserValue, greaterValue)
           predPoint = yearsBP
           print "Prediction point is ", predPoint
           f = interpolate.interp1d(x, y)
           val = f(predPoint)
           val = float(val)
           if numpy.isnan(val):
               val = None
           p = 0
           d = {}
          ## add metadata about the table
           while p < len(header):
               col = header[p]
               d[col] = greaterRow[p]
               p += 1
           d['value'] = val ## this is the actual point value
           d['latitude'] = float(latitude)
           d['longitude'] = float(longitude)
           d['siteName'] = siteName
           d['sampleID'] = sampleID
           d['siteID'] = siteID
           d['yearsBP'] = yearsBP
           out.append(d)
       except Exception as e: ## table doesn't exist, but record for table does exist --> oops
           print str(e)
           conn.rollback()
       finally:
           i += 1
   ## return the response
   r = JSONResponse(data = out, message="Linear interpolation between two nearest neighbors.", status=200)
   return bottle.HTTPResponse(status=200, body= r.toJSON())

{% endhighlight %}

#### API responses

The base response from the API includes these fields:

*  *status:* HTTP status code, also included in the response header
*  *timestamp:* Time at which the response was minted by the server
*  *message:* A string produced by the server to specify an error, or note something of importance
*  *success:*  Boolean flag to indicate whether the API call was successful.  If success is ```true``` and ```data``` is empty, then the user can be sure that the call happened correctly, there just was no matching data found in the database.
*  *data:*  An array of objects that meet the search criteria

**Status Code**

*  *200:* Success!
*  *201:* The requested object already exists, so the script didn't create a new one
*  *404:* Object not found (resource doesn't exist)
*  *400:* Required parameters for the method were not set
*  *204:* Object deleted

### Conclusion
I believe the current solution described here meets all of the goals I set out to accomplish.  It's a little hacky in places, and could be more robust, but for the most part it does everything it has to without error.  It currently supports two front ends: the NicheViewer and an R package.  

**Goals, evaluated**

1. *Store and manage gridded climate datasets in a way that preserves their metadata and makes them available via the internet*: Storing the raster layers in a postgres database makes it available over the internet.  While the metadata becomes divorced from the actual data, storing it in other tables keeps it close by, so we can refer to it if we need it.

2.  *Be able to pass geographic coordinates and a calendar year and return an interpolated age for that space-time location*:  The API supports a SQL query that returns interpolated ages for spatial locations at a spatial location.  
3.  *Be able to access the program scripts remotely through a web service:*  The API supports RESTful querying of the data layers, so that user's can get the data without installing software or downloading datasets.  

4.  *Make the platform generic enough to enable other users with other gridded datasets to contribute to the database:*  The table structure is generic enough to support (I think) any 2-dimensional gridded climate model output.  3-dimensional (height) datasets will not fit well into the data model, nor will datasets that are not gridded.  Datasets that are not modeled, but perhaps show real observations, should be able to fit into the database, though it hasn't been tested.  The API needs a little work to support direct data ingestion, but version 1 supports public curation of metadata.

5.  *Maintain metadata on each dataset so that users can query for data by its attributes:* The table structure maintains sufficient metadata on the model and the variable that is represented.  It is stored in several tables which allows it to be included in a structured query.  Version 1 of the API allows clients to query on all facets of what makes up a layer.

**Future Work**

I have several things I would like to continue adding to this application.  

1.  Add more data layers, datasets, and models.
2.  Improve API speed and robustness.
3.  Let users query for other geometry types (lines, polygons, etc)
4.  Improve metadata representations of time periods and variable types.
