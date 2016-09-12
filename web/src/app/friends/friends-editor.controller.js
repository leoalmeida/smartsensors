(function(angular) {
    'use strict';

    angular
        .module('app.friends')
        .controller('FriendsEditorController', FriendsEditorController);

    FriendsEditorController.$inject = ['FriendService', '$routeParams', '$location', 'MessengerService'];

    function FriendsEditorController(friendService, $routeParams, $location, messengerService) {
        var vm = this;

        vm.init = function() {
            var _id = $routeParams.id;
            if(_id) {
                friendService.getById(_id)
                    .then(function(resp) {
                        vm.friend = resp.data;
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            } else {
                vm.friend = {};
            }
        };

        vm.save = function(friend) {
            friendService
                .save(friend)
                .then(function(resp) {
                    messengerService.show('Success Save!!!');
                    $location.path('/friends');
                })
                .catch(function(err) {
                    console.log(err);
                    messengerService.show('Unespected Error!!!');
                });
        };
        vm.remove = function(id) {
            friendService
                .remove(id)
                .then(function(resp) {
                    $location.path('/friends');
                    messengerService.show('Success Save!!!');
                })
                .catch(function(err) {
                    messengerService.show('Unespected Error!!!');
                    console.log(err);
                });
        };
    }

})(angular);
