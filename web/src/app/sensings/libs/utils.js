module.exports.log = function (peripheral) {
  var advertisement = peripheral.advertisement;

  var uuid = peripheral.uuid;
  var localName = advertisement.localName;
  var txPowerLevel = advertisement.txPowerLevel;
  var manufacturerData = advertisement.manufacturerData;
  var serviceData = advertisement.serviceData;
  var serviceUuids = advertisement.serviceUuids;
  var rssi = peripheral.rssi;

  if (uuid) {
    console.log('UUID: ' + uuid);
  }

  if (localName) {
    console.log('  Local Name        = ' + localName);
  }

  if (txPowerLevel) {
    console.log('  TX Power Level    = ' + txPowerLevel);
  }

  if (manufacturerData) {
    var manudata = manufacturerData.toString('hex');
    console.log('  Manufacturer Data = '+ manudata);

    if (manudata.substring(0, 4) === "2a6e"){
        var leaf = manudata.substring(6, 8) + manudata.substring(4, 6);
        console.log('    Temperature Raw Data = '+parseInt(leaf,16));
        leaf = manudata.substring(10, 12) + manudata.substring(8, 10);
        console.log('    Temperature = '+(parseInt(leaf,16)/100));
    };
  }

  if (serviceData) {
    console.log('  Service Data      = ' + serviceData);
  }

  if (localName) {
    console.log('  Service UUIDs     = ' + serviceUuids);
  }

  if (rssi) {
    console.log('  RSSI     = ' + rssi);
  }
}
