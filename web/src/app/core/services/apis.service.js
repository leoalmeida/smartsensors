(function(angular) {
    'use strict';

    var re = new RegExp('^[{].*','g');
    //var host = 'http://smartsensors.herokuapp.com/';
    //var host = 'http://localhost:8080/';

    var host = 'http://' + location.host + '/';


    angular
        .module('app.core')
        .factory('apisDataService', apisDataService);

    apisDataService.$inject = [];

    function apisDataService() {
        var service = {
            getDataInfo: getDataInfo,
            RefDataInfo: RefDataInfo
        };

        return service;

        ////////////

        function getDataInfo(resource, association){
        	return new Promise(function(resolve, reject) {
        		    var xhr = new XMLHttpRequest();
        	    	var t = new RefDataInfo(resource);

		            var url = host + resource.join("/");

		            xhr.open("GET", url, true);
    	        	xhr.onreadystatechange = function(){
	    	        	if (!(this.status === 200)) {
        	            	reject(Error("It is broke"));
        	        	}else if (xhr.readyState == 4 && this.status == 200) {
    	    	            resolve(t.process(xhr));
	        	        }
	            	}

    	    	    xhr.send();
        		});
        };

        function RefDataInfo() {
            this.retcode = 0;
            this.retmsg = "";
            this.process = function (xhr) {
                var objSchema = {};
                var resp = JSON.parse(xhr.responseText);

                /*var row;
                for (row in resp) {
                    if (resp[row]) this.data.push(JSON.parse(resp[row]));
                }*/
                return resp;
            };
        };
    }

})(angular);