'use strict'

var util = require('util'),
    path = require('path'),
    forever = require('forever-monitor'),
    script = path.join(__dirname, '../complexServer.js');

    console.log(script);

  var childMonitor = new (forever.Monitor)(script, {
    max: 1,
    silent: true,
    uid: 'complexServer',
    spinSleepTime: 1000, // Interval between restarts if a child is spinning (i.e. alive < minUptime).
    args: []
  });

  childMonitor.on('start', function () {
    console.log('started');
  });

  childMonitor.on('stop', function () {
    console.log('stopped');
  });


  childMonitor.on('exit', function () {
    console.log('complexServer has exited');
  });

  childMonitor.on('SIGTERM',function () {
    console.log('received SIGTERM');
    setTimeout(function () {
      console.log('Exiting after some time.');
      process.exit(0);
    }, 1000);
  });

  setInterval(function (){
    console.log('Heartbeat');
  }, 1000);

  childMonitor.start();
