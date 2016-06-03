---
layout: post
title:  "Connecting to Google Cloud SQL"
date:   2016-06-02 11:22:52 -0500
categories: Research CloudComputing
---

Part of the reason that I am keeping this blog is to keep a record of the things I've done
and my thought process in doing them so that when it comes time to write up my thesis,
I will have a better recollection of what was going through my head. The other reason
is to perhaps help someone out there struggling similar problems that I went through.
I think that my adventures in the Google Cloud Platform are a good example of this --
Google's Cloud Platform is acknowledged to be slightly less mature than some of its competitors, like AWS.
Because of this, there are fewer stackexchange questions, blogs posts, etc that can help guide
basic setup.  I do think that Google's documentation and tutorials are better than Amazon's --
more accessible, better written -- but it can be hard to figure out what you need to
be doing if you're not a cloud professional.  So I'll document some of the hard steps
I encountered in this ongoing set of posts.

### Setting up Cloud SQL with MySQL Workbench
In this post, I discuss the process of setting up Google's Cloud SQL and getting it
to work with MySQL Workbench (the challenging part).  The tutorials on most of these
steps are pretty good, so I won't try to completely recreate those.  

#### Set up CloudSQL
1.  Go to your Cloud Console
2.  Click on SQL --> Go To SQL Dashboard
3.  Click the Blue Plus button to start a new SQL Instance
4.  Click the option to choose the second generation of SQL Servers.  
These virtual machines are still in beta and Google hasn't updated all of its documentation
about them yet, so some of the screenshots and instructions in the tutorials do not apply to the second generation
instances.
5.  Walk through the wizard to create a new virtual machine instance for your database.
6.  When you're done with the wizard, click to create the VM and then wait for it to spin up.
7.  Open the VM preferences, go to the Access Control tab, and then go to Users.
Change the root password to the password you want to use for logging into the server from a MySQL client.
8.  Your database server should be set up and ready to go now.  You can access a SQL console and check its installation by clicking the button that looks like a terminal prompt in the upper righthand corner of the page.  Clicking that should open a command prompt.  Start the built-in MySQL client with:
<pre>gcloud beta sql connect myinstance --user=root</pre>
If your server is up and running, you should see the terminal change to a <code>mysql></code> prompt.  If not, refer to [this walkthrough](https://cloud.google.com/sql/docs/quickstart).

#### Set up the MySQL Workbench
If you're doing any time of analysis on the data stored within your database, you might be interested in working with an external tool like [MySQL Workbench](https://www.mysql.com/products/workbench/).  I'm sure there are a variety of other good admin tools for MySQL, but this is the one I use and its okay.  This was a complicated part with the google cloud installation, and it took be the better part of a morning to work through the various tutorials to make it come together.  The real challenge is getting the CloudSQL Proxy set up. Because we're using a second generation instance, the ip management is handled by Google Cloud and its CloudSQL Proxy directly, rather than manually by us.  Here we will assume you are using a Mac running OSX.

1.  Get the Dependencies.  First, you need to get [wget](http://rudix.org/packages/wget.html) for your operating system.  Wget is a client for downloading files that is available on linux operating systems, but can be installed for windows and mac from third-parties.  Second, you need FUSE.  Not really sure what it does, but you need it and you can get it [here](https://sourceforge.net/projects/osxfuse/files/).  I downloaded version <code>osxfuse-2.8.3 </code> because it had 11,000 more downloads than any other version.  
2.  Download and configure your proxy script.  First <code>cd</code> into your project root.
    <pre>
    wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64
    mv cloud_sql_proxy.linux.amd64 cloud_sql_proxy
    chmod +x cloud_sql_proxy
    </pre>
3.  Configure your service account.
    1.  Go to the Cloud Console and select your projects
    2.  Click the button to Create Credentials
    3.  Choose Service Account Key
    4.  Choose to create a new Service Account
    5.  Proceed through the wizard and make sure that the key type is JSON
    6.  Create the key and store the automatically downloaded file somewhere safe on your computer.
4.  Setup a directory for the Proxy
    <pre>
    sudo mkdir /cloudsql; sudo chmod 777 /cloudsql
    </pre>
5.  Run the proxy by referencing the key file that your downloaded
    <pre>
    sudo ./cloud_sql_proxy -dir=/cloudsql -fuse -credential_file=path/to/keyfile &
    </pre>
6.  Start up MySQL Workbench
    1.  Find the Static IP address for your database server from the SQL instances console page on the Google Platform and copy it
    2.  Name the connection
    3.  Input the IP address but leave port 3306
    4.  Unless you changed the SQL, stick with root and be ready to enter the root password
    5.  Click test connection, enter your password, and you should be able to connect!!

### Repeated Use
I am sometimes able to reconnect with a stored connection in MySQL Workbench, but sometimes I get a <code>Refused to Connect</code> error.  When this happened I just restarted the proxy with
<pre>sudo ./cloud_sql_proxy -dir=/cloudsql -fuse -credential_file=path/to/keyfile &</pre> making sure I was in the same directory that I downloaded the cloudSQL proxy into originally.  After entering this command in the terminal, you should be able to connect to the database instance.

### On the Compute Engine Server
If you're also using the compute engine instances, you must go through a similar process of setting up the proxy on each one of your virtual machines before you can connect to the database server.  

1.  Before your create an instance that you plan to connect to the database server with, make sure that when you're setting it up you give it  Full API access (or at least selectively enable the Cloud SQL API).  You can't do this step later, you need to create a new virtual machine instance if you forget.

2.  SSH into your new computing instance.

3.  Install mysql.  I always do my calls from python or R, but can't hurt to install the mysql client on the new machine.  Its easier to test if things are going right too.
    <pre>
    sudo apt-get update
    sudo apt-get install mysql-client
    </pre>

4.  Install the proxy like you did on your local computer.
    <pre>
    wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64
    mv cloud_sql_proxy.linux.amd64 cloud_sql_proxy
    chmod +x cloud_sql_proxy
    </pre>

5.  Find out what your database server's connection name is.  It is listed on the sql instances page, and is something like [projectid]:[zone]:[instanceName].  It is not the compute engine instance name (tried that, didn't work).

6.  Start the proxy.  Probably want to be in a root directory for this.
    <pre>
    sudo mkdir /cloudsql; sudo chmod 777 /cloudsql
    sudo ./cloud_sql_proxy -dir=/cloudsql -instances=[INSTANCE_CONNECTION_NAME] &
    </pre>
    with the [INSTANCE_CONNECTION_NAME] set to the connection name of your database server.

7.  Start the MySQL
    <pre>
    mysql -u root -p -S /cloudsql/[INSTANCE_CONNECTION_NAME]
    </pre>
Assuming everything worked as planned, you should now be able to see a <code>mysql</code> prompt, and be able to play with your databases.

### Connecting from Code
If you installed the proxy on your compute engine instance, you probably are also interested in doing some database manipulation from scripts.  For me, I was not able to connect via the ```host``` parameter in the database connection functions, and instead needed to use a unix socket.

These steps are done on your virtual machine.  SSH into it.  For you can use ```nano``` or ```vim``` or other text editor to do the steps in your script.  For R, you could use the rStudio server page.


#### Python
1.  Install your favorite mysql connector module.  
    <pre>
      sudo apt-get install mysqldb-python
    </pre>

2.  In your script:
{% highlight python %}
import MySQLdb
con = MySQLdb.connect(unix_socket='/cloudsql/' + '[INSTANCE_CONNECTION_NAME]', user='root', db='[your_database]', passwd='[your_password]')
print "Connected to the database!"
{% endhighlight %}

Proceed with scripting.

#### R
1.  Install your favorite mysql connector package with the R package manager.
    <pre>
    install.packages("RMySQL")
    </pre>
2.  In your script, make the connection.
{% highlight R %}
library(RMySQL) ## for database communication
drv <- dbDriver("MySQL")
con <- dbConnect(drv, unix.socket='/cloudsql/[INSTANCE_CONNECTION_NAME]', username='root', password='[your_password]', dbname='[your_database]')
{% endhighlight %}

Proceed with scripting.

### Conclusion
It's definitely not easy, but after spending several hours at it, it sometimes works.  
