const User = require('../app/models/user');
module.exports = (app, passport) => {

    app.get('/', (req, res) => {
        res.render('index');
    });

    app.get('/login', (req, res) => {
        res.render('login', {
            message: req.flash('loginMessage')
        });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFLash: true
    }));

    app.get('/signup', (req, res) => {
        res.render('signup', {
            message: req.flash('signupMessage')
        });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFLash: true
    }));

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
