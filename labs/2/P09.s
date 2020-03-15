main:
	mov		r4, #3		@ set decimal value 3 to register r4
	mov		r5, #4		@ set decimal value 4 to register r5
	mov		r6, #5		@ set decimal value 5 to register r6
	mov		r7, #6		@ set decimal value 6 to register r7
	bl		P09			@ branch (with link) to procedure with label "P09"
	swi		0x11		@ end the program execution

P09: 					@ define new procedure with name "P09"
	adds	r9, r5, r7 	@ add values in registers r5 and r7, and store in register r9, and updates respective flags
	adc		r8, r4, r6 	@ add values in registers r4 and r6 and the carry from the previous addition, and store in register r8
	bx		lr 			@ branch to line number stored in the link register
