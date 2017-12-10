const User = require('../app/models/user');
var Stats = require('../app/models/stats');
const mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;

var test = mongoose.connection;

const { url } = require('../config/database');

module.exports = (app, passport, db) => {

    app.get('/', (req, res) => {
        res.render('index');
    });

    app.get('/login', (req, res) => {
        res.render('login', {
            message: req.flash('loginMessage')
        });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/createTimeStamp',
        failureRedirect: '/login',
        failureFLash: true
    }));
	
	app.get('/createTimeStamp', (req, res) => {
		var ts = new Stats();
		ts.hour = new Date().getHours();
		ts.day = new Date().getDay();
		//console.log(ts);
		//console.log(ts.createdAt);
		ts.save(function (err) {
			//console.log(ts.createdAt);
		});
		
		res.redirect('/profile');
	});
	
	
	
	app.get('/estadisticas', (req, res) => {
		//let stats = req.stats;//.local;
		var i = 0;
		var nbOfUsers = 0;
		var nbOfMen = 0;
		var nbOfWomen = 0;
		var stats = [];
		var cursorStats = Stats.find({}).cursor();
		cursorStats.on('data', function(doc) {
			//console.log(doc);// Called once for every document
			stats.push(doc);
		});	
		
		var users = [];
		var cursorUsers = User.find({}).cursor();
		cursorUsers.on('data', function(doc) {
			users.push(doc);
			nbOfUsers += 1;
			//console.log(user);
			if (doc.local.sex) {
				//console.log(user.local.sex);
				doc.local.sex == "Female" ? nbOfWomen += 1 : nbOfMen += 1;
			}
		});
		
		User.find({}, function(err, users) {
			var lol = users;
			Stats.find({}, function(err, stats, lol) {
				console.log("DANS STATS.FIND");
				console.log(users);
				
				var tab = {
				nbOfUsers:0,
				nbOfMen:0,
				nbOfWomen:0
				}	
				users.forEach(function(user) {
					tab.nbOfUsers += 1;
						//console.log(user);
					if (user.local.sex) {
						//console.log(user.local.sex);
						user.local.sex == "Female" ? tab.nbOfWomen += 1 : tab.nbOfMen += 1;
					}
				});
				
				var tabStats = {
					0: 0,
					1: 0,
					2: 0,
					3: 0,
					4: 0, 
					5: 0,
					6: 0
				};
				
				stats.forEach(function(stat) {
					//console.log(stat);
					tabStats[stat.day] += 1;
				});
				//console.log(tabStats);
				
				var jsonTab = [
					{
						"Day" : "Sunday",
						"Freq" : 0
					},
					{
						"Day" : "Monday",
						"Freq" : 0
					},
					{
						"Day" : "Tuesday",
						"Freq" : 0
					},
					{
						"Day" : "Wednesday",
						"Freq" : 0
					},
					{
						"Day" : "Thursday",
						"Freq" : 0
					},
					{
						"Day" : "Friday",
						"Freq" : 0
					},
					{
						"Day" : "Saturday",
						"Freq" : 0
					}
				];
				
				var tabStatsFinal = [];
				var i = 0;
				for (var key in tabStats) {
					jsonTab[i].Freq = tabStats[i];
					
					++i;
				}
				
				console.log(jsonTab);
						
				res.render('estadisticas', {
					numberOfUsers : tab.nbOfUsers,
					numberOfMen : tab.nbOfMen,
					numberOfWomen : tab.nbOfWomen,
					statsTab : jsonTab
				});
			});			
		});
			
	});

    app.get('/signup', (req, res) => {
        res.render('signup', {
            message: req.flash('signupMessage')
        });
    });

    app.post('/signup', passport.authenticate('local-signup',{
        successRedirect: '/swag',
        failureRedirect: '/signup',
        failureFLash: true
    }));
	
	app.get('/swag', (req,res) => {
		var ts = new Stats();
		ts.hour = new Date().getHours();
		ts.day = new Date().getDay();
		//console.log(ts);
		//console.log(ts.createdAt);
		ts.save(function (err) {
			//console.log(ts.createdAt);
		});
		
		res.redirect('/profile');
		
	});

    app.post('/addInfo', (req, res, next) => {
        let body = req.body;
        let params = req.params;
        console.log(req.user.local.email);
        console.log('--------');
        console.log(body);
        console.log('--------');

        User.findOne({'local.email': req.user.local.email}, (err, user) => {
          user.local.name = body.name;
          user.local.lastname = body.lastname;
          user.local.age = body.age;
          user.local.sex = body.sex;
          user.local.studies = body.studies;
          user.local.role = body.role;
          user.save((error, user) => {
            if(err) {
              res.send('Error save user');
            }else {
              res.redirect('/profile');
            }
          })
        })

    });

    app.post('/addCoin', (req, res, next) => {
      let aux = req.user.local.coins;
      console.log(aux);
      console.log

      User.findOne({'local.email': req.user.local.email}, (err, user) => {
        console.log(user.local.coins);
        console.log('-------');
        user.local.coins = aux + 1;
        console.log(user.local.coins);
        user.save((error, user) => {
          if(err) {
            res.send('Error save user');
          }else {
            res.redirect('/profile');
          }
        })
      })
    });

    app.post('/subtractCoin', (req, res, next) => {
        let body = req.body;
        console.log('--------');
        console.log(body);
        console.log('--------');

        if(body.coins >= req.user.local.coins) {
          body.coins = req.user.local.coins;
        };
        if(body.coins <= 0) {
          body.coins = 0;
        }

        User.findOne({'local.email': req.user.local.email}, (err, user) => {
          user.local.coins -= body.coins;

          user.save((error, user) => {
            if(err) {
              res.send('Error save user');
            }else {
              res.redirect('/profile');
            }
          })
        })
    });
	
	


    app.get('/1ns34tC01n', isLoggedIn, (req, res) => {
        res.render('1ns34tC01n', {
            user: req.user
        });
    });

    app.get('/c0d315m', isLoggedIn, (req, res) => {
        res.render('c0d315m', {
            user: req.user
        });
    });

    app.get('/p41C01n5', isLoggedIn, (req, res) => {
        res.render('p41C01n5', {
            user: req.user
        });
    });

    app.get('/profile', isLoggedIn, (req, res) => {
        res.render('profile', {
            user: req.user
        });
    });

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/');
    };

    app.get('/addInformation', (req, res) => {
        res.render('addInformation', {
          user: req.user
        });
    });
	
	

};