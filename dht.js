var VirtualSerialPort = require('udp-serial').SerialPort;
var firmata = require('firmata');
var five = require("johnny-five");

var sp = new VirtualSerialPort({
  host: '192.168.0.8',
  type: 'udp4',
  port: 3030
});

var io = new firmata.Board(sp);

io.once('ready', function(){
    console.log('IO Ready');
    io.isReady = true;

    var board = new five.Board({io: io, repl: true});


    board.on("ready", function() {
      /*var multi = new five.Multi({
        controller: "DHT11_I2C_NANO_BACKPACK"
      });

      multi.on("change", function() {
        console.log("Thermometer");
        console.log("  celsius           : ", this.thermometer.celsius);
        console.log("  fahrenheit        : ", this.thermometer.fahrenheit);
        console.log("  kelvin            : ", this.thermometer.kelvin);
        console.log("--------------------------------------");

        console.log("Hygrometer");
        console.log("  relative humidity : ", this.hygrometer.relativeHumidity);
        console.log("--------------------------------------");
      });*/
      var light = new five.Light({
        pin: "A0"
      });

      light.on("data", function() {
        console.log("Ambient Light Level: ", this.value);
      });
      
    /*	var pulses = 0;
	    var lastFlowRateTimer = 0;

        var waterflow = new five.Sensor({
            pin: sensor.configurations.pin,
            freq: sensor.configurations.loop
        });

        waterflow.active = true;

        waterflow.on("change", function() {

            console.log("Value: " + this.value);

            var litres = pulses;
            litres /= 7.5;
            litres /= 60;
            var data = {x:getDateString(), y:litres};


            console.log("Waterflow");
            console.log("  Data : ", data.value);
            console.log("--------------------------------------");

        });

        waterflow.on("data", function() {
            if (this.value === 0) {
                lastFlowRateTimer ++;
                return;
            }
            if (this.value === 1) {
                pulses ++;
            }
            lastFlowPinState = this.value;
            flowrate = sensor.configurations.flowrate;
            flowrate /= lastFlowRateTimer;
            lastFlowRateTimer = 0;
        });

      // little helper function to get a nicely formatted date string
      function getDateString () {
        var time = new Date();
        // 10800000 is (GMT-3 Brasilia)
        // for your timezone just multiply +/-GMT by 3600000
        var datestr = new Date(time - 10800000).toISOString().replace(/T/, ' ').replace(/Z/, '');
        return datestr;
      }*/
    });
});
