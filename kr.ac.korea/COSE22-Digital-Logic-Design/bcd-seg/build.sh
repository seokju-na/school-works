#/usr/env/bin bash

iverilog -o h1.out h1main.v num_7seg_D.v
vvp h1.out
