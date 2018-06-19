module num_7seg_D(out, w, x, y, z);
    input wire w, x, y, z;
    output wire out;

    assign out = (x & ~y) | (~x & y) | (y & ~z) | w;
endmodule
