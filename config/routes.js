const restrictedPages = require('./auth');
const homeController = require('../controllers/home');
const userController = require('../controllers/user');
const carController = require('../controllers/car');
const adminController = require('../controllers/admin');

module.exports = app => {
    app.get('/', homeController.index);
    app.get('/user/register', restrictedPages.isAnonymous, userController.registerGet);
    app.get('/user/login', restrictedPages.isAnonymous, userController.loginGet);
    app.post('/user/register', restrictedPages.isAnonymous, userController.registerPost);
    app.post('/user/login', restrictedPages.isAnonymous, userController.loginPost);
    app.post('/user/logout', restrictedPages.isAuthed, userController.logout);
    app.get('/user/rents', restrictedPages.isAuthed, userController.showRents);
    app.get('/car/add', restrictedPages.hasRole('Admin'), carController.addGet);
    app.post('/car/add', restrictedPages.hasRole('Admin'), carController.addPost);
    app.get('/car/edit/:id', restrictedPages.hasRole('Admin'), carController.editGet);
    app.post('/car/edit/:id', restrictedPages.hasRole('Admin'), carController.editPost);
    app.get('/car/remove/:id', restrictedPages.hasRole('Admin'), carController.removeGet);
    app.post('/car/remove/:id', restrictedPages.hasRole('Admin'), carController.removePost);
    app.get('/car/all', carController.showAll);
    app.get('/car/rent/:id', restrictedPages.isAuthed, carController.rentGet);
    app.post('/car/rent/:id', restrictedPages.isAuthed, carController.rentPost);
    app.get('/search', carController.search);
    app.get('/admin/users', restrictedPages.hasRole('Admin'), adminController.showUsers);
    app.get('/admin/rents', restrictedPages.hasRole('Admin'), adminController.showRents);
    app.get('/admin/makeAdmin/:id', restrictedPages.hasRole('Admin'), adminController.makeAdmin);
    app.get('/admin/removeUser/:id', restrictedPages.hasRole('Admin'), adminController.removeUser);
    app.get('/admin/endRent/:id', restrictedPages.hasRole('Admin'), adminController.endRent);

    app.all('*', (req, res) => {
        res.status(404);
        res.render('errors/notFound');
    });
};