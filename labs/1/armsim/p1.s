mov r3, #12
mov r2, #0
mov r0, #0x00001000

.initialise:
	str r3, [r0, r2, lsl #2]
	add r3, r3, #4
	add r2, r2, #1
	cmp r2, #3
	bne .initialise

	mov r1, #0
	mov r2, #0

.arraySum:
	ldr r3, [r0, r2, lsl #2]
	add r1, r1, r3
	add r2, r2, #1
	cmp r2, #3
	bne .arraySum

mov r0, #1
swi 0x6b
swi 0x11
