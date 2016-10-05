(function(angular) {
    'use strict';

    angular
        .module('app.sensors')
        .factory('SensorModel', SensorModel);


    function SensorModel() {

        function Sensor(alert, enabled, icon, label, name, type) {
            this.sensorConfigurations = {};
            this.localization = new Localization();
            this.sensorReadings = new SensorReadings();
            this.alert = alert || false;
            this.enabled = enabled || true;
            this.icon = icon || "";
            this.label = label || "";
            this.name = name || "";
            this.type = type || "";

            return this;
        }

        Sensor.prototype.getSensorInfo = function () {
            return this.SensorConfigurations;
        };

        /**
         * Return the constructor function
         */
        return Sensor;

    };


    var AnalogicConfiguration = function (pin, threshold) {
        this.pin = pin || "";
        this.threshold = threshold || 0;

        return this;
    }


    var DigitalConfiguration = function (pin) {
        this.pin = pin || "";

        return this;
    };


    var SensorConfigurations = function (loop, max, min, model, unit) {
        this.analogicConfiguration = new AnalogicConfiguration();
        this.digitalConfiguration = new DigitalConfiguration();
        this.loop = loop || 0;
        this.max = max || 0;
        this.min = min || 0;
        this.model = model || "";
        this.unit = unit || "";

        return this;
    }


    var AddressComponents = function() {
        this.street_number = "";
        this.route = "";
        this.administrative_area_level_2 = "";
        this.administrative_area_level_1 = "";
        this.country = "";
        this.postal_code = "";

        return this;
    }

    var Localization = function () {
        this.addressComponents = new AddressComponents();
        this.lat = 0;
        this.long = 0;
        this.full_address = "";

        return this;
    }

    var addressComponentForm = {
        street_number: 'short_name',
        route: 'long_name',
        administrative_area_level_2: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
    };

    var SensorReadings = function () {
        this.average = 0;
        this.date = "";
        this.quantity = 0;
        this.unit = "";
        this.value = 0;

        return this;
    }
})(angular);

