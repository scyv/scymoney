Template.login.events({
    'click #btnLogin': () => {
        var email = $('#emailInput').val();
        var password = $('#passwordInput').val();

        Meteor.loginWithPassword(email, password,  (err) => {
            if (err) {
                alert("Fehler: " + err, "ERROR");
            } else {
                Router.go('/');
                Tracker.flush();
            }
        });
    },
    'click #btnRegister': () => {
        var email = $('#regEmailInput').val();
        var password = $('#regPasswordInput').val();
        var name = $('#regNameInput').val();

        var user = {
            email: email,
            password: password,
            profile: {
                name: name
            }
        };

        Accounts.createUser(user, (err)  => {
            if (err) {
                alert("Fehler: " + err, "ERROR");
            } else {
                Meteor.call("createAccount", "Privat");
                Router.go('/');
            }
        });
    },
    'click #btnResetPassword': () => {
        var email = $('#emailInput').val();
        if (!email || email.trim() === "") {
            alert("Bitte geben Sie Ihre Email Adresse an");
            return;
        }
        Accounts.forgotPassword({
            email
        }, (err) => {
            if (err) {
                alert("Fehler: " + err, "ERROR");
            } else {
                Router.go("resetPasswordMailSent");
            }
        });
    }
});