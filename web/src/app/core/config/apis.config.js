(function(angular) {
    'use strict';

    var host = 'http://smartsensors.herokuapp.com/';
    //var host = 'http://localhost:8080/';

    angular
      .module('app.core')
      .constant('API', {
          contacts: host + 'apis/user/',
          sensors: host + 'trigger/sensors/',
          actuators: host + 'trigger/actuators/',
          servers: {
              withkey: host + 'trigger/servers/withkey/',
              withoutkey: host + 'trigger/servers/withoutkey/'
          },
          info: host + 'trigger/info/'
      });

})(angular);
