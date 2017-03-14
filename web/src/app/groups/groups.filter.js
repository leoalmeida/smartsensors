(function(angular) {
    'use strict';

    angular
        .module('app.groups')
        .filter('GroupsFilter', GroupsFilter);

    function GroupsFilter() {
        return function (arr, list) {
            var i, j,  l = arr.length, r = [];
            for (i = 0; i < l; i += 1) {
                if (arr[i].atype === list.type && !list.reversal)
                    r.push(arr[i]);
                else if (arr[i].atype !== list.type && list.reversal)
                    r.push(arr[i]);
            }
            return r;
        };
    }

}(angular));
