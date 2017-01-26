import { Meteor } from 'meteor/meteor'

Meteor.methods({
    'createAccount'(name) {
        MoneyAccounts.insert({name: name, owners: [this.userId]});
    },
    'saveTx'(tx) {

        const account = MoneyAccounts.findOne({_id: tx.account});
        if (account) {
            Transactions.insert({
                userId: this.userId,
                amount: tx.amount,
                account: account._id,
                type: tx.type === "in" ? "in" : "out",
                description: tx.description,
                tags: []
            });
        }
    }
});