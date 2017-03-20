import { Template } from 'meteor/templating';

import { transactionsHandle } from './main';
import { accountsHandle } from './main';

const sumFunc = (pre, tx) => {
    let factor = 1;
    if (tx.type === "out") {
        factor = -1;
    }
    return pre + factor * Math.abs(tx.amount);
};

Template.stats.helpers({
    transactionsLoading() {
        return !transactionsHandle.ready() && !accountsHandle.ready();
    },
    months() {
        const startDate = Session.get("statsDateRangeStart");
        const endDate = Session.get("statsDateRangeEnd");
        if (!startDate || !endDate) {
            return;
        }
        const months = _.groupBy(Transactions.find({
            $and: [
                {
                    createdAt: {
                        $gte: startDate
                    }
                },
                {
                    createdAt: {
                        $lte: endDate
                    }
                }
            ]
        }).fetch(), tx => {
            return moment(tx.createdAt).format("YYYYMM");
        });
        let monthIndex = 0;
        const tagSum = {};
        return Object.keys(months).sort().map((dateGroup)=> {
            monthIndex++;
            const year = dateGroup.substr(0, 4);
            const monthName = moment().month(parseInt(dateGroup.substr(4)) - 1).format("MMMM")
            const flat = [];
            months[dateGroup].forEach(tx => {
                if (tx.tags.length === 0) {
                    flat.push(_.clone(tx));
                }
                tx.tags.forEach((tag)=> {
                    const txClone = _.clone(tx);
                    txClone.tag = tag;
                    flat.push(txClone);
                });
            });
            const tags = (_.groupBy(flat, (tx)=> {
                const resolvedTag = Tags.findOne({_id: tx.tag});
                if (!resolvedTag) {
                    return "-Unkategorisiert-";
                }
                return resolvedTag.name;
            }));
            const tagsArray = Object.keys(tags).sort().map((tagName) => {
                const balance = tags[tagName].reduce(sumFunc, 0);
                if (!tagSum[tagName]) {
                    tagSum[tagName] = 0;
                }
                tagSum[tagName] += balance;
                return {
                    name: tagName,
                    balance: balance,
                    average: tagSum[tagName] / monthIndex
                };
            });
            return {
                month: monthName + " " + year,
                tags: tagsArray
            };
        });
    }
});

Template.stats.onRendered(function () {
    const dateInput = $("#dateRange");

    dateInput.daterangepicker({
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
    dateInput.on("apply.daterangepicker", () => {
        const dateRange = dateInput.data("daterangepicker");
        Session.set("statsDateRangeStart", dateRange.startDate.toDate());
        Session.set("statsDateRangeEnd", dateRange.endDate.toDate());
    });
    const dateRange = dateInput.data("daterangepicker");
    if (dateRange) {
        const format = dateRange.locale.format;
        const separator = dateRange.locale.separator;
        dateRange.startDate = moment().subtract(3, "months");
        dateRange.endDate = moment();
        dateInput.val(moment(dateRange.startDate).format(format)
            + separator
            + moment(dateRange.endDate).format(format));
        Session.set("statsDateRangeStart", dateRange.startDate.toDate());
        Session.set("statsDateRangeEnd", dateRange.endDate.toDate());
    }
});