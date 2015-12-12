
var ostore = require('ostore');

var store = ostore.createStore('users');

function addUser(user, cb) {
    cb(null, store.add(user));
};

function getUserById(id, cb) {
    cb(null, store.get(id));
}

function getUserByUsername(username, cb) {
    var users = store.find({ username: username });
    
    cb(null, users[0]);
}

function getUsers(cb) {
    cb(null, store.find());
}

module.exports = {
    addUser: addUser,
    
    getUserById: getUserById,
    getUserByUsername: getUserByUsername,
    
    getUsers: getUsers
};

