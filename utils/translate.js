
var statuses = require('../data/statuses.json');
var each = require('./each');

function translateStatus(code) {
    if (statuses[code] && statuses[code].description)
        return statuses[code].description;
        
    return code;
}

function translateStatuses(items) {
    items.forEach(function (item) {
        item.statusDescription = translateStatus(item.status);
    });
}

function translateUser(code, cb) {
    var userService = require('../services/user');
    
    userService.getUserById(code, function (err, data) {
        if (err)
            return cb(err, null);
            
        cb(null, data.username);
    });
}

function translateUsers(items, cb) {
    each(items, function (item, next) {
        translateUser(item.user, function (err, data) {
            if (err)
                return cb(err, null);
                
            item.userDescription = data;
            next();
        });
    }, cb);
}

module.exports = {
    status: translateStatus,
    statuses: translateStatuses,
    user: translateUser,
    users: translateUsers
};