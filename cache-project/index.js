const crypto = require('crypto');
const readline = require('readline-sync');
const { table } = require('table');
const { log2 } = Math;

console.log(`Select number system:
  1. Hexadecimal
  2. Binary
  3. Decimal
`);
const NUMBER_BASE = Number(readline.question('Enter choice: '));

// constant declared after user input
const WORD_SIZE = Number(readline.question('\nWord size: ')); // 32 for a 32-bit architecture
const CACHE_SIZE = Number(readline.question('Cache size (KB): ')) * 2**10; //
const BLOCK_SIZE = Number(readline.question('Block size (Bytes): '));

// choosing cache policy
console.log(`
Choose cache policy:
  1. Fully associative
  2. Direct mapped
  3. Set-associative
`);

let WAYS;
switch(Number(readline.question('Enter choice: '))) {
	case 1:
		// fully-associative is also C/B-ways set associative
		WAYS = CACHE_SIZE / BLOCK_SIZE;
		break;
	case 2:
		// direct mapped is also 1-way set associative
		WAYS = 1;
		break;
	case 3:
	default:
		// normal n-way set associative
		WAYS = Number(readline.question('No. of ways: '));
}

// derived values:
const CACHE_LINES	= CACHE_SIZE / BLOCK_SIZE;
const SET_COUNT		= CACHE_LINES / WAYS;
const TOTAL_CELLS	= CACHE_LINES / BLOCK_SIZE * 8;

// holds log 2 values of some quantities
const LOG_2 = {
	cacheSize: log2(CACHE_SIZE),
	blockSize: log2(BLOCK_SIZE),
	ways: log2(WAYS),
	setCount: log2(SET_COUNT)
};

// main tag array and data array
const ARRAYS = {
	tag: Array(CACHE_LINES),
	data: Array(CACHE_LINES)
};

// randomly generate block address when requested
const generateCellAddress = () => {
	const randomInt = crypto.randomBytes(WORD_SIZE / 8).readUIntBE(0, WORD_SIZE / 8);
	const binaryBits = randomInt
		.toString(2)
		.substr(0, WORD_SIZE - 1)
		.padStart(WORD_SIZE, '0');
	return parseInt(binaryBits, 2);
}

// get a block address' index and tag
const getAddressParts = address => ({
	block: address >> LOG_2.blockSize,
	tag: address >> (LOG_2.setCount + LOG_2.blockSize),
	index: ((address >> LOG_2.blockSize) % SET_COUNT) * WAYS,
	offset: address % BLOCK_SIZE
});

// get the set from index to index + WAYS
const getSet = (index, arr) => ARRAYS[arr].slice(index, index + WAYS);

// check whether the set is full
const isSetFull = index => !getSet(index, 'tag').includes(undefined);

// return numberFormatdecimal string of base 10 address
const numberFormat = address => {
	switch(NUMBER_BASE) {
		case 1: return '0x' + address.toString(16);
		case 2: return address.toString(2);
		case 3: default: return address;
	}
};

// return the line in cache of the address, otherwise undefined
const getLineInCache = address => {
	const {tag, index} = getAddressParts(address);

	const set = getSet(index, 'tag');
	const targetLine = set.indexOf(tag);

	if (targetLine === -1) {
		return undefined;
	}

	return index + targetLine;
}

// return the line of a suitable replacement candidate
// following the LRU scheme
const getReplacementCandidate = index => {
	const set = getSet(index, 'data');

	let replacementCandidateLine = 0;
	set.forEach((data, i) => {
		if (data.time < set[replacementCandidateLine].time) {
			replacementCandidateLine = i;
		}
	});

	return index + replacementCandidateLine;
}

const stringify = data => {
	const bytes = [];
	let currentEmptySlots = 0;

	for (let i = 0; i < data.length; i++) {
		const byte = data[i];

		if (byte === undefined) {
			currentEmptySlots++;
			continue;
		}

		if (currentEmptySlots !== 0) {
			bytes.push(`<${currentEmptySlots} bytes>`);
		}

		currentEmptySlots = 0;
		bytes.push(byte);
	}

	if (currentEmptySlots !== 0) {
		bytes.push(`<${currentEmptySlots} bytes>`);
	}

	return bytes.join(', ');
}

// list of operations on the cache
const operations = {
	// insert data into cache at address (optional)
	insert: (data, address) => {
		// either specified address or generate random
		const cellAddress = address || generateCellAddress();
		const { tag, index, offset, block: blockAddress } = getAddressParts(cellAddress); // get tag and index

		console.log(`\nInserting ${data} at block of address ${numberFormat(cellAddress)}, index = ${index}`);

		// check whether index is full
		if (isSetFull(index)) {
			console.log(`\nSet at index ${index} is full, finding replacement candidate...`)

			// find replacement candidate
			const replacementCandidateLine = getReplacementCandidate(index);
			console.log(`\nReplacing tag ${numberFormat(ARRAYS.tag[replacementCandidateLine])} at line ${replacementCandidateLine}`)

			operations.evict(replacementCandidateLine); // evict block from cache
		}

		let targetLine;
		let block = Array(BLOCK_SIZE);

		// loop through set to find empty slot
		for (targetLine = index; targetLine < index + WAYS; targetLine++) {
			if (ARRAYS.tag[targetLine] === undefined) {
				break;
			}
			if (ARRAYS.data[targetLine].address === blockAddress) {
				block = ARRAYS.data[targetLine].block;
				break;
			}
		}

		block[offset] = data;

		ARRAYS.tag[targetLine] = tag; // set tag
		ARRAYS.data[targetLine] = {
			address: blockAddress,
			block, 				// set data
			time: Date.now() 	// timestamp for LRU replacement
		}

		console.log(`${data} @ ${numberFormat(cellAddress)} inserted!\n`)
	},

	// evict by marking slots as undefined
	evict: index => {
		ARRAYS.tag[index] = undefined;
		ARRAYS.data[index] = undefined;
	},

	// read data from address
	read: address => {
		const targetLine = getLineInCache(address);
		const { offset } = getAddressParts(address);

		// if cache of block is not present, cache miss!
		if (!targetLine) {
			console.log(`\nCACHE MISS, address ${numberFormat(address)} not found!\n`);
			return;
		}

		ARRAYS.data[targetLine].time = Date.now();

		// print data
		console.log(`\nData @ ${address} = ${ARRAYS.data[targetLine].block[offset]}\n`);
	},

	// update data at line so and so
	update: (data, line, address) => {
		console.log(`\Updating data at address ${numberFormat(address)} of cache to ${data}\n`);

		const { offset } = getAddressParts(address);
		ARRAYS.data[line].block[offset] = data;
		ARRAYS.data[line].time = Date.now();
	},

	// write data to address
	write: (data, address) => {
		const targetLine = getLineInCache(address);

		// if cache of block is not present, cache miss!
		if (!targetLine) {
			console.log(`\nCACHE MISS, address ${numberFormat(address)} not found!`);
			operations.insert(data, address);
			return;
		}

		console.log(`\nCACHE HIT @ ${numberFormat(address)}!`);
		operations.update(data, targetLine, address); // cache hit, update data
	},

	// print table of cache with the following headings
	display: () => {
		const tableData = [
			['Block address', 'Tag', 'Index', 'Line', 'Block data']
		];

		ARRAYS.tag.forEach((tag, line) => {
			if (tag !== undefined) {
				const index = Math.floor(line / WAYS) * WAYS;
				// back calculate the address using tag and line (super hacky i think)
				const address = ARRAYS.data[line].address;
				const data = stringify(ARRAYS.data[line].block);

				tableData.push([
					numberFormat(address),
					numberFormat(tag),
					index,
					line,
					data
				])
			}
		});

		console.log();
		console.log(table(tableData));
	}
}

// finally, main operation selection
const main = () => {
	while (true) {
		console.log(`
Select operation:
  1. Read from address
  2. Write to address
  3. Insert into cache (random address)
  4. Display cache
  5. Exit
`);
		switch (Number(readline.question('Enter choice: '))) {
			case 1: {
				const address = parseInt(readline.question('Enter address (hexa): '), 16);
				operations.read(address);
				break;
			}

			case 2: {
				const address = parseInt(readline.question('Enter address (hexa): '), 16);
				const data = Number(readline.question('Enter data: '));
				operations.write(data, address);
				break;
			}

			case 3: {
				const data = Number(readline.question('Enter data: '));
				operations.insert(data);
				break;
			}

			case 4: {
				operations.display();
				break;
			}

			case 5:
			default:
				process.exit(0);
				break;
		}
	}
}

// run it!
main();
