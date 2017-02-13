(function(angular) {
    'use strict';

    var host = 'http://smartsensors.herokuapp.com:443/';

    angular
      .module('app.core')
      .constant('API', {
          contacts: host + 'apis/user/',
          sensors: host + '/trigger/sensors/',
          actuators: host + '/trigger/actuators/',
          servers: host + '/trigger/servers/',
          info: host + '/trigger/info/'
      });

})(angular);
