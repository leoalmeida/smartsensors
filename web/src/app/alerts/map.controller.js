(function(angular) {
    'use strict';

    angular
        .module('app.alerts')
        .controller('MapController', MapController);

    MapController.$inject = ['currentUser', '$timeout', 'AlertService', 'SensorsService', 'SubscriptionsService', 'NgMap'];

    function MapController(currentUser, $timeout, alertService, sensorsService, subscriptionsService, NgMap) {
        var vm = this;

        vm.alertItems = alertService.getPublic();
        vm.sensorItems = sensorsService.getOwn(currentUser);
        vm.ownAlerts = alertService.getOwn(currentUser);
        vm.subscribedItems = subscriptionsService.getOwn(currentUser);

        vm.mapCenter = "current-location";

        NgMap.getMap().then(function(map) {
            vm.map = map;
        });

        vm.toggleBounce = function() {
            if (this.getAnimation() != null) {
                this.setAnimation(null);
            } else {
                this.setAnimation(google.maps.Animation.BOUNCE);
            }
        };

        var icons = {
            sensor: {
                url: "assets/icons/notification/ic_wifi_24px.svg",
                size: new google.maps.Size(24, 24),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 24)
            },
            sensor1: {
                url: "assets/icons/device/ic_nfc_24px.svg",
                size: new google.maps.Size(24, 24),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 24)
            },
            sensor2: {
                url: "assets/icons/device/ic_network_wifi_24px.svg",
                size: new google.maps.Size(24, 24),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 24)
            },
            sensor3: {
                url: "assets/icons/device/ic_wifi_tethering_24px.svg",
                size: new google.maps.Size(24, 24),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 24)
            },
            sensor4: {
                url: "assets/icons/hardware/ic_router_24px.svg",
                size: new google.maps.Size(24, 24),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 24)
            },
            sensor5: {
                url: "assets/icons/action/ic_settings_remote_24px.svg",
                size: new google.maps.Size(24, 24),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 24)
            },
            humiditysensor: {
                url: "assets/icons/action/ic_opacity_24px.svg",
                size: new google.maps.Size(24, 24),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 24)
            },
            lightsensor: {
                url: "assets/icons/image/ic_flare_24px.svg",
                size: new google.maps.Size(24, 24),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 24)
            },
            lightsensor2: {
                url: "assets/icons/image/ic_flash_on_24px.svg",
                size: new google.maps.Size(24, 24),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 24)
            },
            lightbulbsensor: {
                url: "assets/icons/image/ic_wb_incandescent_24px.svg",
                size: new google.maps.Size(24, 24),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 24)
            },
            cloudysensor: {
                url: "assets/icons/image/ic_wb_cloudy_24px.svg",
                size: new google.maps.Size(24, 24),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 24)
            },
            sunnysensor: {
                url: "assets/icons/image/ic_wb_sunny_24px.svg",
                size: new google.maps.Size(24, 24),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 24)
            },
            freezesensor: {
                url: "assets/icons/places/ic_ac_unit_24px.svg",
                size: new google.maps.Size(24, 24),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 24)
            },
            alert: {
                url: "assets/icons/social/ic_notifications_24px.svg",
                size: new google.maps.Size(24, 24),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 24)
            },
            alert2: {
                url: "assets/icons/social/ic_notifications_24px.svg",
                size: new google.maps.Size(24, 24),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 24)
            },
            place: {
                url: "assets/icons/maps/ic_place_24px.svg",
                size: new google.maps.Size(24, 24),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 24)
            },
            traffic: {
                url: "assets/icons/maps/ic_traffic_24px.svg",
                size: new google.maps.Size(24, 24),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 24)
            },
            sensorissue: {
                url: "assets/icons/notification/ic_sync_problem_24px.svg",
                size: new google.maps.Size(24, 24),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 24)
            }
        };
        var shape = {
            coords: [1, 1, 1, 20, 18, 20, 18 , 1],
            type: 'poly'
        };

        vm.alertItems.$loaded().then(function(snapshot) {
            for (var i=0; i<snapshot.length; i++) {
                for (var j=0; j<snapshot[i].length; j++) {
                    var marker = new google.maps.LatLng(snapshot[i][j].configurations.localization.lat,snapshot[i][j].configurations.localization.lng);
                    $timeout(function () {
                        // add a marker this way does not sync. marker with <marker> tag
                        new google.maps.Marker({
                            position: marker,
                            map: vm.map,
                            draggable: false,
                            animation: google.maps.Animation.DROP,
                            icon: icons.alert,
                            shape: shape
                        });
                    }, (i+j) * 200);
                }
            }
        });

        vm.sensorItems.$loaded().then(function(snapshot) {
            for (var i=0; i<snapshot.length; i++) {
                    if (snapshot[i].localization == null) continue;
                    var marker = new google.maps.LatLng(snapshot[i].localization.lat,snapshot[i].localization.lng);
                    $timeout(function () {
                        // add a marker this way does not sync. marker with <marker> tag
                        new google.maps.Marker({
                            position: marker,
                            map: vm.map,
                            draggable: false,
                            animation: google.maps.Animation.DROP,
                            icon: icons.sensor5,
                            shape: shape
                        });
                    }, i * 200);
            }
        });

        /*
        vm.places = [{"boundary":{"type":"Polygon","coordinates":[[[-22.018959,-47.9178667],[-22.017362,-47.915886],[-22.0161282,-47.9137721],[21.983115,-47.882971]]]},"name":"São Carlos"}];

        $log.currentLevel = $log.LEVELS.debug;

        GoogleMapApi.then(function(maps) {
            vm.googleVersion = maps.version;
            alertService.getAll().once("value", function(data) {
                vm.alertItems = data.val();
            });

            maps.visualRefresh = true;

            var onMarkerClicked = function (marker) {
                marker.showWindow = true;
                vm.$apply();
                //window.alert("Marker: lat: " + marker.latitude + ", lon: " + marker.longitude + " clicked!!")
            };
            vm.onMarkerClicked = onMarkerClicked;

            vm.refreshMap = function () {
                //optional param if you want to refresh you can pass null undefined or false or empty arg
                vm.map.control.refresh(vm.map.center);
                vm.map.control.getGMap().setZoom(vm.map.zoom);
                return;
            };

        });
        */
    }

})(angular);
