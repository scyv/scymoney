import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './../views/main.html';

export let accountsHandle;
export let transactionsHandle;
export let tagsHandle;
export let connectedUsersHandle;

UI.registerHelper("formattedDate", (date) => {
    if (!date) {
        return "-";
    }
    return moment(date).format("DD.MM.YYYY");
});

UI.registerHelper("formattedAmount", (amount) => {
    if (!amount) {
        return "0,00 €";
    }
    return ("" + amount.toFixed(2)).replace(/\./, ",") + " €";
});

Template.layout.events({
    'click .home'() {
        Router.go("/");
    },
    'click .btn-logout'() {
        Meteor.logout();
    },
    'click .btn-accounts'() {
        Router.go("/accounts");
    }
});

Meteor.startup(() => {
    moment.locale('de');

    Tracker.autorun(() => {
        accountsHandle = Meteor.subscribe("moneyAccounts");
        transactionsHandle = Meteor.subscribe("transactions");
        tagsHandle = Meteor.subscribe("tags");
        connectedUsersHandle = Meteor.subscribe("connectedUsers");
    });
});