(function(angular) {
    'use strict';

    angular
        .module('app.groups')
        .filter('SubscriptionFilter', SubscriptionFilter);

    /*function SubscriptionFilter() {
            return function (arr, list) {
                var i, j, l = arr.length, r = [];
                for (i = 0; i < l; i += 1) {
                    var log = [];
                    angular.forEach(arr[i], function(value, key) {
                        if (angular.isObject(value)){
                            value.$id = key;
                            r.push(value);
                        }
                    }, log);
                }
            }
    }*/

    function SubscriptionFilter() {
        return function (arr, list) {
            var i, l = arr.length, r = [];
            for (i = 0; i < l; i += 1) {
                    var findValue = list.values.some(elem => ((elem.atype == list.type)&&(elem.objid2 == arr[i].$id)));
                    //var findValue = arr.some(elem => elem.$id == list.values[i].id);
                    if ((findValue && !list.reversal) || (!findValue && list.reversal))
                        r.push(arr[i]);
            }
            return r;
        };
    }

}(angular));
