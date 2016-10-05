(function(angular) {
    'use strict';

    angular
        .module('app.friends')
        .controller('FriendsListController', FriendsListController)
        .controller('ListBottomSheetCtrl', ListBottomSheetCtrl);

    FriendsListController.$inject = ['$scope', '$mdBottomSheet', '$mdDialog', 'FriendsService', '$routeParams', '$location'];

    function FriendsListController($scope, $mdBottomSheet, $mdDialog, friendsService, $routeParams, $location) {
        var vm = this;

        vm.friends = friendsService.getOne(0);
        vm.alert = '';


        vm.initList = function() {
            vm.name = $routeParams.name ? $routeParams.name : '';
        };

        vm.search = function(name) {
            if(name == '') {
                $location.search({});
            } else {
                $location.search({ name: name });
            }
        };

        vm.show = function(friend) {
            console.log(friend);
        };

        vm.navigateTo = function(key, $event){
            $location.path( "/friends/edit/" + key);
        };

        vm.newFriend = function() {
            $location.path('/friends/new');
        };

        vm.doSecondaryAction = function(key,event) {
            console.log(key);
        };

        vm.showListBottomSheet = function($event) {
          vm.alert = '';
          $mdBottomSheet.show({
            template: '<md-bottom-sheet class="md-list md-has-header"> <md-subheader>Settings</md-subheader> <md-list> <md-item ng-repeat="item in items"><md-item-content md-ink-ripple flex class="inset"> <a flex aria-label="{{item.name}}" ng-click="listItemClick($index)"> <span class="md-inline-list-icon-label">{{ item.name }}</span> </a></md-item-content> </md-item> </md-list></md-bottom-sheet>',
            controller: 'ListBottomSheetCtrl',
            targetEvent: $event
          }).then(function(clickedItem) {
            $scope.alert = clickedItem.name + ' clicked!';
          });
        };

        vm.showAdd = function(ev) {
          $mdDialog.show({
            controller: DialogController,
            template: '<md-dialog aria-label="Mango (Fruit)"> <md-content class="md-padding"> <form name="userForm"> <div layout layout-sm="column"> <md-input-container flex> <label>First Name</label> <input ng-model="user.firstName" placeholder="Placeholder text"> </md-input-container> <md-input-container flex> <label>Last Name</label> <input ng-model="theMax"> </md-input-container> </div> <md-input-container flex> <label>Address</label> <input ng-model="user.address"> </md-input-container> <div layout layout-sm="column"> <md-input-container flex> <label>City</label> <input ng-model="user.city"> </md-input-container> <md-input-container flex> <label>State</label> <input ng-model="user.state"> </md-input-container> <md-input-container flex> <label>Postal Code</label> <input ng-model="user.postalCode"> </md-input-container> </div> <md-input-container flex> <label>Biography</label> <textarea ng-model="user.biography" columns="1" md-maxlength="150"></textarea> </md-input-container> </form> </md-content> <div class="md-actions" layout="row"> <span flex></span> <md-button ng-click="answer(\'not useful\')"> Cancel </md-button> <md-button ng-click="answer(\'useful\')" class="md-primary"> Save </md-button> </div></md-dialog>',
            targetEvent: ev,
          })
          .then(function(answer) {
            $scope.alert = 'You said the information was "' + answer + '".';
          }, function() {
            $scope.alert = 'You cancelled the dialog.';
          });
        };
    }

  ListBottomSheetCtrl.$inject = ['$scope', '$mdBottomSheet'];

  function ListBottomSheetCtrl($scope, $mdBottomSheet) {
    var vm = this;

    vm.items = [
      { name: 'Share', icon: 'share' },
      { name: 'Upload', icon: 'upload' },
      { name: 'Copy', icon: 'copy' },
      { name: 'Print this page', icon: 'print' },
    ];

    vm.listItemClick = function($index) {
        var clickedItem = $scope.items[$index];
        $mdBottomSheet.hide(clickedItem);
    };
  }

  function DialogController($scope, $mdDialog) {
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
  }

})(angular);
