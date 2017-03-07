(function(angular) {
    'use strict';

    //var host = 'http://smartsensors.herokuapp.com/';
    //var host = 'http://localhost:8080/';

    var host = 'http://' + location.host;

    angular
      .module('app.core')
      .constant('API', {
          contacts: host + '/apis/user/',
          sensors: host + '/trigger/sensors/',
          actuators: host + '/trigger/actuators/',
          sinks: {
              withkey: host + '/trigger/sinks/withkey/',
              withoutkey: host + '/trigger/sinks/withoutkey/'
          },
          info: host + '/trigger/info/'
      });

})(angular);
