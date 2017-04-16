(function(angular) {
    'use strict';

    angular
        .module('app.home')
        .controller('HomeController', HomeController);


    HomeController.$inject = ['$rootScope', 'CONSTANTS','currentUser', 'GroupsService', '$mdDialog', 'ToastService', 'NotifyService', '$filter', 'MqttClient'];

    function HomeController($rootScope, CONSTANTS, currentUser, groupsService, $mdDialog, toastService, notifyService, $filter, MqttClient) {

        var vm = this;

/*        MqttClient.init("servpub", "teste", "m11.cloudmqtt.com");

        MqttClient.mqtt.on('connect', function(){
            MqttClient.subscribe('advertisements');
            MqttClient.publish("advertisements", "Hello");

            toastService.showMessage(" Conectado com sucesso [cloudmqtt]: advertisements");
            notifyService.notify(" Conectado com sucesso [cloudmqtt]: advertisements", "Advertisements");
            console.log(event);
            console.log(message);
        });

        MqttClient.mqtt.on('message', function (topic, message) {
            // message is Buffer
            console.log(message.toString());
            MqttClient.end();
        });

        MqttClient.mqtt.on('error', function(topic, message, packet){
            toastService.showMessage(" Erro ao conectar no canal: " + topic);
            notifyService.notify(" Erro ao conectar no canal: " + topic, message);
            console.log(message);
        });

        // set callback handlers
        // called when the client loses its connection
        MqttClient.onConnectionLost = function(responseObject) {
            if (responseObject.errorCode !== 0) {
                console.log("onConnectionLost:"+responseObject.errorMessage);
            }
        }

        // called when a message arrives
        MqttClient.onMessageArrived = function (message) {
            toastService.showMessage(message.payloadString);
            notifyService.notify(message.payloadString, "Advertisements");
            console.log("onMessageArrived:"+message.payloadString);
        }
*/
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
