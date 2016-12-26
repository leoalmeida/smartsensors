(function(angular) {
    'use strict';

    angular
        .module('app.recipes')
        .filter('RecipesFilter', RecipesFilter)
        .filter('PublicRecipesFilter', PublicRecipesFilter)
        .filter('TitleCaseFilter', TitleCaseFilter);

    function RecipesFilter() {
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

    function PublicRecipesFilter() {
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
                            if (arr[i][akeys[j]][bkeys[k]][ckeys[m]][list.column] == list.value) {
                                r.push(arr[i][akeys[j]][bkeys[k]][ckeys[m]]);
                            }
                        }
                    }
                }
            }
            return r;
        }
    }

    function TitleCaseFilter() {
        return function(input) {
            input = input || '';
            return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        };
    }

}(angular));
