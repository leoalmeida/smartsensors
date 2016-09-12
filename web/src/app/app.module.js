(function(angular) {
  'use strict';

    var dependencyModules = [
        'ngMaterial',
        'ngRoute',
        'btford.socket-io',
        'firebase',
        'uiGmapgoogle-maps'];
    const myAppComponents = [
        'app.core',
        'app.auth',
        'app.home',
        'app.notifications',
        'app.friends',
        'app.alerts',
        'app.sensors'
    ];

    angular
      .module('app', dependencyModules.concat(myAppComponents))
      .config(function($mdThemingProvider) {
          let customTealMap = $mdThemingProvider.extendPalette('teal', {
            'contrastDefaultColor': 'dark',
            'contrastDarkColors': ['50'],
            '50': 'ffffff'
          });
          $mdThemingProvider.definePalette('customTeal', customTealMap);
          $mdThemingProvider.theme('default')
            .primaryPalette('customTeal', {
              'default': '500',
              'hue-2': '50'
            }).accentPalette('green');
          $mdThemingProvider.theme('input', 'default')
            .primaryPalette('grey');
      });

})(angular);
