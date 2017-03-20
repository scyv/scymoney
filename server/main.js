import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
    // code to run on server at startup
    Accounts.emailTemplates.siteName = "SCYMONEY";
    Accounts.emailTemplates.from = "SCYMONEY <scymoney@mailgun.scytec.de>";
});

Meteor.publish("transactions", function () {
    if (this.userId) {
        const accounts = MoneyAccounts.find({owners: {$in: [this.userId]}});
        const accountNrs = [];
        accounts.forEach(function (account) {
            accountNrs.push(account._id);
        });
        return Transactions.find({account: {$in: accountNrs}}); //, {fields: {secretInfo: 0}});
    } else {
        this.ready();
    }
});


Meteor.publish("tags", function () {
    if (this.userId) {
        const accounts = MoneyAccounts.find({owners: {$in: [this.userId]}});
        let accountOwners = [this.userId];
        accounts.forEach(function (account) {
            accountOwners = _.union(accountOwners, account.owners);
        });

        return Tags.find({userId: {$in : accountOwners}}); //, {fields: {secretInfo: 0}});
    } else {
        this.ready();
    }
});


Meteor.publish("moneyAccounts", function () {
    if (this.userId) {
        return MoneyAccounts.find({owners: {$in: [this.userId]}}); //, {fields: {secretInfo: 0}});
    } else {
        this.ready();
    }
});

Meteor.publish("connectedUsers", function () {
    if (this.userId) {
        let users = [];
        MoneyAccounts.find({owners: {$in: [this.userId]}}).forEach((account)=> {
            users = users.concat(account.owners);
        });
        return Meteor.users.find({_id: {$in: users}}, {fields: {'profile': 1}});
    } else {
        this.ready();
    }
});


