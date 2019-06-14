const Car = require('../models/Car');
const Rent = require('../models/Rent');
const User = require('../models/User');

module.exports = {
    addGet: (req, res) => {
        res.render('car/add');
    },
    addPost: (req, res) => {
        let newCar = req.body;
        Car.create(newCar).then(() => {
            res.redirect('/');
        }).catch(e => {
            console.error(e);
            newCar.error = 'Invalid data';
            res.render('car/add', newCar);
        })
    },
    showAll: async (req, res) => {
        try {
            let cars = await Car.find({ isRented: false });
            res.render('car/all', { cars });
        } catch (e) {
            console.error(e);
            res.redirect('/');
        }
    },
    rentGet: async (req, res) => {
        let car = await Car.findById(req.params.id);
        res.render('car/rent', car);
    },
    rentPost: async (req, res) => {
        try {
            let expireDay = new Date(Date.now());
            expireDay.setHours(24 * +req.body.days);
            expireDay = expireDay.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
            await Rent.create({
                expireDay,
                car: req.params.id,
                owner: req.user.id
            });
            await Car.findByIdAndUpdate(req.params.id, { isRented: true });
            res.redirect('/');
        } catch (e) {
            console.error(e);
            let car = await Car.findById(req.params.id);
            res.render('car/rent', car);
        };
    },
    editGet: async (req, res) => {
        let car = await Car.findById(req.params.id);
        res.render('car/edit', car);
    },
    editPost: async (req, res) => {
        let newCar = req.body;
        console.log(newCar);
        try {
            await Car.findByIdAndUpdate(req.params.id, newCar);
            res.redirect('/');
        } catch (e) {
            console.error(e);
            let car = await Car.findById(req.params.id);
            res.render('car/edit', car);
        }
    },
    removeGet: async (req, res) => {
        let car = await Car.findById(req.params.id);
        res.render('car/remove', car);
    },
    removePost: async (req, res) => {
        try {
            await Car.findByIdAndRemove(req.params.id);
            res.redirect('/');
        } catch (e) {
            console.error(e);
            let car = await Car.findById(req.params.id);
            res.render('car/remove', car);
        }
    },
    search: async (req, res) => {
        let cars = await Car.find({ isRented: false });
        cars = cars.filter((car) => {
            return car.model.toLowerCase().includes(req.query.model.toLowerCase());
        });
        res.render('car/all', { cars });
    }
};