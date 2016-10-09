(function(angular) {
    'use strict';

    angular
        .module('app.home')
        .filter('AlertsFilter', AlertsFilter);

    function AlertsFilter() {
            return function (arr, list) {
                var i, j,  l = arr.length, r = [];
                for (i = 0; i < l; i += 1) {
                    for (j = 0; j < arr[i].length; j += 1) {
                        var findValue = list.values.some(elem => ((elem.type == list.type) && (arr[i][elem.id]!=null)));
                        if ((findValue && !list.reversal) || (!findValue && list.reversal))
                            r.push(arr[i][j]);
                    }
                    /*if (list.values[i].type == list.type) {
                        var findValue = arr.some(elem => (elem[list.values[i].id] != null));
                        if ((findValue && !list.reversal) || (!findValue && list.reversal))
                            r.push(list.values[i]);
                    }*/
                }
                return r;
            };
    }

}(angular));
