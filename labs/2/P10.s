main:
	@ following commands move/store the decimal values into the respective registers
	mov		r2, #1
	mov		r3, #2
	mov		r4, #3
	mov		r5, #4
	mov		r6, #5
	mov		r7, #6
	bl		P10			@ branch with link to procedure named P10
	swi		0x11		@ end the program execution

@ procedure named "P09", same as the previous exercise, code explained there
P09:
	stmfd	sp!, {r4-r7, lr}
	adds	r9, r5, r7
	adc		r8, r4, r6
	ldmfd	sp!, {r4-r7, pc}
	bx		lr

P10:							@ procedure named "P10", starts with immediate execution
	mov		r0, lr				@ store the current value of lr in register r0 for later use
	stmfd	sp!, {r2-r7, lr}	@ push the arguments (list of specified registers) in the stack
	mov		r1, r5				@ copy the value in r5 to r1
	mov		r5, r4				@ copy the value in r4 to r5
	mov		r4, r3				@ copy the value in r3 to r4
	bl		P09					@ branch with link to procedure named P09
	mov		r10, r9				@ copy the value in r9 to r10
	mov		r9, r8				@ copy the value in r8 to r9
	adc		r8, r2, r1			@ add values in r2, r1 along with carry from previous addition and store in r8
	ldmfd	sp!, {r2-r7, pc}	@ pop the arguments from the stack into the mentioned registers
	bx		r0					@ branch back to the main procedure
