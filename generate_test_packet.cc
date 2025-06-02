#include "usb_data_generated.h"
#include "crc32.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    flatbuffers::FlatBufferBuilder builder(1024);
    uint8_t sample_data[] = {1, 2, 3, 4};

    auto data_vec = builder.CreateVector(sample_data, sizeof(sample_data));
    auto pkt = CreateUsbPacket(builder, UsbDataType_AUDIO_DATA, 2, 42, data_vec);
    builder.Finish(pkt);

    uint8_t *buf = builder.GetBufferPointer();
    size_t size = builder.GetSize();
    uint32_t crc = CalcCrc32(0xFFFFFFFF, size, buf);

    FILE *file = fopen("ack_packet.bin", "wb");
    if (!file) {
        perror("Failed to open file");
        return 1;
    }
    fwrite(buf, 1, size, file);
    fwrite(&crc, 1, 4, file);
    fclose(file);
    printf("Test packet written to ack_packet.bin (%zu bytes + CRC)\n", size);

    printf("Payload size: %zu\n", size);
    printf("CRC32 (hex): 0x%08X\n", crc);

    return 0;
}