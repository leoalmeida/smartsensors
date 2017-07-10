    var Service = require('node-mac').Service;

    // Create a new service object
    var svc = new Service({
      name:'smartSensors Server',
      description: 'The nodejs web server of smartSensors app.',
      script: './webserver/bin/www.js'
    });

    // Listen for the "install" event, which indicates the
    // process is available as a service.
    svc.on('install',function(){
      svc.start();
    });

    svc.install();
