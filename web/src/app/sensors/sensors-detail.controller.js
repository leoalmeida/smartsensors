(function(angular) {
  'use strict';

  angular
      .module('app.sensors')
      .controller('SensorDetailsController', SensorDetailsController);


    SensorDetailsController.$inject = ['$log', '$q', '$location', 'currentUser', 'CONSTANTS', '$routeParams', 'SensorsService', 'NgMap', 'NotifyService'];


  function SensorDetailsController($log, $q, $location, currentUser, CONSTANTS,  $routeParams, sensorsService, NgMap, notifyService) {
      var vm = this;
      var key = $routeParams.id;

      vm.SCREENCONFIG = CONSTANTS.SCREENCONFIG.SENSORS;

      vm.currentNavItem = 'localization';
      vm.serverID =  $routeParams.location;
      vm.accessType =  $routeParams.accessType;
      vm.activityType = $routeParams.type;

      vm.isPrivateAccess = (vm.accessType !== "public");
      vm.mapCenter = "current-location";
      // vm.location.sensor = new SensorModel();

      var addressComponentForm = {
          street_number: 'short_name',
          route: 'long_name',
          administrative_area_level_2: 'long_name',
          administrative_area_level_1: 'short_name',
          country: 'long_name',
          postal_code: 'short_name'
      };
      var item = 0;

      vm.configurations = sensorsService.getAllConfigurations();

      vm.configurations.$loaded().then(function(snapshot) {
          vm.pins = snapshot.pins;
          vm.units = snapshot.units;
          vm.icons = snapshot.icons;
          vm.types = snapshot.types;
          vm.states = snapshot.states;
          vm.countries = snapshot.country;
          vm.addressTypes = snapshot.addressTypes;
          vm.localTypes = snapshot.localTypes;
          vm.ledStyles = snapshot.ledStyles;
          vm.sensorTypes = snapshot.sensorTypes;
      });



      vm.asyncSelectSensorType = function(type) {
          var deferred = $q.defer();

          setTimeout(function() {
              deferred.notify('About to greet ' + vm.sensorTypes + '.');

              if (vm.sensorTypes) {
                  deferred.resolve(vm.sensorTypes.find(item => item.type == vm.sensor.type));
              } else {
                  deferred.reject();
              }

          }, 1000);

          return deferred.promise;
      }

      if ($routeParams.type === "edit") {
          vm.activity = "Alterar Sensor";
          vm.sensor = {};
          vm.sensor = sensorsService.getOne(vm.accessType, currentUser, vm.serverID, key);

          vm.sensor.$loaded().then(function(x) {
              if (vm.sensor.localization) {
                  vm.position = {pos: [vm.sensor.localization.latitude, vm.sensor.localization.longitude]};
                  vm.mapCenter = {lat: vm.sensor.localization.latitude, lng: vm.sensor.localization.longitude};
                  vm.address = vm.sensor.localization.address;
              }
              // vm.selectedSensorConfig = vm.sensor.;

              vm.asyncSelectSensorType(vm.sensorTypes)
                  .then(function(sensorConfig) {
                  vm.selectedSensorConfig = sensorConfig;
                      vm.sensorConfig = sensorConfig;
                      vm.selectSensorType();
                  }, function() {
                  vm.selectedSensorConfig = undefined;
                      vm.sensorConfig = undefined;
              });

          }, function (errorObject) {
              console.log("The read failed: " + errorObject.code);
              return errorObject;
          });

      } else {
          vm.activity = "Novo Sensor";
          vm.center = "current-location"
          vm.sensor = {};
          vm.sensor.localization = {};
          vm.sensor.readings = {
              average: 0,
              date: "",
              loops: 0,
              quantity: 0,
              unit: "%",
              value: 0
          };
          vm.sensor.connected = false;
          vm.sensor.enabled = false;
          vm.isPrivateAccess = false;
      }

      NgMap.getMap().then(function(map) {
          vm.map = map;
      });

      vm.placeChanged = function() {
          vm.place = this.getPlace();
          console.log('location', vm.place.geometry.location);
          vm.map.setCenter(vm.place.geometry.location);
          vm.position = {pos:[vm.place.geometry.location.lat(), vm.place.geometry.location.lng()]};
          vm.sensor.localization.address = vm.place.formatted_address;
          fillInAddress(vm.place);
      };

      vm.findMe = function() {
          vm.center = "current-location"
      };

      vm.selectSensorType = function () {
          vm.sensor.type = vm.selectedSensorConfig.type;
          vm.sensorConfig = vm.selectedSensorConfig;
          vm.sensor.icon = "assets/icons/" + vm.selectedSensorConfig.type + ".svg";
      }

      function fillInAddress(place) {
          // Get each component of the address from the place details
          // and fill the corresponding field on the form.
          for (var i = 0; i < vm.place.address_components.length; i++) {
              var addressType = place.address_components[i].types[0];
              if (addressComponentForm[addressType]) {
                  var val = place.address_components[i][addressComponentForm[addressType]];
                  vm.sensor.localization.address_components[i].value = val;
              }
          }
      }

      vm.addMarker = function(event) {
          var ll = event.latLng;
          vm.position = {pos:[ll.lat(), ll.lng()]};
          vm.sensor.localization.latitude = ll.lat();
          vm.sensor.localization.longitude = ll.lng();
      };

      vm.submit = function () {
          if ($routeParams.type === "edit") {
              vm.sensor.$save();
              var message =  'Sensor ' + vm.sensor.name + ' ('+ vm.sensor.type +') foi atualizado.';
              notifyService.notify('Sensor atualizado', message);
          } else{
              vm.accessType = vm.isPrivateAccess ? "private": "public";
              item = sensorsService.addOne(currentUser, vm.accessType , vm.serverID, vm.sensor);
              var message =  'Sensor ' + vm.sensor.name + ' ('+ vm.sensor.type +') encontrado.';
              notifyService.notify('Novo sensor encontrado', message);
          }
          vm.navigateTo("sensors");
      };

      vm.cancel = function () {
          vm.navigateTo("sensors");
      }

      vm.navigateTo = function(key){
          $location.path("/" + key);
      };

      /**
       * Create filter function for a query string
       */
      function createFilterFor(query) {
          var lowercaseQuery = angular.lowercase(query);

          return function filterFn(item) {
              return (item.value.indexOf(lowercaseQuery) === 0);
          };

      }

  }

})(angular);
