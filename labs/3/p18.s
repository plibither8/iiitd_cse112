.begin:								/* Preamble */
	mloadIR
	mdecode
	madd pc, 4
	mswitch

mmovi	regSrc, 1, <read>			/* Assuming no. of bit is stored in r1 */
mmov	sr2, regValue				/* sr2 = no. of bits */
madd	sr2, -1						/* sr2 = no. of bits - 1 */

mmovi	regSrc, 2, <read>			/* Read value in r2 */
mmovi	sr1, 0						/* Initialise loop variable to 0 */

.loop:
	mmov	A, regVal				/* A = regVal */
	mmov	B, sr1, <lsr>			/* B = i; aluResult = lsr A B */

	mmov	A, aluResult			/* Store the prev. aluResult in A */
	mmov	B, 1, <and>				/* Perform AND with 1 to get LSB */
	mmov	sr3, aluResult			/* Store LSB in sr3 -- (i+1)th bit from right */

	mmov	A, regVal				/* A = regVal */
	mmov	B, sr2, <lsr>			/* B = sr2; aluResult = lsr A B */

	mmov	A, aluResult			/* Store the prev. aluResult in A */
	mmov	B, 1, <and>				/* Perform AND operation to get LSB */

	mmov	A, sr3					/* Store sr3 value in A (the i+1th digit) */
	mmov	B, aluResult, <cmp>		/* B = i+1th digit from left; Are they equal? */

	mbeq	flags.E, 0, .failure	/* If they aren't, branch to .failure */

	mmov	A, sr1					/* A = loop varaible sr1 */
	mmov	B, sr2, <cmp>			/* B = loop varaible sr2; Is A == B? */
	mbeq	flags.E, 1, .success	/* If they are then all digits checked: success! */

	madd	sr1, 1					/* Increment sr1 = i+1; i++ */
	madd	sr2, -1					/* Increment sr2 = i-1; i-- */
	mb		.loop					/* Branch back to loop */

.success:
	mmovi	regSrc, 0
	mmov	regData, 1, <write>		/* Set r0 to 1, since it is a perfect square */
	mb		.begin					/* Branch to preamble */

.failure:
	mmovi regSrc, 0
	mmov	regData, 0, <write>		/* Else set to 0 */
	mb		.begin					/* Branch to preamble */
