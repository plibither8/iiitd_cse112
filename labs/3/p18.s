.begin:
	mloadIR
	mdecode
	madd pc, 4
	mswitch

mmovi regSrc, 2, <read>
mmovi sr1, 0

.loop:
	mmov A, regVal
	mmov B, sr1, <lsr>

	mmov A, aluResult
	mmov B, 1, <and>
	mmov sr2, aluResult

	mmov A, 7
	mmov B, sr1, <sub>

	mmov A, regVal
	mmov B, aluResult, <lsr>

	mmov A, aluResult
	mmov B, 1, <and>

	mmov A, sr2
	mmov B, aluResult, <cmp>

	mbeq flags.E, 0, .failure
	mbeq sr1, 3, .success

	madd, sr1, 1
	mb .loop

.success:
	mmovi regSrc, 3
	mmov regData, 1, <write>
	mb .begin

.failure:
	mmovi regSrc, 3
	mmov regData, 0, <write>
	mb .begin
