		mov		r2, #1
		mov		r4, #0
		mov		r1, #69
loop
		and		r3, r1, #1
		cmp		r3, #1
		addeq	r4, r4, #1
		mov		r1, r1, lsr #1
		add		r2, r2, #1
		cmp		r2, #32
		ble		loop
