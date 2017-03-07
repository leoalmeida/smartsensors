(function(angular) {
  'use strict';

  angular
      .module('app.actuators')
      .controller('ActuatorDetailsController', ActuatorDetailsController);

  ActuatorDetailsController.$inject = ['$log', '$q', '$location', 'currentUser', 'CONSTANTS', '$routeParams', 'ActuatorsService', 'SinksService', 'NgMap', 'NotifyService'];


  function ActuatorDetailsController($log, $q, $location, currentUser, CONSTANTS,  $routeParams, actuatorsService, sinksService, NgMap, notifyService) {
      var vm = this;
      var key = $routeParams.id;

      vm.SCREENCONFIG = CONSTANTS.SCREENCONFIG.SENSORS;

      vm.currentNavItem = 'main';
      vm.accessType =  $routeParams.accessType;
      vm.activityType = $routeParams.type;

      vm.isPrivateAccess = (vm.accessType !== "public");
      vm.mapCenter = "current-location";
      // vm.location.actuator = new ActuatorModel();

      var addressComponentForm = {
          street_number: 'short_name',
          route: 'long_name',
          administrative_area_level_2: 'long_name',
          administrative_area_level_1: 'short_name',
          country: 'long_name',
          postal_code: 'short_name'
      };
      var item = 0;

      vm.configurations = actuatorsService.getAllConfigurations();

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
          vm.actuatorTypes = snapshot.actuatorTypes;
      });

      let sinkKey = $routeParams.location;
      vm.sink = sinksService.getStatus(vm.accessType, sinkKey);

      //vm.sinkStatus = sinksService.getStatus(vm.accessType, currentUser, vm.sinkID);

      vm.asyncSelectActuatorType = function(type) {
          var deferred = $q.defer();

          setTimeout(function() {
              deferred.notify('About to greet ' + vm.actuatorTypes + '.');

              if (vm.actuatorTypes) {
                  deferred.resolve(vm.actuatorTypes.find(item => item.type == vm.actuator.type));
              } else {
                  deferred.reject();
              }

          }, 1000);

          return deferred.promise;
      }

      if ($routeParams.type === "edit") {
          vm.activity = "Alterar Atuador";
          vm.actuator = {};
          vm.actuator = actuatorsService.getOne(key);

          vm.actuator.$loaded().then(function(data) {
              if (vm.actuator.localization) {
                  vm.position = {pos: [vm.actuator.localization.latitude, vm.actuator.localization.longitude]};
                  vm.mapCenter = {lat: vm.actuator.localization.latitude, lng: vm.actuator.localization.longitude};
                  vm.address = vm.actuator.localization.address;
              }

              vm.asyncSelectActuatorType(vm.actuatorTypes)
                  .then(function(actuatorConfig) {
                      vm.selectedActuatorConfig = actuatorConfig;
                      vm.actuatorConfig = actuatorConfig;
                      vm.selectActuatorType();
                  }, function() {
                  vm.selectedActuatorConfig = undefined;
                      vm.actuatorConfig = undefined;
              });

              //vm.selectedActuatorConfig.type = vm.actuator.type;

          }, function (errorObject) {
              console.log("The read failed: " + errorObject.code);
              return errorObject;
          });

      } else {
          vm.activity = "Novo Actuator";
          vm.center = "current-location"
          vm.actuator = {};
          vm.actuator.localization = {};
          vm.actuator.readings = {
              average: 0,
              date: "",
              loops: 0,
              quantity: 0,
              unit: "%",
              value: 0
          };
          vm.actuator.connected = false;
          vm.actuator.enabled = false;
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
          vm.actuator.localization.address = vm.place.formatted_address;
          fillInAddress(vm.place);
      };

      vm.findMe = function() {
          vm.center = "current-location"
      };

      vm.selectActuatorType = function () {

          vm.actuator.type = vm.selectedActuatorConfig.type;
          vm.actuatorConfig = vm.selectedActuatorConfig;
          vm.actuator.icon = "assets/icons/" + vm.selectedActuatorConfig.type + ".svg";
      }

      function fillInAddress(place) {
          // Get each component of the address from the place details
          // and fill the corresponding field on the form.
          for (var i = 0; i < vm.place.address_components.length; i++) {
              var addressType = place.address_components[i].types[0];
              if (addressComponentForm[addressType]) {
                  var val = place.address_components[i][addressComponentForm[addressType]];
                  vm.actuator.localization.address_components[i].value = val;
              }
          }
      }

      vm.addMarker = function(event) {
          var ll = event.latLng;
          vm.position = {pos:[ll.lat(), ll.lng()]};
          vm.actuator.localization.latitude = ll.lat();
          vm.actuator.localization.longitude = ll.lng();
      };

      vm.submit = function () {
          if ($routeParams.type === "edit") {
              vm.actuator.$save();
              var message =  'Actuator ' + vm.actuator.name + ' ('+ vm.actuator.type +') foi atualizado.';
              notifyService.notify('Actuator atualizado', message);
          } else {
              vm.actuator.connectedSink = {id: vm.sink.$id, display: vm.sink.id};
              vm.actuator.image = "assets/images/profile_header0.png";
              vm.actuator.key = "";
              vm.actuator.owner = currentUser.uid;
              vm.actuator.point = {"anchor" : [ 0, 32 ],"origin" : [ 0, 0 ],"size" : [ 32, 32 ], "url" : vm.actuator.icon};
              vm.accessType = vm.isPrivateAccess ? "private": "public";
              item = actuatorsService.addOne(currentUser, vm.accessType , vm.sinkID, vm.actuator);
              var message =  'Actuator ' + vm.actuator.name + ' ('+ vm.actuator.type +') encontrado.';
              notifyService.notify('Novo actuator encontrado', message);
          }
          vm.navigateTo("actuators");
      };

      vm.cancel = function () {
          vm.navigateTo("actuators");
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
