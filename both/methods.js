import { Meteor } from 'meteor/meteor'

Meteor.methods({
    'createAccount'(name) {
        MoneyAccounts.insert({name: name, owners: [this.userId]});
    },
    'shareAccount'(shareWith, accountId) {
        if (!this.isSimulation) {
            const shareWithUser = Meteor.users.findOne({emails: {$elemMatch: {address: shareWith}}});
            const account = MoneyAccounts.findOne({_id: accountId, owners: {$in: [this.userId]}});

            if (shareWithUser && account) {
                MoneyAccounts.update({_id: accountId}, {$addToSet: {owners: shareWithUser._id}})
                return;
            }
            throw new Meteor.Error(400, 'Error 400: Bad Request', 'Account not owned or user not found');
        }

    },
    'renameAccount'(newName, accountId) {
        const account = MoneyAccounts.findOne({_id: accountId, owners: {$in: [this.userId]}});

        if (account) {
            MoneyAccounts.update({_id: accountId}, {$set: {name: newName}})
        }
    },
    'saveTx'(tx) {
        const account = MoneyAccounts.findOne({_id: tx.account, owners: {$in: [this.userId]}});
        if (account) {
            if (tx.id) {
                Transactions.update({_id: tx.id}, {
                    $set: {
                        amount: tx.amount,
                        account: account._id,
                        description: tx.description,
                        tags: tx.tags
                    }
                });
            } else {
                Transactions.insert({
                    userId: this.userId,
                    createdAt: new Date(),
                    amount: tx.amount,
                    account: account._id,
                    type: tx.type === "in" ? "in" : "out",
                    description: tx.description,
                    tags: tx.tags
                });
            }
        }
    }
});