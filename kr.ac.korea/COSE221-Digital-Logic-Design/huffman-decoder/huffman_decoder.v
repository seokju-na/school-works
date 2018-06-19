module huffman_decoder(
    output reg [2:0] y,
    input x,
    input clk,
    input reset
);

reg [2:0] state;

// States
parameter S0 = 3'b000;
parameter S1 = 3'b001;
parameter S2 = 3'b010;
parameter S3 = 3'b011;
parameter S4 = 3'b100;

// Output values
parameter NULL = 3'b000;
parameter A = 3'b001;
parameter B = 3'b010;
parameter C = 3'b011;
parameter D = 3'b100;
parameter E = 3'b101;
parameter F = 3'b110;

// FSM Diagram
// (Current State: Input/Output -> Next State)
//
// S0: 0/A -> S0
// S0: 1/NULL -> S1
// S1: 0/NULL -> S2
// S1: 1/NULL -> S3
// S2: 0/C -> S0
// S2: 1/B -> S0
// S3: 0/NULL -> S4
// S3: 1/D -> S0
// S4: 0/F -> S0
// S4: 1/E -> S0

always @ (posedge clk or posedge reset) begin
    if (reset) begin
        state <= S0;
        assign y = NULL;
    end
    else begin case (state)
        S0: if (x) begin
                assign y = NULL;
                state <= S1;
            end
            else begin
                assign y = A;
                state <= S0;
            end

        S1: if (x) begin
                assign y = NULL;
                state <= S3;
            end
            else begin
                assign y = NULL;
                state <= S2;
            end

        S2: if (x) begin
                assign y = B;
                state <= S0;
            end
            else begin
                assign y = C;
                state <= S0;
            end

        S3: if (x) begin
                assign y = D;
                state <= S0;
            end
            else begin
                assign y = NULL;
                state <= S4;
            end

        S4: if (x) begin
                assign y = E;
                state <= S0;
            end
            else begin
                assign y = F;
                state <= S0;
            end
    endcase
    end
end

endmodule
