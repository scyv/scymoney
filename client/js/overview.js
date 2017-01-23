Template.overview.events({
    'click .btn-add-in': () => {
        Router.go('/in');
    },
    'click .btn-add-out': () => {
        Router.go('/out');
    }
});