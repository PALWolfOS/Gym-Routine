# Gym-Routine
Group Project for Info 2602 - an app that allows someone to create a personalized routine of workouts for a certain time, how long the workout is supposed to take, the number of reps and so on, and be able to view the routines of other users. The users are also allowed to use their device's camera and audio inputs to record and dowload workout videos which can later be uploaded on the website and this is done by the use and incorporation of websourced APIs ( the APIs used are suited to firefox browser).
There is also a 3rd party api which is the youtube api which allows users to search for videos that are on youtube based on workouts but from the website itself and not having to go on youtube to search. The app is made to simplify gym workout routines for users to be able to use.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

Use github to run the project on your local machine.

For youtube api to work one must make a google develpers account and when done tehy must create a project and then get the API key from there which is to be put into the server.js file.

### Prerequisites

What things you need to install the software and how to install them

```

Node.js - to install this into the environment, go into the terminal and enter 
npm install express -d --save 
and aslo enter 
npm install googleapis -d --save


Flask - to install this into the environment, go into the terminal and enter
$ pip install Flask


Firebase - to use firebase you must first create an account on the firebase.google.com website


```

## Running the tests

The tests are run on the postman app to see if the api tests are good 
A collection is then created using the postman app which shows all the tests which were done

## Deployment
Firebase was used to deploy this.
1.First you install Firebase CLI via the command prompt  >$npm install -g firebase-tools
2.Then you login via firebase login (you need to have signed up beforehand)
3.Then in an appropriate directory folder, you attempt to initialize Firebase
4.Choose the Hosting tool to setup Firebase Hosting
5.Specify a directory to use as the public root directory (it creates a default (public) folder, but for example the GitHub folder downloaded from the repository is serviceable)
FireBase will proceed to create a 404.html and index.html file
6.Choose a configuration (if you decide to make a single-page app, FireBase automatically rewrites its configurations)
7. Finally, deploy the app via the command prompt >firebase deploy 


## Built With

* gitpod.io
* python
* javascript
* Jinja
* node.js
* Firebase
* html
* bootstrap css
* Flask
* Json
* Youtube API


## Authors

* **Kevin Ramroop** 
* **Joshua Samm**

See also the list of [contributors](https://github.com/PALWolfOS/Gym-Routine/graphs/contributors) who participated in this project.



## Acknowledgments

***Note for the finished website angular is to be used for the frontend.
***Note the website is not fully functional as yet due to the mishap which happened with original group and us given limited notice to complete.
