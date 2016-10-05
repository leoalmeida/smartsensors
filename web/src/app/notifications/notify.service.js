(function(angular) {
    'use strict';

    angular.module( 'app.notifications' )
        .service( 'NotifyService', NotifyService );

    NotifyService.$inject = [ 'webNotification' ];

    function NotifyService ( webNotification ) {

        var service = {
            message: '',
            data: {},
            serverError: serverError,
            notify: notify,
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

        function notify(message, title ) {
            if(webNotification.allowRequest) {
                if (title) title = ": " + title;
                webNotification.showNotification('Smart Sensors' + title , {
                    body: message,
                    icon: 'assets/icons/motion.jpg',
                    onClick: function onNotificationClicked() {
                        console.log('Notification clicked.');
                    },
                    autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
                }, function onShow(error, hide) {
                    if (error) {
                        window.alert('Unable to show notification: ' + error.message);
                    } else {
                        console.log('Notification Shown.');

                        setTimeout(function hideNotification() {
                            console.log('Hiding notification....');
                            hide(); //manually close the notification (you can skip this if you use the autoClose option)
                        }, 5000);
                    }
                });
            }
        }
    }
})(angular);