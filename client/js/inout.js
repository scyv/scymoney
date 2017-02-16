import { Template } from 'meteor/templating';
import { tagsHandle } from './main';
import { accountsHandle } from './main';

Template.inout.onRendered(function () {
    $("#txamount").focus();
    const dateInput = $("#txdate");

    dateInput.daterangepicker({
        singleDatePicker: true,
        "showWeekNumbers": true,
        "locale": {
            "format": "DD.MM.YYYY",
            "separator": " - ",
            "applyLabel": "Ok",
            "cancelLabel": "Abbruch",
            "fromLabel": "Von",
            "toLabel": "Bis",
            "customRangeLabel": "Benutzerdef.",
            "weekLabel": "W",
            "daysOfWeek": [
                "So",
                "Mo",
                "Di",
                "Mi",
                "Do",
                "Fr",
                "Sa"
            ],
            "monthNames": [
                "Januar",
                "Februar",
                "März",
                "April",
                "Mai",
                "Juni",
                "Juli",
                "August",
                "September",
                "Oktober",
                "November",
                "Dezember"
            ],
            "firstDay": 1
        }
    });

    const dateRange = dateInput.data("daterangepicker");
    if (dateRange) {
        const selectedTx = Session.get("selectedTx");
        dateRange.startDate = moment(selectedTx.createdAt);
        dateRange.endDate = moment(selectedTx.createdAt);
        const format = dateRange.locale.format;
        dateInput.val(moment(selectedTx.createdAt).format(format));
    }

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
        return ctx.tags.indexOf(this._id) >= 0 ? "active" : "";
    }
});

Template.inout.events({
    'click .select-account'(evt) {
        $('.select-account').removeClass("active");
        $(evt.target).addClass("active");
        $("#txamount").focus();
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

        const dateRange = $("#txdate").data("daterangepicker");
        const selectedTx = Session.get("selectedTx");
        Meteor.call("saveTx", {
            id: selectedTx._id,
            type: selectedTx.type,
            amount: parseFloat(amount),
            createdAt: dateRange.startDate.toDate(),
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