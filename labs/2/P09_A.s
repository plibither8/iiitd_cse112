main:
		mov		r4, #5
		mov		r5, #6
		mov		r6, #7
		mov		r7, #8
		mov		r11, r5
		mov		r12, r7
		bl		P09
		mov		r9, r0
		mov		r11, r4
		mov		r12, r6
		bl		P09
		mov		r8, r0
		swi		0x11
P09:
		adc		r0, r11, r12
		bx lr