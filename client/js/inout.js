import { Template } from 'meteor/templating';
import { tagsHandle } from './main';
import { accountsHandle } from './main';

Template.inout.onRendered(function () {
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
        if (selectedTx && this._id === selectedTx.account) {
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
        return Tags.find({}, {sort: {name: 1}});
    },
    tagActive(ctx) {
        return ctx.tags.indexOf(this._id) >= 0 ? "active": "";
    }
});

Template.inout.events({
    'click .select-account'(evt) {
        $('.select-account').removeClass("active");
        $(evt.target).addClass("active");
    },
    'click .select-tag'(evt) {
        $(evt.target).toggleClass("active");
    },
    'click .btn-add-tag'() {
        const newTagInput = $("#newTag");
        const tagName = newTagInput.val().trim();
        if (tagName !== "") {
            Meteor.call("addTag", tagName, ()=> {
                $(".select-tag").each((idx, elem) => {
                    if (elem.textContent.toLocaleLowerCase() === tagName.toLocaleLowerCase()) {
                        $(elem).addClass("active");
                    }
                });
            });
            newTagInput.val("");
        }
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
        if (amount === "") {
            return;
        }

        const tags = [];
        $(".select-tag.active").each((idx, elem)=> {
            tags.push($(elem).data("id"));
        });

        Meteor.call("saveTx", {
            id: Session.get("selectedTx")._id,
            type: Session.get("selectedTx").type,
            amount: parseFloat(amount),
            account,
            description,
            tags: tags
        });
        Meteor.call("updateTagUsage", tags);
        Router.go("/");
    },
    'keydown #newTag'(evt) {
        if (evt.keyCode === 13) {
            $(".btn-add-tag").click();
        }
    },
    'keydown #txamount'(evt) {
        if (evt.keyCode === 13) {
            $("#txdescription").focus();
        }
    },
    'keydown #txdescription'(evt) {
        if (evt.keyCode === 13) {
            $("#newTag").focus();
        }
    }
});