import { Meteor } from 'meteor/meteor'

Meteor.methods({
    'createAccount'(name) {
        MoneyAccounts.insert({ name: name, owners: [this.userId] });
    },
});