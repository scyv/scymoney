import { Template } from 'meteor/templating';
import { tagsHandle } from './main';
import { accountsHandle } from './main';

Template.inout.helpers({
    accountsLoading() {
        return !accountsHandle.ready();
    },
    accounts() {
        return MoneyAccounts.find();
    },
    accountActive() {
        const selectedTx = Session.get("selectedTx");
        if (this._id === selectedTx.account) {
            return "active";
        }
        return "";
    },
    selectedTX() {
        return Session.get("selectedTx");
    },
    btnStyle() {
        return this.type === 'out'?"danger":"success";
    },
    type() {
        return this.type === 'out'?"Ausgabe":"Einnahme";
    },
    tagsLoading() {
        return !tagsHandle.ready();
    },
    tags() {
        return Tags.find();
    }
});

Template.inout.events({
    'click .select-account'(evt) {
        $('.select-account').removeClass("active");
        $(evt.target).addClass("active");
    },
    'click .btn-save'() {
        const account = $(".select-account").data("id");
        const description = $("#txdescription").val();
        const amount = parseFloat($("#txamount").val());
        Meteor.call("saveTx", {
            type: Session.get("selectedTx").type,
            account,
            description,
            amount,
            tags: []
        });
        Router.go("/");
    }
});