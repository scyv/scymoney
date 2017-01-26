import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.publish("allTransactions", function () {
  const accounts = MoneyAccounts.find({ owners: { $in: [this.userId] } });
  const accountNrs = [];
  accounts.forEach(function (account) {
    accountNrs.push(account._id);
  });

  return Transactions.find({ accountId: { $in: accountNrs } }); //, {fields: {secretInfo: 0}});
});


Meteor.publish("transactions", function (accountId) {

  if (accountId) {
    const account = MoneyAccounts.findOne({ $and: [{ owners: { $in: [this.userId] } }, { _id: accountId }] });
    if (account) {
      return Transactions.find({ accountId: accountId });
    }
  }
  return [];
});


Meteor.publish("moneyAccounts", function () {
  return MoneyAccounts.find({ owners: { $in: [this.userId] } }); //, {fields: {secretInfo: 0}});
});


