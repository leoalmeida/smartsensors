(function(angular) {
    'use strict';

    angular
        .module('app.sensors')
        .filter('SensorFilter', SensorFilter)
        .filter('PublicSensorFilter', PublicSensorFilter);

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
        }
    }

    function PublicSensorFilter() {
        return function (arr, list) {
            var i, j, k, m, akeys, bkeys, ckeys, l = arr.length, al, bl, cl, r = [];
            for (i = 0; i < l; i += 1) {
                akeys = Object.keys(arr[i]); al = akeys.length;
                for (j = 0; j < al; j += 1) {
                    if (Object.isSealed(arr[i][akeys[j]])) continue;
                    bkeys = Object.keys(arr[i][akeys[j]]); bl = bkeys.length;
                    for (k = 0; k < bl; k += 1) {
                        if (Object.isSealed(arr[i][akeys[j]][bkeys[k]])) continue;
                        ckeys = Object.keys(arr[i][akeys[j]][bkeys[k]]); cl = ckeys.length;
                        for (m = 0; m < cl; m += 1) {
                            var push = false;
                            for (var ind = 0; ind < list.length; ind += 1) {
                                push = (arr[i][akeys[j]][bkeys[k]][ckeys[m]][list[ind].column] == list[ind].value);
                            }
                            if (push) {
                                r.push(arr[i][akeys[j]][bkeys[k]][ckeys[m]]);
                            }
                        }
                    }
                }
            }
            return r;
        }
    }

}(angular));
