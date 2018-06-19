#/usr/env/bin bash

iverilog -o h3.out huff_main.v huffman_decoder.v
vvp h3.out
