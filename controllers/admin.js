const Car = require('../models/Car');
const Rent = require('../models/Rent');
const User = require('../models/User');

module.exports = {
    showUsers: async (req, res) => {
        let users = await User.find({});
        users = users.filter(u => !u.roles.includes('Admin'));
        res.render('admin/users', { users });
    },
    showRents: async (req, res) => {
        let rents = await Rent.find({}).populate('owner').populate('car');
        res.render('admin/rents', { rents });
    },
    makeAdmin: async (req, res) => {
        let id = req.params.id;
        let user = await User.findById(id);
        user.roles.push('Admin');
        await User.updateOne({ _id: id }, user);
        res.redirect('/admin/users');
    },
    removeUser: async (req, res) => {
        try {
            let user = await User.findById(req.params.id);
            console.log(user);
            let userRents = await Rent.find({ owner: user._id }).populate('car');
            console.log(userRents);            
            for (const userRent of userRents) {
                console.log(userRent);
                await Car.findByIdAndUpdate(userRent.car._id, { isRented: false });
                await Rent.findByIdAndRemove(userRent._id);
            }
            await User.findByIdAndRemove(user._id);
            res.redirect('/admin/users');
        } catch (e) {
            console.error(e);
            res.redirect('/admin/users');
        }
    },
    endRent: async (req, res) => {
        let currRent = await Rent.findById(req.params.id).populate('car');
        await Car.findByIdAndUpdate(currRent.car._id, { isRented: false });
        await Rent.findByIdAndRemove(currRent._id);
        res.redirect('/admin/rents');
    }
};