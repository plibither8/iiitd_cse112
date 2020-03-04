
mov a1, #11
mov a2, #22
mov a3, #33

bl P

P:
	add r4, r0, r1
	mul r4, r4, r2

	mov r0, #1
	mov r1, r4
	swi 0x6b
	swi 0x11
