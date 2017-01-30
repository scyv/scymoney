import { Template } from 'meteor/templating';
import { accountsHandle } from './main';

Template.accounts.helpers({
    accountsLoading() {
        return !accountsHandle.ready();
    },
    accounts() {
        return MoneyAccounts.find();
    }
});

Template.accounts.events({
    'click .share-account'() {
        const shareWith = prompt("Mit wem möchten Sie das Konto teilen? (Email-Adresse eingeben)");
        if (shareWith) {
            Meteor.call("shareAccount", shareWith, this._id, (err)=>{
                if (err) {
                    alert("Konto konnte nicht geteilt werden: " + err);
                } else {
                    alert("Konto ist nun geteilt!");
                }
            });
        }
    },
    'click .edit-account'() {
        const newName = prompt("Geben sie den Namen des Kontos an:", this.name);
        if (newName) {
            Meteor.call("renameAccount", newName, this._id);
        }
    },
    'click .delete-account'() {
        alert("Noch nicht implementiert!");
    },
    'click .btn-create-account'() {
        const newName = prompt("Geben sie den Namen des Kontos an:");
        if (newName) {
            Meteor.call("createAccount", newName);
        }
    }
});