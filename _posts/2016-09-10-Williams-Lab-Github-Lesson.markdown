---
layout: post
title:  "William's Lab Github Practical"
date:   2016-09-10 9:22:52 -0500
categories: Tutorial
---


### Objectives
1. Introduce Git and Github: what are they, what's the difference, and how can they be useful to your work in the lab?
2. Create your first repository and practice the workflow of committing and pulling/pushing files.
3. Talk about some of the more advanced features of tools: why might you need to use them, particularly in terms of collaboration.

### Git and Github
**Git** is a open source version control system, a tool that manages the changes of files in a project. Each revision is associated with a timestamp and the person making the change, making it easy to revert back to previous versions of the file if you make a mistake or accidentally break something.  Version control systems are most commonly used for source code management, most any type of files can be managed using a VCS. There are other version control systems on the market today (e.g., Mercurial, Subversion); Git is among the most popular today. Git operates by having distributed project 'repositories' that store your code.  Any server can be a Git server.  For example, the William's lab server could be a Git server if we set it up that way.

**Github** is a company that provides web-based Git repository hosting.  Github manages the servers used to store your project repositories, supports all features of git like branches, merges, and commits, as well as adding additional tools that facilitate project development and collaboration like wiki hosting and issue tracking. Github is a private company valued at over $2 billion with about 20 million [users](https://www.quora.com/How-many-users-does-GitHub-have) and nearly 40 million different projects. Before you trust it completely remember (1) it is a company that has motives other than just backing up your code and (2) if you choose to use GitHub and they do something bad or there is a systemwide failure, there are going to be 20 million other people just, if not more, as upset as your are. There are other git hosting platforms as well: Bitbucket, Gitlab, etc.

### Getting Started

#### Create an account

  To use Github, you need to create an account.  The good news: basic accounts are free to everybody. People with a basic account can create an unlimited of public repositories (can bee seen by anyone). If you have an academic (.edu) email address, you can get an unlimited number of private repositories as well by signing up [here](https://education.github.com/pack). Private repositories let you control who sees your code -- it's hidden from the general public.  In both public and private repositories you can control who changes your code.

  To create an account, go to [https://github.com/join](https://github.com/join) and fill out the fields.  Make sure to use you ```@wisc.edu``` email address.  Keep in mind that your user name will be your public name that identifies you on the platform and will be attached to everything you do there. Also, you'll need to type in your username from time to time, so don't make it *alongandannoyingtotypusername*.  

#### Getting Git on Your Computer
  To use Git on your computer, you need to install it and configure it to work with Github servers. This content was borrowed from [the Git Docs](https://help.github.com/articles/set-up-git/).

  1.  Download the latest version of Git from the [Git Website](https://git-scm.com/downloads). Make sure to get the distribution that corresponds to your operating system, i.e., if you have a Windows machine, don't opt for the Mac download.

  2.  Install Git by following the instructions on the download.

  3.  Open the ```terminal``` on your computer.  In windows this is the ```cmd``` shell.

  4.  Tell Git your name so your changes will be attributed to your Github account:

  {% highlight bash %}
  git config --global user.name "YOUR NAME"
  {% endhighlight %}

  If the terminal does not recognize ```git``` as a command, you might not have installed it correctly, return to step 1.

  5. Tell Git your email address associated with your account.  Make sure to use the same email your signed up with, or things can get funky later on.

  {% highlight bash %}
  git config --global user.email "YOUR EMAIL ADDRESS"
  {% endhighlight %}

  From here on out, the changes you make to your project and other people's projects (if you're collaborating) will be attributed to this email address and username.


#### Create a repository

  A repository is where your project lives. From the github [documentation](https://help.github.com/articles/github-glossary/#repository):

  *"A repository is the most basic element of GitHub. They're easiest to imagine as a project's folder. A repository contains all of
  the project files (including documentation), and stores each file's revision history. Repositories can have multiple collaborators and can be either public or private."*

  Github is not just a way to version control your code, it's also a way to organize your work.  A repository should contain all of the code, files, documentation, etc needed for a project.  For example, I have one repository for my thesis, a separate one for [Ice Age Mapper](https://github.com/scottsfarley93/IceAgeMapper), and another one for [my blog posts](https://github.com/scottsfarley93/scottsfarley93.github.io). Each one has everything it needs for someone to download it and work with that project on their own computer, but nothing extra that might span over to another project.

  1. There are several ways to create a new repository:

      * Click on the '+' button in the top right of any page, then select 'New repository'.
      ![Create1](/assets/github/create_2.png)

      * On your home page, click the green 'New' button.
      ![Create2](/assets/github/create_1.png)

      * Go to [https://github.com/new](https://github.com/new).

      * Create a repository from your desktop.  This is a bit more involved.  See [this tutorial](https://help.github.com/articles/adding-an-existing-project-to-github-using-the-command-line/).

  2.  Give your repository a name.  This name should be short, yet descriptive of your project.  You'll have to type this name every time you want to access your project so short and sweet is ideal.

  3.  Add a description of the project.  This is a useful place to describe a bit more about your project -- particularly important if you're sharing your repo with other collaborators.  Click 'Initialize this project with a README'. This will give you a ```README.md``` file where you can describe your project in detail. You can populate this file with more details later.

  4.  Choose whether to make your project public or private.  I would recommend public repos for most projects, unless they contain sensitive code/information, stuff for publication, or other content you don't want everyone in the world to see.  A major part of working with code and on github in particular is collaboration and openness with projects. I currently have only two private repositories: (1) labs and solutions for Geography 378 and (2) my thesis, because it contains details about the database I'm pushing data into.

  5.  Choose whether to add a ```.gitignore``` file and/or a license file.  The ```.gitignore``` file tells the git system not to track specific file types.  A ```.gitignore``` file can be configured to tell git not to track any type of file.  If you click the box at this point, it will pre-populate a gitignore for you with a list of files that are often ignored when working in a particular language.  For example, if you're working in R, selecting an ```R``` ```.gitignore``` will stop the tracking of .Rdata (your workspace), .Rhistory (your command history), Rstudio files, caches, tempory directories, and files associated with converting markdown to documentation.  See [this repository](https://github.com/github/gitignore) for a list of all the options and the files they ignore. You can add to this file later in the course of your project too.  

      A license file tells users of your code how it may be used.  If you've chosen to use a public repository, you've already committed to some degree of openness in content use. The license file will discriminate between things like commercial use, totally unrestricted use, etc. Github produced [this website](http://choosealicense.com/) if you need to choose a license but don't know which one you need.  I don't usually license my repos.

#### Setting up your repository

  Now you have a new repository, it's currently living only on the Github servers. It's time to set it up on your computer. There are a couple ways to do this.  I'll focus on using command line, because it provides the most flexibility, though it can be a little intimidating at first. Make sure you have git installed on your computer before starting. I have a mac, so commands here are POSIX (mac and linux) specific, but the same concepts apply to git shell in windows. Kevin uses git on windows, so he can help answer your questions here.

  We're first going to 'clone' the repository into a folder of your choosing.  It will create a new folder, so cloning into your documents folder will make a folder in ```documents/yourRepo```. Cloning will load all of the files contained in the github repository onto your local machine. The clone URL is the URL of your project, e.g., [https://github.com/scottsfarley93/IceAgeMapper](https://github.com/scottsfarley93/IceAgeMapper). To change folders in the command line shell, you will use the ```cd``` command.  ```cd ..``` navigates up in the directory structure, ```cd [directoryName]``` switches into a directory. ```ls``` lists the content of a directory, and can be helpful to figure out where you are.  Once you've found a place you want to clone into, clone the repository:

  {% highlight bash %}
  git clone https://github.com/[YOUR USERNAME]/[YOUR REPOSITORY NAME]
  {% endhighlight %}

  Your repository is now set up as a repository folder on your computer and any changes we make *inside* of that folder, will be tracked.  At specific points in time, we'll tell Git that we've made a suitable number of changes and want to mark that as a waypoint in our project history, using commits.

#### Making Changes
  Github tracks things called Diffs -- a record of what was added, deleted, or changed inside of every file in your repo, a lot like the track changes functionality in MS Word. Git is different that Word, though, because you can revert back to previous timestamps. To mark a specific timestamp as a place you might want to come back to, you **commit** your project. Committing is kind of like adding a waypoint to your project -- each file is marked at its current configuration at this point in time. First, we're going to tell Git which files to add to the commit, then we're going to do the commit, identifying it by a short message. Finally, we will push our local changes to the Github server. Before committing, open a terminal and navigate (using ```cd```) to inside of your repository folder.

1\. Add files to the commit:
  {% highlight bash %}
  git add --all
  {% endhighlight %}  

  It is possible to only add specific files to your commit, but I nearly always just tell git to track all of the files inside of my project repository. If you don't want specific files to be tracked, you can add them to your ```.gitignore``` file.

2\. Make the commit
  {% highlight bash %}
  git commit -m "THIS IS A COMMIT MESSAGE"
  {% endhighlight %}

  Your commit messages should be short, easy to identify messages about what you changed since your last commit.  Traditional commit messages are things like "Added feature XYZ", "Fixed bug ABC", "Changed QRS to MNO", etc. It is important to clearly identify your commits so that if you need to revert back to a previous version, you know which version to use.

3\. Push your changes to the Github server
  {% highlight bash %}
  git push [origin branch]
  {% endhighlight %}

  This step takes all of the commits that we've made on the local computer and pushes them out to the Github server.  It is not absolutely necessary to push after every commit, but I usually do -- that way it's backed up remotely on the Github server. Depending on your project configuration and if you're working on a branch that's not the default (more on that later) you may need to add the ```origin branch``` at the end of the line to properly push.

#### Making Changes: An Example
  To show you how Github keeps track of things, we're going to work through a short example.

  1\. Open R or RStudio. Open a new RScript. We're first going to define a variable ```x``` equal to 1. If you don't like R, just open a text file and play along using your own short content examples.

    {% highlight R %}
    x <- 1 ## define x to be one
    {% endhighlight %}

  Save the file into your project repo folder.  

  2\. Let's commit the file now.  It's traditional on the first commit you make on your project to give it the message ```"Initial Commit"```.  
    {% highlight bash %}
    git add --all
    git commit -m "Initial Commit"
    git push
    {% endhighlight %}

  You should see something like:
    {% highlight bash %}
    Scotts-MacBook-Air:Williams-Lab-Github-Practical scottsfarley$ git commit -m "Initial Commit"
  [master 6fef42f] Initial Commit
   1 file changed, 1 insertion(+)
   create mode 100644 myTrackedFile.R
  Scotts-MacBook-Air:Williams-Lab-Github-Practical scottsfarley$ git push
  warning: push.default is unset; its implicit value has changed in
  Git 2.0 from 'matching' to 'simple'. To squelch this message
  and maintain the traditional behavior, use:

    git config --global push.default matching

  To squelch this message and adopt the new behavior now, use:

    git config --global push.default simple

  When push.default is set to 'matching', git will push local branches
  to the remote branches that already exist with the same name.

  Since Git 2.0, Git defaults to the more conservative 'simple'
  behavior, which only pushes the current branch to the corresponding
  remote branch that 'git pull' uses to update the current branch.

  See 'git help config' and search for 'push.default' for further information.
  (the 'simple' mode was introduced in Git 1.7.11. Use the similar mode
  'current' instead of 'simple' if you sometimes use older versions of Git)

  Counting objects: 3, done.
  Delta compression using up to 4 threads.
  Compressing objects: 100% (2/2), done.
  Writing objects: 100% (3/3), 327 bytes | 0 bytes/s, done.
  Total 3 (delta 0), reused 0 (delta 0)
  To https://github.com/scottsfarley93/Williams-Lab-Github-Practical
     80ddf92..6fef42f  master -> master
  {% endhighlight %}

If you see a message that informs you that your commit was ***rejected***, try pulling remote changes first (next section).

3\.  We're really hard working grad students, so now we've updated our R file. Specifically, we no longer think that ```x``` is 1, but rather 2. Also, we've discovered a variable ```y```, and it's value is 5. In our R file, we're going to change the value of ```x``` and add the statement defining ```y```:

  {% highlight R %}
  x <- 2
  y <- 5
  {% endhighlight %}

Save the file and commit again.

4\. Now, go to [github.com](http://github.com) and let's look at the changes that github keeps track of and how we might use the file history.

  - a. Go to your project repository page. Notice that your R file that we've been working on appears there now.

  - b. Click on the file's name to see more details about it.

  ![GithubFile](/assets/github/github_file.png)

  - c. Click the ```history``` button to show a summary of the commits that have been placed on that file.

  ![github_history](/assets/github/github_history.png)

  - d. Notice that there are two commits on this file: the first one, when we first created it and the second one, after we added the variable ```y```.  Click on a commit message to see what was changed during that commit. Click on the most recent commit message.

  ![github_commit](/assets/github/github_commit.png)

  - e. Here is where we can see what Github is keeping track of. In the red, we see things that we removed from the file in the commit.  In the green are lines that were added to the file during that commit. Each file is identified by a hash -- the long string of letters and numbers.

  - f. To look at the raw files at the point when the commit was made, go back one page to the listing of commits and click on the ```< >``` button to show the file at that point in time.  You will notice when you do that is not project in its current state, but shows the state of project when you made that commit.

  ![github_older](/assets/github/git_older.png)

#### Pulling remote files
  One of the most powerful aspects of Github is its ability to unify your workflow across different computers. For example, Kevin is using it to merge code changes across the desktop in his office and his laptop. If you're using it in this way, you're going to need to update your working copy (e.g., on your laptop) with other changes you made previously (e.g., on the desktop).  To do that, we're going to *sync* or *pull* changes from the Github server. **This is different from a pull request.**  We'll touch on pull requests later. The terminology here is one of the most difficult parts of github, because it conflicts with another aspect of the platform and it is different between the command line and the desktop app (if you've used that). Nonetheless, it's actually pretty easy to do:

  {% highlight bash %}
  git pull
  {% endhighlight %}

  At this point a number of things might happen:

  1\.  Everything you have on your local machine already reflects the most recent changes; there were not remote changes to fetch:

  {% highlight bash %}
  Scotts-MacBook-Air:Williams-Lab-Github-Practical scottsfarley$ git pull
  Already up-to-date.
  {% endhighlight %}

  2\.  You have remote changes, but it can be done without conflicts:
  {% highlight bash %}
  Scotts-MacBook-Air:Williams-Lab-Github-Practical scottsfarley$ git pull
  remote: Counting objects: 3, done.
  remote: Compressing objects: 100% (2/2), done.
  remote: Total 3 (delta 0), reused 0 (delta 0), pack-reused 0
  Unpacking objects: 100% (3/3), done.
  From https://github.com/scottsfarley93/Williams-Lab-Github-Practical
     d988f65..1b21b38  master     -> origin/master
  Updating d988f65..1b21b38
  Fast-forward
   myOtherTrackedFile | 1 +
   1 file changed, 1 insertion(+)
   create mode 100644 myOtherTrackedFile
  {% endhighlight %}

  3\.  You have remote changes and they conflict with previous changes you have on your computer that you need to merge manually:
  {% highlight bash %}
  remote: Counting objects: 3, done.
  remote: Compressing objects: 100% (2/2), done.
  remote: Total 3 (delta 1), reused 0 (delta 0), pack-reused 0
  Unpacking objects: 100% (3/3), done.
  From https://github.com/scottsfarley93/Williams-Lab-Github-Practical
     7ebd809..ecf9d38  master     -> origin/master
  Auto-merging myTrackedFile.R
  CONFLICT (content): Merge conflict in myTrackedFile.R
  Automatic merge failed; fix conflicts and then commit the result.
  {% endhighlight %}

  In this case, you will need to determine where your changes conflict with each other, fix them, make a new commit, and try syncing again.  If you navigate to your files, you will find something that looks like this:
  {% highlight R %}
    x <- 2
    <<<<<<< HEAD
    y <- 6
    =======
    y <- 1
    >>>>>>> ecf9d381b84656db7f08c480d5989145a5d79b7f

  {% endhighlight %}

  This shows you where the conflict is.  Delete the lines you don't want, removing the commit hash strings, ```<``` and ```>``` characters as well.  Try committing again. This is a pain in the ass.  Try to avoid having this happen.


  4\.  You have remote changes and they conflict with previous changes on your copy, but they can be merged automatically:

  In this case, you will be able to merge automatically, but you will need to add a "merge message" -- similar to a commit message.  A text editor will open in your terminal where you can enter this message.  Depending on your computer, one of at least two different editors will open.  On a mac, either ```vim``` or ```nano``` will open to do the changes. To use ```vim```, type your commit message then <kbd>:</kbd> + <kbd>q</kbd> + <kbd>Return/Enter</kbd>.  To use nano, type your message, then <kbd>Control</kbd> + <kbd>o</kbd> to save your edits and <kbd>Control</kbd> + <kbd>x</kbd> to exit the editor. On windows, you're on your own. You can set your default editor using command line, which would be helpful.

  The complexity here is for a reason -- to be able to test code that comes from your collaborators before you merge it into your copy.  If you're just working on your own project, these changes are always your own, so this merging stuff seems like overkill. But, when you're working with one or more other people, you can't be sure that something won't break when you include their code.

#### Pulling Remote Files: An Example
  Github.com allows you to edit your files online, so we're going to use that as a proxy for having two computers to work with. Note: I wouldn't really recommend using the online platform to edit your files in (though I do it all the time).  If you're going to make changes, just pull your repo and make changes on your local computer, or you risk having a lot of merge conflicts.

  1\.  Go to your project repo page on github.com.

  2\.  Create a new file, using the ```Create new file``` button.

  3\.  Give it a name and remember to add the file extension.

  4\.  Type some stuff.  For this example, I'm 'using' R, so I'll define a new variable ```z```.

  {% highlight R %}
  z <- 10238
  {% endhighlight %}

  5\.  Save/commit the file. Github will automatically give you a commit message of "[Create/Update] [YOUR FILENAME]" if you're doing changes on Github.com, so feel free to use that.

  6\.  Return to your terminal, making sure you're in the right project directory.

  7\.  Pull the changes you made remotely.

  {% highlight bash %}
  git pull
  {% endhighlight %}

  8\.  Look in the project folder.  Note that the file your created online is now stored on your local computer, the same as any other file in your project.

#### Advanced Github: Features and Scenarios  

One of the most confusing and intimidating aspects of Git/Github is the complicated and diverse set of features and terminology that goes along with the core concepts introduced above. Complicated and diverse, but powerful, especially when you work on long projects with multiple collaborators. Here, we will take a look at some of these concepts, when you might need them, and how they might be useful to your work.  By time time you need these constructs, you will be an expert in committing and syncing with remote repositories, so reading the docs for these things shouldn't be as challenging. Content in the following section makes heavy use of the Github docs.

* Branches

  **Scenario**: You've been working super hard all week on some super cool code stuff.  On Friday afternoon, you finally get it to work! You're super psyched.  But, your weekly meeting with Jack is not until the following Wednesday.  Being the productive grad student that you are, you want to keep working on it over the weekend, adding a new feature.  But you also want to impress Jack with your recent developments and don't want those to be compromised by having a feature that might break those whole thing all together. What to do?

  Enter *branches*. Branches are parallel projects, isolated from each other, on which you can develop new features, without fear that you will forever break your main code.  From the git documentation: "Branching means you diverge from the main line of development and continue to do work without messing with that main line."  Git encourages branching early and often, even multiple times in a day.

  So, in the case of our scenario, we are able to have a branch ```master``` that contains our version that we will show Jack.  On a *separate branch* we will have our new feature.  We can develop on our new feature without messing up the master branch. When it comes time to meet with Jack, we will just sync to the latest commit of the master branch.  After we've perfected our new feature, we can merge it into the master branch and make it part of the main project.

  Committing and syncing on feature branches goes the exact same way as committing and syncing on the master branch.  In fact, the master branch isn't even a special branch, it's just created by default when you make the repository, and you probably didn't change it.  When you're feature is ready to go prime time, you can merge the feature back into the master branch, even if you've made additional changes to the master branch since splitting off on the feature branch.  Look at [this tutorial](https://www.atlassian.com/git/tutorials/using-branches/git-merge) for an in-depth, accessible look at branching and merging.

  [![git_branches](https://www.atlassian.com/git/images/tutorials/collaborating/using-branches/01.svg)](https://www.atlassian.com/git/images/tutorials/collaborating/using-branches/01.svg)

* Pull Requests

  **Scenario**: You're favorite R package is lacking a function that you think would be incredibly useful to you and other users of the package. You could submit an *issue*, but you're smart and figured out how to code the solution by yourself. You could just keep the code to yourself, but that's no fun. Instead, you can make a *pull request* to have your new code merged into the R package's github repository, and thus the R package itself. In general, a pull request is a way to merge code into an existing repo.  If you just automatically merged it, it could break existing code and that would be bad. A pull request lets the owners of the repository test and discuss proposed changes with collaborators and add additional commits before the code is merged. Once everyone has agreed that the changes are good, the pull request can be approved and the changes will be merged.

* Issues

  **Scenario**: You're working on a geovisualization platform for Neotoma data.  You talk with Jack, who talks with Eric Grimm and Simon and the other Neotoma folks, and you start getting emails about features that people would like or bugs that people have found while using your code.  You could just keep these emails, perhaps in a separate email folder, to remember what needs fixing or enhancing, or you could create a *Github issue* to keep track of each feature and bug.  Issues let you make comments on feature requests and bug reports that are publicly viewable on your repo (if your repo is public). This is especially helpful if you're working on a shared repository, or your code is being used as a library. You can also add labels and milestones to issues, reference specific commits, or assign issues to specific users. I use issues to track features and bugs even in small projects that I work on alone because they're a good way to (1) have a to do list and (2) have conversations with myself about what I tried that worked (or not) in relation to a specific issue.

* Forks

  **Scenario**: You really admire the work that Simon does in his [NonAnalogues](https://github.com/SimonGoring/NonAnalogues) and you want to use it in your work. You think that some serious modifications are necessary to the codebase to make it work for your specific application.  Simon is a pretty scary guy, though, so you don't want to approach him about collaborating on your project, you just want to make the changes yourself.  You have two options: 1) you can download a .zip archive of all the files in their current form from Github and go from there or 2) you can make a *fork* of his repository, which creates a new repository under your account, with all of the content from Simon's project. In essence, a fork is a copy of a repository that allows you to freely experiment with changes without affecting the original project.  Github suggests that forks are most commonly used to either propose changes to someone else's ideas or to use some else's project as a starting point for your own idea.  Forks can be superior to downloading the raw files, because they let you stay in sync with the *upstream* (original) repository. In this example, if Simon made a bug fix to his NonAnalogues repo at some point in the future, you could sync that change so that you didn't need to fix that by yourself. Every public repository on Github can be forked by any user.

#### Collaboration on Github
  Github provides an excellent platform for collaborative work.  There are two models of collaboration that work well on Github. Now that we've talked about some of the more advanced features of Github, I think they will make more sense. The content here is adapted from the [Cyber4Paleo (C4P)](http://cyber4paleo.github.io/resources/collaborating.html) workshop resources from the Summer of 2016.

  1.  Fork and Pull
  This is the model that works best for large, many user projects require a stable branch for production (e.g., a code library). A user interested in collaborating on the project forks the repository, makes changes as she wants, then makes a pull request.  The maintainers of the project test the new code, make comments and changes as they see fit, and then merge the changes into the repository. This model allows for better project management, since and administrator can reject changes, ask for revisions, or decide the order in which changes are incorporated.

  2. Shared Repository
  This model is better suited to small projects with intimate/trustworthy teams. In this case, everyone works on the same repository without a forked repository as an intermediary. A user, who has already been vetted as a collaborator on the project, pulls the most recent version of the repository (using clone) onto her machine, makes changes, and then pushes back to the repository, immediate incorporating changes into the parent repository. This model only works with good communication.

  With slightly larger teams, the shared repository starts to break down.  This can be overcome somewhat by using separate branches, which are then merged together into a master branch.  This allows users to work on their own features and changes, while still contributing to a single repo.
