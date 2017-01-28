import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './../views/main.html';

export let accountsHandle;
export let transactionsHandle;
export let tagsHandle;

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
    'click .btn-logout'() {
        Meteor.logout();
    }
});

Meteor.startup(() => {
    moment.locale('de');

    Tracker.autorun(() => {
        accountsHandle = Meteor.subscribe("moneyAccounts");
        transactionsHandle = Meteor.subscribe("transactions");
        tagsHandle = Meteor.subscribe("tags");
    });
});