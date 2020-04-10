.begin:
	mloadIR
	mdecode
	madd pc, 4
	mswitch

mmovi regSrc, 2, <read>
mmovi sr1, 1

.loop:
	mmov A, sr1
	mmov B, A, <mulitply>

	mmov A, aluResult
	mmov B, regVal, <cmp>

	mbeq flags.E, 1, .success
	mbeq flags.G, 1, .failure

	madd sr1, 1
	mb .loop

.success:
	mmovi regSrc, 3
	mmov regData, 1, <write>
	mb .begin

.failure:
	mmovi regSrc, 3
	mmov regData, 0, <write>
	mb .begin
