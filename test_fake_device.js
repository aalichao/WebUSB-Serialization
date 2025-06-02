const { FakeDevice } = require('./fake_device');
const flatbuffers = require('flatbuffers');
const { UsbPacket } = require('./generated/usb_data');

(async () => {
  const device = new FakeDevice(console.log);
  await device.open();
  await device.selectConfiguration();
  await device.claimInterface();

  const result = await device.transferIn();
  const data = new Uint8Array(result.data.buffer);
  const payload = data.slice(0, data.length - 4);
  const bb = new flatbuffers.ByteBuffer(payload);
  const pkt = UsbPacket.getRootAsUsbPacket(bb);

  console.log('Decoded packet:');
  console.log('Type:', pkt.type());
  console.log('Platform:', pkt.platform());
  console.log('Sequence:', pkt.sequence());
  console.log('Data:', [...Array(pkt.dataLength()).keys()].map(i => pkt.data(i)));
})();