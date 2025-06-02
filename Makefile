CXX = g++
CC = gcc

CXXFLAGS = -std=c++17 -Wall -I/opt/homebrew/include -I.
CFLAGS = -Wall -I/opt/homebrew/include -I.

TARGET = generate_test_packet
OBJS = generate_test_packet.o crc32.o

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CXX) $(OBJS) -o $@

generate_test_packet.o: generate_test_packet.cc
	$(CXX) $(CXXFLAGS) -c $<

crc32.o: crc32.c
	$(CC) $(CFLAGS) -c $<

clean:
	rm -f $(TARGET) *.o
