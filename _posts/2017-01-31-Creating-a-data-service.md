---
layout: post
title:  "A Whirlwind Tour to Creating Your Own Data Service Using Postgres and Javascript"
date:   2017-01-31 12:00:00 -0500
categories: Research Education Teaching
---

<embed height='800' width='100%' src="{{site.url}}/assets/cles_Jan_30.pdf" />

I led this week's edition of the [Cart Lab Education Series](http://www.geography.wisc.edu/cartography/) with a quick tutorial on how to go about creating an application backend (or Data Service or API, depending on your terminology) using JavaScript (Node.js) and Postgres. It was a lot to cover in less than half an hour, so I wanted to write up a quick blog post about it too. To lead the discussion, I created this infographic that outlines the components of a data service, and how they might relate to one another.

As a hands on demo, I created a database with some example data from the [Flight Delay Dataset](http://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time), and wrote up a couple annotated code examples.  The code examples are on [my GitHub](https://github.com/scottsfarley93), as well as a SQL dump of the database, if you want to follow along at home.  If you're at the University of Wisconsin, you can query the database I am hosting on the Geography Department's server.


### Setting up the Database

To have a data service, you need a data base.  The database can use any RMDBS you want (MySQL, PostGres, SQLite, MongoDB).  You should think about the system you want to use and the schema you want to implement before you start.  That's a theme for another CLES, or Qunying's Geography 576.

- Install the Database Management System
- Create user roles and privileges
- Think about a relational table structure that makes sense for your data
- Implement the schema
- Add data (may require massaging your data, and often requires a script)

### Setting up the Bridge
The second component of the data service is the 'bridge', or what other people might call an API or application backend. I like the term bridge, because it makes clear its role as linking the database and the application client.  Call it what you like. I like to use Node.js for my bridge programs, here are some reasons: it's fast, it's popular, and it's JavaScript. I find it a lot easier to write the full stack in a single language than going back and forth between different scripting languages. That being said, there are lots of other choices for language: Python, ASP, .NET, PHP.  I've written similar programs in both python and PHP and it's not that different. Choose what you're comfortable with.

If you do go with node, here are the major steps (detailed below) that lead to a finished data service:

- Install Node (https://nodejs.org/en/)
- Create a new application using ```npm init``` (or clone my repo)
- Set up the application in ```app.js```
- Write controllers for each endpoint

### Creating a new Node Application
All Node programs are also node packages, which are managed by the node package manager (```npm```).  There's a handy wizard that will guide you through the creation of a new package in ```npm init```.  Our program (and yours probably, if it does anything interesting) uses other people's libraries.  There are node libraries for everything: compression, password hashing, file system access, you name it.  When in doubt, use a module, don't try to write it yourself.  Once we've created the new package, we tell it about the libraries we require (these are called dependencies), by adding a section in ```package.json```.

- Initialize new project with ```npm init```
- Follow prompts on terminal screen to initialize new application
- Open ```package.json``` with your favorite text editor.
- Add the following to include dependencies:

  {% highlight json %}
  "dependencies": {
    "express": "latest",
    "body-parser": "latest",
    "pg": "latest",
    "pg-promise": "latest",
  }
  {% endhighlight %}

  This installs the following libraries:

  - ```express```: Web framework
  - ```body-parser```: For getting query data
  - ```pg```: Postgres bindings
  - ```pg-promise```: Postgres bindings with better syntax

- Run the command ```npm install```
- You're now able to run your application. If you (at any time) need to add more dependencies, add them to the section you just created.

### Set up the application
The bridge application will do the actual work on parsing user input values, writing SQL, executing queries, receiving database output, and packaging it up for the client.  Everything will be done in JavaScript functions, and will live in ```app.js```. (If you write a complex service, or use a tool like [Swagger](http://swagger.io/), you may put pieces of your code into different files.  Not now.) Key parts of this file include importing libraries, connecting to the database using your credentials, and writing function for each service endpoint (next section).

- Create a file called ```app.js```
- Import the required modules (this part is a lot like python) by creating a new variable with its name:
    {% highlight javascript %}
    var express = require('express')
    {% endhighlight %}

- Create a connection to the database.
  - For this, I like to use a function, so it can be reused. For example:

    {% highlight javascript %}
    createDBConnection(){
      //returns a database connection
        var cn = {
        host: yourHost,
        port: 5432, //default
        database: yourDBName,
        user: yourUsername,
        password: yourPassword
    };
    var db = pgp(cn); //do the connection using pg-promise library
    return db
    }
    {% endhighlight %}

- Write endpoint functions.
- Start your application. Tell the server to listen for incoming client requests. I like to develop on ports 8000 and 8080.  Apache (web server) uses 80 (default in web browsers).

    {% highlight javascript %}
    app.listen(8080, function () {
      console.log('Started application.')
  })
    {% endhighlight %}

### Writing endpoint functions
- In the body of your ```app.js``` file, write a function for each endpoint you want to support. For now, we'll just focus on ```GET``` requests, but you can do other verbs as well (most importantly, you can add data to the database with ```POST``` requests). Also, for now we'll look at getting data from the query string, but you can also get data passed in via the body of the request if you want that too...

If we want to give a user a lost of the flights (day, time, departure city, arrival city, delay amount, we might want to have an endpoint called ```flights``` that a user would access by going to ```https://my.website.com/api/flights```.  That way the user knows for sure she's getting the flights.  It's a good idea to organize your endpoints into logical groups of what they return.

However, our user might not want all the flights, rather she wants to query for those from or to a particular city, or to limit the number of results coming back from the database.

-  Start of by writing a function like this, for a ```GET``` request to the ```/flights``` service.


  {% highlight javascript %}
  app.get('/flights', function (req, res) {
    //this function is the endpoint for the flight data

    //do step two here
    //do step three here
    //do step four here
    //do step five here
  })

  {% endhighlight %}


-  Inside of the function body, parse the user input -- how are they searching or filtering:

  {% highlight javascript %}
  //get query parameters
  var originCity = req.query.originCity || null
  {% endhighlight %}

  Include one variable for each filter/query parameter/argument you want in your endpoint. This gives you the value of that parameter, if it's in the query string, otherwise, you get a ```null```.

- Write a SQL query, using the value other the parameter(s) given by the user. The SQL here is arbitrary -- you can do anything you might want to do in PGAdmin or psql.  Joins, views, selects, deletes -- it's all on the table. Pass user parameter values in via the ```${variableName}``` syntax, or see the [pg-promise](https://github.com/vitaly-t/pg-promise) library docs.

  {% highlight sql %}
  sql = "SELECT * FROM flightdelays \
    WHERE 1=1
    AND (${origin} IS NULL or flightdelays.origin = ${origin})"
  {% endhighlight %}

  This syntax ensures that all results will be given back to the user in the case that no origin city is specified, and is extremely helpful for API building.

- Execute the query, using the pg-promise functions. This happens asynchronously, so be prepared. You can make an object with the query values first, if that helps you think through what you're passing to the query.

  {% highlight javascript %}
  db.any(sql, {origin: originCity})
    .then(function(data){
      //happens on success
      })
    .catch(function(err){
      //happens on error
      })
  {% endhighlight %}

- Do any data conversions or other stuff you want. Then return the result as JSON. I like to include a timestamp, and a message that says the call succeeded.

  {% highlight javascript %}

  //return response to user
  var ts = new Date().toJSON()
  var resOut = {
    "success" : true,
    "timestamp" : ts,
    data: data
  }
  res.json(resOut) //finish request by sending data back to the user

  {% endhighlight %}

### Start the Service
Now that you've built your awesome data service, you'll need to start it. Here's how:

- Open a new terminal/command line window  
- Run the command ```node app.js```
- The server is running.

## Setting up the Client
The client can be set up as you would for any AJAX call. No special modifications are needed, you just need to know the names and data types of the values being passed in via the query string.

{% highlight javascript %}
$.ajax("localhost:8080", {
    data: {
      origin: 'PHX',
    },
    success: function(data){
      console.log("Got data!")
      console.log(data)
    },
    error: function(status, xhr, error){
      console.log(xhr.responseText)
    }
  })
  {% endhighlight %}

## Next Steps:
If you've made it this far, you might want to try some more challenging tasks, such as:

1. Check out the annotated source in ```app.js```.
2. Add a new query parameter to filter destination city.
3. Add a new query parameter to include only those results that have more than a certain delay (in minutes).
4. Add a new endpoint that lists the airports in the dataset and their states and cities.
5. Add a new endpoint that summarizes the delays by airport.
