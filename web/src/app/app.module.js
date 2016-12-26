(function(angular) {
  'use strict';

    var dependencyModules = [
        'ngMaterial',
        'ngAnimate',
        'ngMessages',
        'ngRoute',
        'dndLists',
        'angular-web-notification',
        'firebase',
        'ngMap'];
    var myAppComponents = [
        'app.core',
        'app.auth',
        'app.home',
        'app.notifications',
        'app.friends',
        'app.groups',
        'app.recipes',
        'app.alerts',
        'app.sensors'
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

})(angular);
