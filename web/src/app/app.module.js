(function(angular) {
  'use strict';

    var dependencyModules = [
        'ngResource',
        'ngMaterial',
        'ngAnimate',
        'ngMessages',
        'ngRoute',
        'dndLists',
        'angular-web-notification',
        'firebase',
        //'btford.socket-io',
        'ngMap',
        'base64'];
    var myAppComponents = [
        'app.core',
        'app.auth',
        'app.home',
        'app.notifications',
        'app.friends',
        'app.groups',
        'app.subscriptions',
        'app.recipes',
        'app.alerts',
        'app.sensors',
        'app.actuators',
        'app.sinks',
        'app.info'
    ];

    angular
        .module('app', dependencyModules.concat(myAppComponents))
        .config(function($mdThemingProvider) {
            var customPaletteMap = $mdThemingProvider.extendPalette('blue-grey', {
                'contrastDefaultColor': 'light',
                'contrastDarkColors': ['50'],
                '50': 'ffffff'
            });
            $mdThemingProvider.definePalette('customPaletteMap', customPaletteMap);
            $mdThemingProvider.theme('default')
                .primaryPalette('customPaletteMap', {
                    'default': '500',
                    'hue-2': '300',
                    'hue-3': '100'
                })
                .accentPalette('light-blue');
            $mdThemingProvider.theme('input', 'default')
                .primaryPalette('grey');
        });
        /*.factory('socket', function (socketFactory) {
          return socketFactory();
        });*/

})(angular);
