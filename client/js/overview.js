import { Template } from 'meteor/templating';

import { Factory } from '../../both/factory';
import { accountsHandle } from './main';
import { transactionsHandle } from './main';
import { connectedUsersHandle } from './main';

Template.overview.helpers({
    accountsLoading() {
        return !accountsHandle.ready() && !transactionsHandle.ready();
    },
    transactionsLoading() {
        return !transactionsHandle.ready() && !connectedUsersHandle.ready();
        ;
    },
    accounts() {
        return MoneyAccounts.find();
    },
    transactions() {
        return Transactions.find({}, {sort: {createdAt: -1}, limit: 100});
    },
    txType() {
        if (this.type === "in") {
            return "list-group-item-success";
        }
        return "list-group-item-danger";
    },
    user() {
        return Meteor.users.findOne(this.userId);
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
    'click .btn-add-in'() {
        Session.set("selectedTx", Factory.createTx("in"));
        Router.go('/in');
    },
    'click .btn-add-out'() {
        Session.set("selectedTx", Factory.createTx("out"));
        Router.go('/out');
    },
    'click .transactions .list-group-item'() {
        Session.set("selectedTx", this);
        Router.go("/" + this.type);
    }
});