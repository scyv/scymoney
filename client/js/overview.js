import { Template } from 'meteor/templating';
import { accountsHandle } from './main';

Template.overview.helpers({
    accountsLoading() {
        return !accountsHandle.ready();
    },
    accounts() {
        return MoneyAccounts.find();
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