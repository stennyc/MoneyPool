
"use strict"

var db = require('../../utils/db');
var loanService = require('../../services/loan');
var userService = require('../../services/user');
var noteService = require('../../services/note');
var paymentService = require('../../services/payment');
var movementService = require('../../services/movement');

var dates = require('../../utils/dates');
var async = require('simpleasync');
var sl = require('simplelists');
var scoring = require('../../scoring.json');

var loanId;
var adamId;
var eveId;
var abelId;

var eveNoteId;
var abelNoteId;

var payments;

exports['clear data'] = function (test) {
    test.async();
    
    db.clear(function (err, data) {
        test.ok(!err);
        test.done();
    });
};

exports['create loan user'] = function (test) {
    test.async();
    
    userService.newUser({ username: 'adam', firstName: 'Adam', lastName: 'Paradise', scoring: 'A' }, function (err, data) {
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

exports['create second investor user'] = function (test) {
    test.async();
    
    userService.newUser({ username: 'abel', firstName: 'Abel', lastName: 'Paradise' }, function (err, data) {
        test.ok(!err);
        test.ok(data);
        abelId = data;
        test.done();
    });
};

exports['new loan'] = function (test) {
    test.async();
    
    loanService.newLoan({ user: adamId, amount: 1000, periods: 12, days: 30 }, function (err, id) {
        test.ok(!err);
        test.ok(id);
        loanId = id;
        test.done();
    });
};

exports['new note from first investor'] = function (test) {
    test.async();
    
    loanService.newNote(loanId, { user: eveId, amount: 600 }, function (err, data) {
        test.ok(!err);
        test.ok(data);
        
        eveNoteId = data;
        
        test.done();
    });
};

exports['new note from second investor'] = function (test) {
    test.async();
    
    loanService.newNote(loanId, { user: abelId, amount: 400 }, function (err, data) {
        test.ok(!err);
        test.ok(data);
        
        abelNoteId = data;
        
        test.done();
    });
};

exports['accept loan'] = function (test) {
    test.async();
    
    var loan;

    async()
    .then(function (data, next) {
        loanService.acceptLoan(loanId, next);
    })
    .then(function (data, next) {
        paymentService.getPaymentsByLoan(loanId, next);
    })
    .then(function (data, next) {
        test.ok(data);
        
        payments = data;
        
        test.done();
    })
    .run();
};
