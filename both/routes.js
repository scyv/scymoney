import { Meteor } from 'meteor/meteor'

Router.configure({
    layoutTemplate: 'layout',
});

Router.route('/', function () {
    if (Meteor.userId()) {
        this.render('overview');
    } else {
        this.render('login');
    }
}, {name: 'overview'});

Router.route('/login', function () {
    this.render('login');
}, {name: 'login'});

Router.route('/accounts', function () {
    if (Meteor.userId()) {
        this.render('accounts');
    } else {
        this.render('login');
    }
}, {name: 'accounts'});

Router.route('/in', function () {
    if (Meteor.userId()) {
        this.render('inout');
    } else {
        this.render('login');
    }
}, {name: 'in'});

Router.route('/out', function () {
    if (Meteor.userId()) {
        this.render('inout');
    } else {
        this.render('login');
    }
}, {name: 'out'});

Router.route('/stats', function () {
    if (Meteor.userId()) {
        this.render('stats');
    } else {
        this.render('login');
    }
}, {name: 'stats'});
