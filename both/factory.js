export const Factory = {
    createTx (type) {
        const selectedAccount = Session.get("selectedAccount");
        let account = undefined;
        if (selectedAccount) {
            account = selectedAccount;
        } else {
            account = MoneyAccounts.findOne()._id;
            Session.set("selectedAccount", account);
        }
        return {
            amount: 0.0,
            account: account,
            type: type,
            description: "",
            tags: []
        };
    }
};