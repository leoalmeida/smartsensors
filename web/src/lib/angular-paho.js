/*
 author: Bipol Alam, <balam@ispatechnology.com>
 description: a really simple wrapper for the paho mqtt service
 */

(function() {
    angular.module('angularPaho', []);
})();

(function() {
    angular.module('angularPaho').factory('MqttClient', [function() {

        // so we can use the member attributes inside our functions
        var client = {};
        var object = {};

            // initialize attributes
        client._url = "";
        client._port = "";
        client._id = "";
        client._client = mqtt;

        // member functions
        object.init = init;
        object.connect = connect;
        object.disconnect = disconnect;
        object.publish = publish;
        object.subscribe = subscribe;
        object.unsubscribe = unsubscribe;
        object.getLastMessageId = getLastMessageId;
        object.handleMessage = handleMessage;
        object.end = end;
        object.isConnected = isConnected;
        object.isReconnecting = isReconnecting;
        object.mqtt = null;

        return object;

        // onConnectionLost callback

        function _call(cb, args) {
            if (client._client) {
                cb.apply(this, args);
            } else {
                console.log('Angular-Paho: Client must be initialized first.  Call init() function.');
            }
        }

        function init(userName, password, location, port, clientid) {
            // initialize attributes

            client._url = 'mqtt://' + location + ":" + port;
            client._port = port;
            client._id = clientid;

            client.options = {
                clientId: clientid || 'mqttjs_' + Math.random().toString(16).substr(2, 8),
                port: port || 20235,
                userName: userName,
                password: password
            };

            // create the client and callbacks
            object.connect(client._url, client.options);
        }

        // connects to the MQTT Server
        function isConnected(options) {
            return client._client.connected;
        }

        // connects to the MQTT Server
        function isReconnecting(options) {
            return client._client.reconnecting;
        }

        // connects to the MQTT Server
        function connect(options) {
            _call(_connect, [options]);
        }

        function _connect(url, options) {
            object.mqtt = client._client.connect(url, options);

            object.mqtt.on('connected', function (connack) {
                toastService.showMessage(" Conectado com sucesso [cloudmqtt]: advertisements");
                notifyService.notify(" Conectado com sucesso [cloudmqtt]: advertisements", "Advertisements");
                console.log(connack.returnCode);
                console.log(connack.sessionPresent);
            })
        }

        function disconnect() {
            _call(_disconnect);
        }

        function _disconnect() {
            client._client.disconnect();
        }

        function publish(topic, message, options) {
            _call(_publish, [topic, message, options]);
        }

        function _publish(topic, message, options) {
            client._client.publish(topic, message, options);
        }

        function subscribe(topic, options) {
            _call(_subscribe, [topic, options]);
        }

        function _subscribe(topic, options) {
            client._client.subscribe(topic, options);
        }

        function unsubscribe(topic, options) {
            _call(_unsubscribe, [topic, options]);
        }

        function _unsubscribe(topic, options) {
            client._client.unsubscribe(topic, options);
        }

        function getLastMessageId() {
            _call(_getLastMessageId);
        }

        function _getLastMessageId() {
            client._client.getLastMessageId(topic, options);
        }
        
        function handleMessage(packet) {
            _call(_handleMessage, [packet]);
        }

        function _handleMessage(packet) {
            client._client.handleMessage(packet);
        }

        function end(force) {
            _call(_end, [force]);
        }

        function _end(force) {
            client._client.end(force);
        }

    }]);
})();
