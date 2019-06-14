const User = require('../models/User');
const Rent = require('../models/Rent');
const encryption = require('../util/encryption');

module.exports = {
    registerGet: (req, res) => {
        res.render('user/register');
    },
    registerPost: async (req, res) => {
        const reqUser = req.body;

        if (!reqUser.password || !reqUser.repeatPassword) {
            reqUser.error = 'Please, fill out all fields';
            res.render('user/register', reqUser);
            return;
        } else if (reqUser.password !== reqUser.repeatPassword) {
            reqUser.error = 'Passwords must match';
            res.render('user/register', reqUser);
            return;
        } else {
            const salt = encryption.generateSalt();
            const hashedPass = encryption.generateHashedPassword(salt, reqUser.password);

            try {
                const user = await User.create({
                    username: reqUser.username,
                    hashedPass,
                    salt,
                    firstName: reqUser.firstName,
                    lastName: reqUser.lastName,
                    roles: ['User']
                });
                req.logIn(user, err => {
                    if (err) {
                        console.error(err);
                        reqUser.error = err;
                        res.render('user/register', reqUser);
                        return;
                    } else {
                        res.redirect('/');
                    }
                });
            } catch (err) {
                console.error(err);
                reqUser.error = err;
                res.render('user/register', reqUser);
            }
        }
    },
    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    },
    loginGet: (req, res) => {
        res.render('user/login');
    },
    loginPost: async (req, res) => {
        const reqUser = req.body;
        try {
            const user = await User.findOne({
                username: reqUser.username
            });
            if (!user) {
                reqUser.error = 'Invalid username!';
                res.render('user/login', reqUser)
                return;
            } else if (!user.authenticate(reqUser.password)) {
                reqUser.error = 'Invalid password!';
                res.render('user/login', reqUser);
                return;
            } else {
                req.logIn(user, err => {
                    if (err) {
                        reqUser.error = err;
                        res.render('user/login', reqUser);
                    } else {
                        res.redirect('/');
                    }
                });
            }
        } catch (e) {
            reqUser.error = e;
            res.render('user/login', reqUser);
        }
    }, 
    showRents: async (req, res) => {
        try {
            let cars = await Rent.find({ owner: req.user.id }).populate('car');
            res.render('user/rented', { cars });
        } catch (e) {
            console.error(e);
            res.redirect('/');
        }
    }
}