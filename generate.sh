#!/bin/bash
mkdir -p fixtures
for i in {1..5}; do
  ./generate_test_packet > /dev/null
  mv ack_packet.bin fixtures/ack_packet_$i.bin
  echo "✔ Generated: fixtures/ack_packet_$i.bin"
done

# Make sure generate_test_packet is built and executable
# g++ generate_test_packet.cc -o generate_test_packet \
#   -I./flatbuffers/include \
#   -I. \
#   crc32.c