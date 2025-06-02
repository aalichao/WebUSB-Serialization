const fs = require('fs');
const flatbuffers = require('flatbuffers');
const { UsbPacket } = require('./generated/usb_data');
const { calcCrc32 } = require('./crc32');

class FakeDevice {
  constructor(log = console.log) {
    this.log = log;
    this.packetPath = './ack_packet.bin';
  }

  async transferIn() {
    const raw = fs.readFileSync(this.packetPath);
    const buf = new Uint8Array(raw);
    const payload = buf.subarray(0, buf.length - 4);
    const receivedCrc = new DataView(buf.buffer).getUint32(buf.length - 4, true);
    const computedCrc = calcCrc32(payload);

    console.log("JS checking CRC for:", this.packetPath);

    console.log("CRC from packet (C++):", "0x" + receivedCrc.toString(16));
    console.log("CRC computed in JS:   ", "0x" + computedCrc.toString(16));

    if (computedCrc !== receivedCrc) {
      throw new Error('CRC check failed');
    }

    return { data: new DataView(buf.buffer) };
  }

  async transferOut(endpoint, data) {
    this.log(`[FakeDevice] Received OUT packet of ${data.length} bytes`);
  }

  async open() {}
  async selectConfiguration() {}
  async claimInterface() {}
}

module.exports = { FakeDevice };