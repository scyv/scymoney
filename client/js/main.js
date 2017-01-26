import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './../views/main.html';

export let accountsHandle;
export let allTransactionsHandle;
export let transactionsHandle;

AllTransactions = new Mongo.Collection("allTransactions");

UI.registerHelper('formattedDate', (date) => {
    if (!date) {
        return '-';
    }
    return moment(date).format('DD.MM.YYYY');
});

Template.layout.events({
    'click .btn-logout'() {
        Meteor.logout();
    }
});

Meteor.startup(() => {
    moment.locale('de');

    Tracker.autorun(() => {
        accountsHandle = Meteor.subscribe("moneyAccounts");
        allTransactionsHandle = Meteor.subscribe("allTansactions");
        transactionsHandle = Meteor.subscribe("transactions", Session.get('selectedAccount'));
    });
});