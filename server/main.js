import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
    // code to run on server at startup
});

Meteor.publish("transactions", function () {
    const accounts = MoneyAccounts.find({owners: {$in: [this.userId]}});
    const accountNrs = [];
    accounts.forEach(function (account) {
        accountNrs.push(account._id);
    });
    return Transactions.find({account: {$in: accountNrs}}); //, {fields: {secretInfo: 0}});
});


Meteor.publish("tags", function () {
    return Tags.find({userId: this.userId}); //, {fields: {secretInfo: 0}});
});


Meteor.publish("moneyAccounts", function () {
    return MoneyAccounts.find({owners: {$in: [this.userId]}}); //, {fields: {secretInfo: 0}});
});


