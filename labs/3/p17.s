.begin:								/* Preamble */
	mloadIR
	mdecode
	madd pc, 4
	mswitch

mmovi	regSrc, 2, <read>			/* Read value in r2 */
mmovi	sr1, 1						/* Initialise loop variable to 1 */

.loop:
	mmov	A, sr1					/* A = i */
	mmov	B, A, <mulitply>		/* B = i, aluResult = A*B = i^2 */

	mmov	A, aluResult			/* Store i^2 in A again */
	mmov	B, regVal, <cmp>		/* Compare i^2 with required no. */

	mbeq	flags.E, 1, .success	/* If equal, branch to .success */
	mbeq	flags.G, 1, .failure	/* If i^2 > regVal, it is not a perfect square */

	madd 	sr1, 1					/* Increment i: i++ */
	mb		.loop					/* Branch to loop again */

.success:
	mmovi	regSrc, 0
	mmov	regData, 1, <write>		/* Set r0 to 1, since it is a perfect square */
	mb		.begin					/* Branch to preamble */

.failure:
	mmovi	regSrc, 0
	mmov	regData, 0, <write>		/* Else set to 0 */
	mb		.begin					/* Branch to preamble */
