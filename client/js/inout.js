import { Template } from 'meteor/templating';
import { tagsHandle } from './main';
import { accountsHandle } from './main';

Template.inout.onRendered(function(){
    $("#txamount").focus();
});

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
        return this.type === 'out' ? "danger" : "success";
    },
    type() {
        return this.type === 'out' ? "Ausgabe" : "Einnahme";
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
    'click .btn-cancel'() {
        Router.go("/");
    },
    'click .btn-save'() {
        const account = $(".select-account.active").data("id");
        const description = $("#txdescription").val();
        let amount = $("#txamount").val();
        if (amount.indexOf(",") >= 0) {
            amount = amount.replace(/,/g, ".");
        }
        console.log(amount);
        if (amount === "") {
            return;
        }
        Meteor.call("saveTx", {
            id: Session.get("selectedTx")._id,
            type: Session.get("selectedTx").type,
            amount: parseFloat(amount),
            account,
            description,
            tags: []
        });
        Router.go("/");
    }
});