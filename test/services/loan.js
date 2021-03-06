
"use strict"

var loanService = require('../../services/loan');
var userService = require('../../services/user');
var dates = require('../../utils/dates');
var async = require('simpleasync');
var db = require('../../utils/db');

var loanId;
var adamId;
var eveId;

exports['clear data'] = function (test) {
    test.async();
    
    db.clear(function (err, data) {
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
    
    loanService.newLoan({ user: adamId.toString(), amount: 1000 }, function (err, id) {
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
        
        test.ok(db.isNativeId(loan.user));
        test.ok(db.isNativeId(loan.id));
        
        test.equal(loan.user.toString(), adamId.toString());
        test.equal(loan.id.toString(), loanId.toString());
        
        test.equal(loan.status, 'open');
        test.equal(loan.currency, 'ARS');
        test.equal(loan.order, 1);
        test.equal(loan.code, 'adam-0001');
        test.ok(dates.isDateTimeString(loan.created));
        
        test.done();
    });
};

exports['get unknown loan by id'] = function (test) {
    test.async();
    
    loanService.getLoanById(0, function (err, loan) {
        test.ok(!err);
        test.strictEqual(loan, null);
        
        test.done();
    });
};

exports['get loans by user'] = function (test) {
    test.async();
    
    loanService.getLoansByUser(adamId, function (err, loans) {
        test.ok(!err);
        test.ok(loans);
        test.ok(Array.isArray(loans));
        test.equal(loans.length, 1);
        
        test.equal(loans[0].user.toString(), adamId.toString());
        test.equal(loans[0].id.toString(), loanId.toString());
        
        test.done();
    });
};

exports['get loan by unknown user'] = function (test) {
    test.async();
    
    loanService.getLoansByUser(0, function (err, loans) {
        test.ok(!err);
        test.ok(loans);
        test.ok(Array.isArray(loans));
        test.equal(loans.length, 0);
        
        test.done();
    });
};

exports['get loans'] = function (test) {
    test.async();
    
    loanService.getLoans(function (err, loans) {
        test.ok(!err);
        test.ok(loans);
        test.ok(Array.isArray(loans));
        test.equal(loans.length, 1);
        
        test.equal(loans[0].user.toString(), adamId.toString());
        test.equal(loans[0].id.toString(), loanId.toString());
        
        test.done();
    });
};

exports['update loan data'] = function (test) {
    test.async();
    
    loanService.updateLoan(loanId, { name: 'A loan' }, function (err, data) {
        test.ok(!err);
        
        loanService.getLoanById(loanId, function (err, loan) {
            test.ok(!err);
            test.ok(loan);
            test.equal(loan.id.toString(), loanId.toString());
            test.equal(loan.name, 'A loan');
            test.equal(loan.user.toString(), adamId.toString());
            
            test.done();
        });
    });
};

exports['new and reject loan'] = function (test) {
    test.async();
    
    var loanId;
    
    async()
    .then(function (data, next) {
        loanService.newLoan({ user: adamId, amount: 1000 }, next);
    })
    .then(function (id, next) {
        loanId = id;
        
        loanService.rejectLoan(loanId, next);
    })
    .then(function (data, next) {
        loanService.getLoanById(loanId, next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.equal(data.id.toString(), loanId.toString());
        test.equal(data.status, 'rejected');
        test.ok(dates.isDateTimeString(data.rejected));
        test.done();
    });
};

