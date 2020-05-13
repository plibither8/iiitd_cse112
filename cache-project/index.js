const crypto = require('crypto');
const readline = require('readline-sync');
const { table } = require('table');
const { log2 } = Math;

// constant declared after user input
const WORD_SIZE = Number(readline.question('Word size: ')); // 32 for a 32-bit architecture
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
const generateBlockAddress = () => {
	const rand32BitInt = crypto.randomBytes(WORD_SIZE / 8).readUInt32BE(0);
	const binary32Bit = rand32BitInt
		.toString(2)
		.padStart(32, '0')
		.substr(0, 26);
	return parseInt(binary32Bit, 2);
}

// get a block address' index and tag
const getAddressParts = address => ({
	index: (address % SET_COUNT) * WAYS,
	tag: address >> LOG_2.setCount
});

// get the set from index to index + WAYS
const getSet = (index, arr) => ARRAYS[arr].slice(index, index + WAYS);

// check whether the set is full
const isSetFull = index => !getSet(index, 'tag').includes(undefined);

// return hexadecimal string of base 10 address
const hexa = address => '0x' + address.toString(16);

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

// list of operations on the cache
const operations = {
	// insert data into cache at address (optional)
	insert: (data, address) => {
		// either specified address or generate random
		const blockAddress = address || generateBlockAddress();
		const { tag, index } = getAddressParts(blockAddress); // get tag and index

		console.log(`Inserting ${data} at block address ${hexa(blockAddress)}, index = ${index}`);

		let targetLine;

		// check whether index is full
		if (isSetFull(index)) {
			console.log(`Set at index ${index} is full, finding replacement candidate...`)

			// find replacement candidate
			const replacementCandidateLine = getReplacementCandidate(index);
			console.log(`Replacing tag ${hexa(ARRAYS.tag[replacementCandidateLine])} at line ${replacementCandidateLine}`)

			operations.evict(replacementCandidateLine); // evict block from cache
		}

		// loop through set to find empty slot
		for (targetLine = index; targetLine < index + WAYS; targetLine++) {
			if (ARRAYS.tag[targetLine] === undefined) {
				break;
			}
		}

		ARRAYS.tag[targetLine] = tag; // set tag
		ARRAYS.data[targetLine] = {
			data, 				// set data
			time: Date.now() 	// timestamp for LRU replacement
		}

		console.log(`${data} @ ${hexa(blockAddress)} inserted!\n`)
	},

	// evict by marking slots as undefined
	evict: index => {
		ARRAYS.tag[index] = undefined;
		ARRAYS.data[index] = undefined;
	},

	// read data from address
	read: address => {
		const targetLine = getLineInCache(address);

		// if cache of block is not present, cache miss!
		if (!targetLine) {
			console.log(`CACHE MISS, address ${hexa(address)} not found!\n`);
			return;
		}

		// print data
		console.log(`Data @ ${address} = ${ARRAYS.data[targetLine].data}\n`);
	},

	// update data at line so and so
	update: (data, line) => {
		console.log(`Updating data on line ${line} of cache to ${data}\n`);
		ARRAYS.data[line] = {
			data,
			time: Date.now()
		};
	},

	// write data to address
	write: (data, address) => {
		const targetLine = getLineInCache(address);

		// if cache of block is not present, cache miss!
		if (!targetLine) {
			console.log(`CACHE MISS, address ${hexa(address)} not found!`);
			operations.insert(data, address);
			return;
		}

		console.log(`CACHE HIT @ ${hexa(address)}!`);
		operations.update(data, targetLine); // cache hit, update data
	},

	// print table of cache with the following headings
	display: () => {
		const tableData = [
			['Address', 'Tag', 'Index', 'Line', 'Data']
		];

		ARRAYS.tag.forEach((tag, line) => {
			if (tag !== undefined) {
				const index = Math.floor(line / WAYS) * WAYS;
				// back calculate the address using tag and line (super hacky i think)
				const address = (tag << LOG_2.setCount) + Math.floor(line / WAYS);
				const data = ARRAYS.data[line].data;

				tableData.push([
					hexa(address),
					tag,
					index,
					line,
					data
				])
			}
		});

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
