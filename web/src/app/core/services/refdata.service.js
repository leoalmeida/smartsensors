(function() {
    'use strict';

    var re = new RegExp('^[{].*','g');

    angular
        .module('app.core')
        .factory('refDataInfoService', refDataInfoService);

    refDataInfoService.$inject = [];

    function refDataInfoService() {
        var service = {
            getRefDataInfo: getRefDataInfo,
            RefDataInfo: RefDataInfo
        };

        return service;

        ////////////

        function getRefDataInfo(storage, cb){
            var xhr = new XMLHttpRequest();
            var t = new RefDataInfo(storage);

            var url = '/app/core/data/'+ storage + '.json'

            xhr.open("GET", url, true);
            xhr.onreadystatechange = function(){
                if (xhr.readyState == 4 && this.status == 200) {
                    t.process(cb, xhr);
                }
            }

            xhr.send();
        };

        function RefDataInfo(table) {
            this.retcode = 0;
            this.retmsg = "";
            this.table = table;
            this.data = [];
            this.process = function (callback, xhr) {
                var objSchema = {};
                var resp = JSON.parse(xhr.responseText);

                /*var row;
                for (row in resp) {
                    if (resp[row]) this.data.push(JSON.parse(resp[row]));
                }*/

                this.data = resp.configurations;

                callback.call(this);
            };
        };
    }

})();