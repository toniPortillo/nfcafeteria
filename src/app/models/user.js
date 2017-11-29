const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
    local: {
        email: String,
        password: String
    },
    facebook: {
        email: String,
        password: String,
        id: String,
        token: String
    },
    twitter: {
        email: String,
        password: String,
        id: String,
        token: String
    },
    google: {
        email: String,
        password: String,
        id: String,
        token: String
    },
});

/* OLIVIER */

// const walletSchema = new mongoose.Schema({
    // wallet: {
        // email: String,
        // password: String,
		// coins : int
    // }
// });

/* OLIVIER */

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
// /* OLIVIER */
// module.exports = mongoose.model('Wallet', walletSchema);
// /* OLIVIER */