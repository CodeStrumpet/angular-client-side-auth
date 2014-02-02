var app = require('../../../server'),
    request = require('supertest'),
    passportStub = require('passport-stub');
passportStub.install(app);

var mongoose = require('mongoose')
    , User = mongoose.model('User');


var user = null;
var user2 = null;
var admin = null;

// user account
var user = User.create({
    'username':'newUser',
    'role':{bitMask: 2,title: "user"},
    'password':'12345'
}, function(err, returnedUser) {
    console.log("User: " + JSON.stringify(returnedUser));
    user = user;
});


// user account 2 - no role
var user2 = User.create({
    'username':'newUser',
    'password':'12345'
}, function(err, returnedUser) {
    console.log("User: " + JSON.stringify(returnedUser));
    user2 = returnedUser
});

// admin account
var admin = User.create({
    'username':'admin',
    'role': { bitMask: 4, title: 'admin' },
    'id': '2',
    'password':'123'
}, function(err, returnedUser) {
    console.log("User: " + JSON.stringify(returnedUser));
    admin = returnedUser;
});

describe('Server Integration Tests - ', function (done) {
        afterEach(function() {
            passportStub.logout(); // logout after each test
        });
        it('Homepage - Return a 200', function(done) {
            request(app).get('/').expect(200, done);
        });
        it('Logout - Return a 200', function(done) {
            request(app).post('/logout').expect(200, done);
        });
        it('As a Logout user, on /users - Return a 403', function(done) {
            request(app).get('/users').expect(403, done);
        });
        it('Register a new user(no role) - Return a 400', function(done) {
            request(app).post('/register').send(user2).expect(400, done);
        });
        it('Register a new user - Return a 200', function(done) {
            request(app).post('/register').send(user).expect(200, done);
        });
        it('As a normal user, on /users - Return a 403', function(done) {
            passportStub.login(user); // login as user
            request(app).get('/users').expect(403, done);
        });
        it('Login as Admin - Return a 200', function(done) {
            request(app).post('/login').send(admin).expect(200, done);
        });
        it('As a Admin user, on /users - Return a 200', function(done) {
            passportStub.login(admin); // login as admin
            request(app).get('/users').expect(200, done);
        });
    });
