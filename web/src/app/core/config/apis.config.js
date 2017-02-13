(function(angular) {
    'use strict';

    var host = 'http://smartsensors.herokuapp.com:443/';

    angular
      .module('app.core')
      .constant('API', {
          contacts: host + 'apis/user/',
          pir: host + '/trigger/pir/with/key/'
      });

})(angular);
