
var ostore = require('ostore');

var store = ostore.createStore('users');

function addUser(user, cb) {
    cb(null, store.add(user));
};

function getUserById(id, cb) {
    cb(null, store.get(id));
}

module.exports = {
    addUser: addUser,
    getUserById: getUserById
};

