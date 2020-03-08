mov r4, #36
mov r5, #6
mov r6, #48
mov r7, #9

P09:
	subs r8, r4, r6
	bcc loop1
	bcs loop2

loop1:
	sub r9, r5, r7

loop2:
	subs r9, r5, r7
	bcc cloop
	sbc r8, r8, #0

cloop:
	add r9, r9, #16
