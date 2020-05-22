# n-Way Cache Simulator

|                 |                       |
|-----------------|-----------------------|
| **Course**      | Computer Organisation |
| **Course Code** | CSE112                |
| **Name**        | Mihir Chaturvedi      |
| **Roll number** | 2019061               |
| **Branch**      | CSE                   |
| **Section**     | A                     |
| **Group**       | 5                     |

## About

This is a simple implementation of a **standalone L1 cache**. No "main memory" is maintained in this implementation. Values are written directly, and only, to the cache structure, and read from them only. If an address for a read query is not found in the cache, the program simple informs of a _cache miss_ (and does not fetch from any _lower_ levels, because there are none.).

## Usage instructions

For simplicity sake, you can **view and run the program here: [https://go.mihir.ch/cache](https://go.mihir.ch/cache)**.

* This project has been written in JavaScript (Node.js).
* Node.js and npm are required to be installed in your system to run this.
* Once installed, `cd` into the projects directory.
* Run `npm install` to install dependancies.
* Run `node index` to finally run the program.

## Documentation

### User inputs

#### Cache specifications

* **Number system**, the base/radix in which you want memory addresses to be displayed
  * Hexadecimal
  * Binary
  * Decimal
* **Word size**, typically 32-bits, or 64-bits
* **Cache size**, in kilobytes, for example, **8** KB
* **Block size**, in bytes, for example, **64** bytes
* **Cache policy**,
  * Fully associative
  * Direct mapped
  * Set associative
    * **Number of ways**, for example, 4 for 4-way set associativity

#### Operations

After prompting the user for cache specification inputs, they will be repeatedly presented with operations to run on the cache, including:

1. **Read**: Read data stored at (inputted) address.
2. **Write**: Write (inputted) data to (inputted) address. If there is a cache hit, the data at specified block address will be updated, and so will it's timestamp. If there is a cache miss, a block will be inserted into the cache at the specified address.
3. **Insert**: Insert (inputted) data into cache at a randomised (generated) block address.
4. **Display**: Display contents of the non-empty lines of the cache in a tabular layout with headings: Address, Tag, Index, Line, Data
5. **Exit**: Exit the program

### Ouputs

After each selected operation, the program will notify you of what address the data has been read from or written to (in your selected number base).

An example output for operation 4: _display_, is:

```txt
╔═══════════════╤═════════╤═══════╤══════╤════════════════════════════════╗
║ Block address │ Tag     │ Index │ Line │ Block data                     ║
╟───────────────┼─────────┼───────┼──────┼────────────────────────────────╢
║ 0x1720ce8     │ 0xb9067 │ 32    │ 32   │ <52 bytes>, 50, 30, <10 bytes> ║
╟───────────────┼─────────┼───────┼──────┼────────────────────────────────╢
║ 0x197013c     │ 0xcb809 │ 112   │ 112  │ <62 bytes>, 10, <1 bytes>      ║
╟───────────────┼─────────┼───────┼──────┼────────────────────────────────╢
║ 0x1da02de     │ 0xed016 │ 120   │ 120  │ <53 bytes>, 20, <10 bytes>     ║
╚═══════════════╧═════════╧═══════╧══════╧════════════════════════════════╝
```
