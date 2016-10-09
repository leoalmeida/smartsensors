(function(angular) {
  'use strict';

  angular
      .module('app.sensors')
      .controller('SensorDetailsController', SensorDetailsController);


    SensorDetailsController.$inject = ['$location', 'CONSTANTS', '$routeParams', 'SensorsService', 'NgMap', 'NotifyService'];


  function SensorDetailsController($location, CONSTANTS,  $routeParams, sensorsService, NgMap, notifyService) {
      var vm = this;
      var key = $routeParams.id;

      vm.currentNavItem = 'localization';
      // vm.sensor = new SensorModel();

      var addressComponentForm = {
          street_number: 'short_name',
          route: 'long_name',
          administrative_area_level_2: 'long_name',
          administrative_area_level_1: 'short_name',
          country: 'long_name',
          postal_code: 'short_name'
      };
      var item = 0;

      vm.mapCenter = "current-location";

      NgMap.getMap().then(function(map) {
          vm.map = map;
      });

      if ($routeParams.type === "edit") {
          vm.activity = "Alterar Sensor";
          vm.sensor = {};
          vm.sensor = sensorsService.getOne(key);

          vm.sensor.$loaded().then(function(x) {
              if (vm.sensor.localization) {
                  vm.position = {pos: [vm.sensor.localization.latitude, vm.sensor.localization.longitude]};
                  vm.mapCenter = {lat: vm.sensor.localization.latitude, lng: vm.sensor.localization.longitude};
                  vm.address = vm.sensor.localization.address;
              }
              item = vm.sensor.$id;
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
          vm.sensor.owner = "default";
      }

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

      vm.configurations = sensorsService.getAllConfigurations();

      vm.configurations.$loaded().then(function(snapshot) {
          vm.analogicpins = snapshot.analogicpins;
          vm.digitalpins = snapshot.digitalpins;
          vm.units = snapshot.units;
          vm.icons = snapshot.icons;
          vm.types = snapshot.types;
          vm.states = snapshot.states;
          vm.countries = snapshot.country;
          vm.addressTypes = snapshot.addressTypes;
          vm.localTypes = snapshot.localTypes;
      });

      vm.submit = function () {
          if (item) {
              vm.sensor.$save();
              var message =  'Sensor ' + vm.sensor.name + ' ('+ vm.sensor.type +') foi atualizado.';
              notifyService.notify('Sensor atualizado', message);
          } else{
              item = sensorsService.addOne(vm.sensor);
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

  }

})(angular);
