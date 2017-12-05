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

    app.get('/completeProfile', (req, res) => {
        res.render('completeProfile');
    });


};
