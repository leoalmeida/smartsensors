(function(angular) {
    'use strict';

    angular
        .module('app.alerts')
        .controller('MapController', MapController)
        .config(function(uiGmapGoogleMapApiProvider) {
            uiGmapGoogleMapApiProvider.configure({
                key: 'AIzaSyCCO7zMiZZTav3eDQlD6JnVoEcEVXkodns',
                v: '3.26.1', //defaults to latest 3.X anyhow
                libraries: 'weather,geometry,visualization'
            });
        });

    MapController.$inject = ['AlertService', 'uiGmapLogger', 'uiGmapObjectIterators'];

    function MapController(alertService, logger, uiGmapObjectIterators) {
        var vm = this;

        logger.doLog = true;
        logger.currentLevel = logger.LEVELS.debug;
        var lastId = 1;
        var clusterThresh = 6;

        vm.alertItems = [];



        vm.initList = function() {
            vm.syncObject = alertService.getAll();


            vm.syncObject.$loaded().then(function(snapshot) {
                    vm.alertItems.push.apply(vm.alertItems, snapshot);
                    return vm.addMarkers(snapshot);
                }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                    return errorObject;
                });
        };




        vm.map = {
            center: {
                latitude: -22.018959,
                longitude: -47.9178667
            },
            zoom: 11,
            doCluster: true,
            refresh: true,
            options: {
                streetViewControl: false,
                panControl: false,
                maxZoom: 18,
                minZoom: 3
            },
            events: {
                idle: function () {
                    if (vm.map.zoom <= clusterThresh) {
                        if (!vm.map.doCluster) {
                            vm.map.doCluster = true;
                            vm.searchResults.results = [];
                        }
                    }
                    else {
                        if (vm.map.doCluster) {
                            vm.map.doCluster = false;
                            vm.searchResults.results = [];
                        }
                    }
                    vm.initList();
                }
            },
            clusterOptions: {}
        };

        vm.searchResults = {
            results: {
                length: 0
            }
        };

        vm.addMarkers = function (markersList) {
            var markers = {};
            var i = 0;

            for (i = 0; i < markersList.length; i++) {
                markers['someKey-' + lastId] ={
                    'coords': {
                        'latitude': markersList[i].localization.latitude,
                        'longitude': markersList[i].localization.longitude
                    },
                    'key': markersList[i].label
                };
                lastId++;
            }
            lastId = 1;//reset
            markers.length = markersList.length;

            vm.searchResults.results = uiGmapObjectIterators.slapAll(markers);
        };

        vm.reset = function () {
            lastId = 1;
            vm.searchResults = {
                results: {
                    length: 0
                }
            };
        };

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