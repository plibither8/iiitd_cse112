main:
	mov		r1, #0xdb	@ Main number for which groups of 1's have to be calculated
	mov		r0, #0		@ Loop variable
	mov		r2, #0		@ Stores the number of 1's
	mov		r4, #0		@ Stores previous digit of number
	b		P14		@ Branch directly to loop
	swi		0x11		@ Exit the program

check2:
	add		r2, r2, #1	@ A new group of "1" is starting, so increment group counter
	bx		lr			@ Go back to the loop @ lr

check1:
	cmp		r4, #0		@ Check if the previous digit value was 0
	beq		check2		@ If it is, branch to the second check
	bx		lr			@ Otherwise, go back to the loop @ lr

P14:
	and		r3, r1, #1	@ Store the right-most digit of the binary rep. in `r3`
	lsr		r1, r1, #1	@ Right-shift the binary rep. for the next loop iteration
	cmp		r3, #1		@ Check whether it is a "1" or not
	bleq	check1		@ If it is, branch to the first check
	mov		r4, r3		@ Store the current r3 value in r4 for later possible use
	add		r0, r0, #1	@ Increment the loop variable
	cmp		r0, #32		@ Check whether the loop has run 32 times (number of digits)
	ble		loop		@ If <= 32, loop!
