main:
		mov		r2, #5
		mov		r3, #6
		mov		r4, #7
		mov		r5, #8
		mov 		r6, #9
		mov		r7, #10
		bl			P10
		swi 		0x11

P10:
		mov		r1, lr
		mov		r11, r4
		mov		r12, r7
		bl			P09
		mov		r10, r0
		mov		r11, r3
		mov		r12, r6
		bl			P09
		mov		r9, r0
		mov 		r11, r2
		mov 		r12, r5
		bl 			P09
		mov 		r8, r0
		bx 		r1
		
P09:
		adc		r0, r11, r12
		bx 		lr