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
		ts.day = new Date().getDay();
		console.log(ts);
		console.log(ts.createdAt);
		ts.save(function (err) {
			console.log(ts.createdAt);
		});
		setTimeout(function () {
			
		}, 1000);
		
		res.redirect('/profile');
	});
	
	app.get('/estadisticas', (req, res) => {
		let stats = req.stats;//.local;
		var i = 0;
		var nbOfUsers;
		var nbOfMen;
		var nbOfWomen;
		
		// console.log(nbOfUsers);
		// console.log(nbOfMen);
		// console.log(nbOfWomen);
					
					//MongoClient.connect(url, function (err, db) {
					//	db.collection('stats', function (err, collection) {
					//		collection.insert(new Stats());
					//	});
					//});
					//stats.insert({ numberOfUsers : nbOfUsers, numberOfMen: nbOfMen, numberOfWomen: nbOfWomen });

		Stats.find({}, function (err, stats) {
			stats.forEach(function (oneStat) {
				console.log("stat : ");
				console.log(oneStat);
			});
		});			
					
		/*db.collection('users', function (err,collection) {
			if (err) {
				console.log("ERREUR LORS DE COLECITON");
			} else {
				var lol = collection.count();
				console.log("nombre de documents dans la collection users");
				console.log(lol);
				res.render('estadisticas', {
					numberOfUsers: lol,
					numberOfMen: 999,
					numberOfWomen: 999
				});
			}
			
		});	*/

		
		User.find({}, function(err, users) {
			if (err) {
				console.log('error using User.find');
				throw err;
			} else {
				var userArray = {};
				console.log(users.length);
				var nbOfUsers = 0;
				var nbOfMen = 0;
				var nbOfWomen = 0;
				
				users.forEach(function(user){
					nbOfUsers += 1;
					//console.log(user);
					if (user.local.sex) {
						//console.log(user.local.sex);
						user.local.sex == "Female" ? nbOfWomen += 1 : nbOfMen += 1;
					}
				}); 
				console.log("nb of user : " + nbOfUsers);
				res.render('estadisticas', {
					numberOfUsers : nbOfUsers,
					numberOfMen : nbOfMen,
					numberOfWomen : nbOfWomen
				});
				
				// MongoClient.connect(url, function (err, db) {
					// db.collection('stats', function (err, collection) {
						// collection.insert(new Stats());
					// });
				// });
				// stats.insert({ numberOfUsers : nbOfUsers, numberOfMen: 0, numberOfWomen: 0 })
			}

		});
		
		//res.redirect('/');	
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
		console.log("SWAGGGGGGG");
		console.log(req.user.local.email);
		
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