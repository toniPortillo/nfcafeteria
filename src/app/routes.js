var user = require ('./models/user');

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
    }

    app.get('/completeProfile', (req, res) => {
        res.render('completeProfile');
    });
	
	app.post('/completeProfile', isLoggedIn, function(req, res) {
		user.update({_id: req.session.passport.user.id}, {
			nombre: req.body.nombre 
		}, function(err, numberAffected, rawResponse) {
		   console.log('new profile update error');
		});
		res.render('completeProfile', {
			user : req.user // get the user out of session and pass to template
		});
	});
};