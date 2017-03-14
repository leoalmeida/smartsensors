(function(angular) {
    'use strict';

    angular
        .module('app.home')
        .controller('HomeController', HomeController);


    HomeController.$inject = ['$rootScope', 'CONSTANTS','currentUser', 'GroupsService', '$mdDialog', 'ToastService', 'NotifyService', '$filter'];

    function HomeController($rootScope, CONSTANTS, currentUser, groupsService, $mdDialog, toastService, notifyService, $filter) {

        var vm = this;

        vm.SCREENCONFIG = CONSTANTS.SCREENCONFIG.HOME;

        vm.subscribedItems = groupsService.getSubscribes("subscribe", currentUser.uid, true);
        vm.groupItems = [];
        vm.likes = [];
        vm.liked = [];
        vm.subscriptions = [];
        vm.groupSubscriptions = [];
        vm.groupLikes = [];

        vm.subscribedItems.$loaded(function (data) {
            for (let item of data) {
                var groupitem = groupsService.getGroup(item.objid2);
                var index = vm.groupItems.push(groupitem) - 1;
                vm.likes[index] = 0;

                vm.groupItems[index].$watch(function (event) {
                    if (event.event === 'child_changed') {
                        var group = vm.groupItems.$getRecord(event.key);
                        var message = group.configurations.name + " atualizada para " + group.lastUpdate.value + (group.lastUpdate.unit || "");
                        toastService.showMessage(message);
                        notifyService.notify(message, "");
                        console.log(event);
                        console.log(message);
                    }
                });
                vm.groupLikes[index] = groupsService.getAssociations('like', item.objid2, false);
                vm.groupLikes[index].$watch(function (data) {
                    vm.likes[index] = vm.groupLikes[index].getUpdateCount();

                    if (data.event==="child_removed"){
                        vm.liked[index] = {key: data.key, like: false}
                    }else {
                        if (vm.groupLikes[index].$getRecord(data.key).objid == currentUser.uid) vm.liked[index] = {
                            key: data.key,
                            like: true
                        };
                        else vm.liked[index] = {key: data.key, like: false};
                    }

                });
                vm.groupSubscriptions[index] = groupsService.getAssociations('subscribe', item.objid2, false);
                vm.groupSubscriptions[index].$watch(function (data) {
                    vm.subscriptions[index] = vm.groupSubscriptions[index].getUpdateCount();
                });

            };
        });

        vm.associate = function (associationType, key, list) {
            if (!list)
                groupsService.setAssociation(associationType, {"updateDate": Date.now()}, currentUser.uid, key);
            else
                groupsService.removeAssocitation(key, list)
        };

        vm.openGroup = function (groupId) {
            return;
        }

    }

})(angular);
