import { Meteor } from 'meteor/meteor'
import { Factory } from './factory';

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

Router.route('/in', function () {
    if (Meteor.userId()) {
        Session.set("selectedTx", Factory.createTx("in"));
        this.render('inout');
    } else {
        this.render('login');
    }
}, {name: 'in'});

Router.route('/out', function () {
    if (Meteor.userId()) {
        Session.set("selectedTx", Factory.createTx("out"));
        this.render('inout');
    } else {
        this.render('login');
    }
}, {name: 'out'});

/*
 Router.route('/project/:projectId', function () {
 const projectId = this.params.projectId;
 Meteor.subscribe("projects", projectId);
 Session.set('selectedProject', projectId);
 this.render('sprints');
 }, { name: 'sprints' });

 Router.route('/sprint/:sprintId', function () {
 const sprintId = this.params.sprintId;
 Meteor.subscribe("singleSprint", sprintId, () => {
 const projectId = Sprints.findOne().projectId;
 Meteor.subscribe("projects", projectId, () => {
 Session.set('selectedProject', projectId);
 });
 });
 Session.set('selectedSprint', sprintId);
 this.render('availabilities');
 }, { name: 'availabilities' });

 */