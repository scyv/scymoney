import { Template } from 'meteor/templating';
import { accountsHandle } from './main';
import { transactionsHandle } from './main';

Template.overview.helpers({
    accountsLoading() {
        return !accountsHandle.ready() && !transactionsHandle.ready();
    },
    accounts() {
        return MoneyAccounts.find();
    },
    balance() {
        return Transactions.find({account: this._id})
            .fetch()
            .reduce((pre, tx) => {
                let factor = 1;
                if (tx.type === "out") {
                    factor = -1;
                }
                return pre + factor * Math.abs(tx.amount);
            }, 0);
    }
});

Template.overview.events({
    'click .btn-add-in': () => {
        Router.go('/in');
    },
    'click .btn-add-out': () => {
        Router.go('/out');
    }
});