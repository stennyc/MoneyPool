
"use strict"

var loanService = require('../../services/loan');
var userService = require('../../services/user');
var dates = require('../../utils/dates');
var async = require('simpleasync');

var loanId;
var adamId;
var eveId;

exports['clear loans'] = function (test) {
    test.async();
    
    loanService.clearLoans(function (err, data) {
        test.ok(!err);
        test.done();
    });
};

exports['clear users'] = function (test) {
    test.async();
    
    userService.clearUsers(function (err, data) {
        test.ok(!err);
        test.done();
    });
};

exports['create loan user'] = function (test) {
    test.async();
    
    userService.newUser({ username: 'adam', firstName: 'Adam', lastName: 'Paradise' }, function (err, data) {
        test.ok(!err);
        test.ok(data);
        adamId = data;
        test.done();
    });
};

exports['create investor user'] = function (test) {
    test.async();
    
    userService.newUser({ username: 'eve', firstName: 'Eve', lastName: 'Paradise' }, function (err, data) {
        test.ok(!err);
        test.ok(data);
        eveId = data;
        test.done();
    });
};

exports['new loan'] = function (test) {
    test.async();
    
    loanService.newLoan({ user: adamId, amount: 1000 }, function (err, id) {
        test.ok(!err);
        test.ok(id);
        loanId = id;
        test.done();
    });
};

exports['get loan by id'] = function (test) {
    test.async();
    
    loanService.getLoanById(loanId, function (err, loan) {
        test.ok(!err);
        test.ok(loan);
        test.equal(typeof loan, 'object');
        
        test.equal(loan.user, adamId);
        test.equal(loan.id, loanId);
        test.equal(loan.status, 'open');
        test.equal(loan.currency, 'ARS');
        test.equal(loan.order, 1);
        test.equal(loan.code, 'adam-0001');
        test.ok(dates.isDateTimeString(loan.created));
        
        test.done();
    });
};

