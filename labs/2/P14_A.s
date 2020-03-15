main:
    mov     r1, #0xdb
    mov     r0, #0
    mov     r3, #0
    mov     r4, #0
    b       loop

loop:
    and     r2, r1, #1
    cmp     r2, #1
    bleq    loop1
    mov     r4, r2
    lsr     r1, r1, #1
    add     r3, r3, #1
    cmp     r3, #32
    ble     loop
    swi     0x11

loop1:
    cmp     r4, #0
    beq     loop2
    bx      lr

loop2:
    add     r0, r0, #1
    bx      lr
