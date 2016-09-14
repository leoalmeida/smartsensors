(function(angular) {
    'use strict';

    angular.module( 'app.notifications' )
        .service( 'ToastService', ToastService );

    ToastService.$inject = [ '$mdToast' ];

    function ToastService ( $mdToast ) {

        var service = {
            message: '',
            data: {},
            serverError: serverError,
            showTemplate: showTemplate,
            showMessage: showMessage,
            moodChange: moodChange
        };

        return service;

        function serverError( errorMessage ) {
            //The toastController gets an instance of toastService, so the error message is exposed
            //via the message property and the controller provides it to the toast.html view
            this.message = errorMessage;

            $mdToast.show( {
                controller: 'ToastController',
                controllerAs: 'vm',
                templateUrl: 'app/code/layouts/toast-template.layout.html',
                hideDelay: 0,
                position: 'top right'
            });

        }

        function showTemplate() {
            //The toastController gets an instance of toastService, so the error message is exposed
            //via the message property and the controller provides it to the toast.html view
            this.message = 'ok';

            $mdToast.show( {
                hideDelay   : 3000,
                position    : 'top right',
                controller  : 'ToastController',
                controllerAs: 'vm',
                templateUrl : 'app/notifications/layouts/toast-template.layout.html'
            });

        }

        function showMessage(message) {
            //The toastController gets an instance of toastService, so the error message is exposed
            //via the message property and the controller provides it to the toast.html view
            this.message = message;

            var toast = $mdToast.simple()
                .content(message)
                .hideDelay(3000)
                .position('top right');


            $mdToast.show(toast);

        }

        function moodChange( ) {
            //The toastController gets an instance of toastService, so the error message is exposed
            //via the message property and the controller provides it to the toast.html view
            this.message = 'ok';

            $mdToast.show({
                hideDelay   : 10000,
                position    : 'top right',
                controller  : 'MoodController',
                controllerAs: 'vmToast',
                templateUrl : 'app/notifications/layouts/toast-mood.layout.html',
                bindToController: true
            });
        }
    }
})(angular);