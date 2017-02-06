(function(angular) {
  'use strict';


  angular
      .module('app.info')
      .controller('InfoListController', InfoListController);

  InfoListController.$inject = ['currentUser', '$location', 'CONSTANTS', 'InfoService', '$mdDialog'];

  function InfoListController(currentUser, $location, CONSTANTS, infoService, $mdDialog) {
      var vm = this;

      vm.SCREENCONFIG = CONSTANTS.SCREENCONFIG.INFO;
      vm.ICONS = CONSTANTS.ICONS;
      vm.listItems = infoService.getAll();

      vm.listItems.$loaded()
          .then(function(data) {
              vm.listKeys  = Object.keys(vm.listItems);
              //if (Object.isSealed(arr[idx])) continue;
          })
          .catch(function(error) {
              console.error("Error:", error);
          });

      vm.navigateTo = function(serverID, key){
          $location.path( "/info/public/" + serverID + "/edit/" + key);
      };
  };

})(angular);
