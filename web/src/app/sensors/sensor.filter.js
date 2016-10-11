(function(angular) {
    'use strict';

    angular
        .module('app.sensors')
        .filter('SensorFilter', SensorFilter);

    function SensorFilter() {
            return function (arr, list) {
                var i, keys = Object.keys(arr), l = keys.length, r = [];
                for (i = 0; i < l; i += 1) {
                    if (Object.isSealed(arr[keys[i]])) continue;
                    if (arr[keys[i]][list.column] == list.value) {
                        arr[keys[i]].key = keys[i];
                        r.push(arr[keys[i]]);
                    }
                }
                return r;
            };
    }

}(angular));
