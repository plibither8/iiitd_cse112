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

## Usage instructions

* This project has been written in JavaScript (Node.js).
* Node.js and npm are required to be installed in your system to run this.
* Once installed, `cd` into the projects directory.
* Run `npm install` to install dependancies.
* Run `node index` to finally run the program.

## Documentation

### User inputs

#### Cache specifications

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
