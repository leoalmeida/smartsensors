(function(angular) {
    'use strict';

    angular
        .module('app.groups')
        .filter('SubscriptionFilter', SubscriptionFilter);

    function SubscriptionFilter() {
            return function (arr, list) {
                var i, l = arr.length, r = [];
                for (i = 0; i < l; i += 1) {
                    var findValue = list.values.some(elem => ((elem.type == list.type)&&(elem.id == arr[i].$id)));
                    if ((findValue && !list.reversal) || (!findValue && list.reversal))
                            r.push(arr[i]);
                }
                return r;
            };
    }

}(angular));
