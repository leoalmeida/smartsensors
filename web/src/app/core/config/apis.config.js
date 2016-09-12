(function(angular) {
    'use strict';

    var host = 'http://localhost:3000/';

    angular
      .module('app.core')
      .constant('API', {
          contacts: host + 'apis/user/'
    });

})(angular);
