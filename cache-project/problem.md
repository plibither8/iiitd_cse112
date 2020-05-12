# n-Way Cache Simulator

## Problem Text

A cache of size S with CL as the number of cache lines and block size B is to be built. S, CL, and B are in powers of 2. Write a program that allows loading into cache and searching cache using:

* Direct mapping
* Associative memory
* n-way set associative memory where n is a power of 2.

Any programming language (of your choice) can be used.

### Additional points

* Inputs: S, CL, B, n
  * For Read: Address
  * Write: Address, Data

* Addressing will be mapping dependent.

* Output: we can print the entire cache structure.
  * On which location which data is present.
  * The mechanism to read/write operation also should be according to cache.

* The cache is of one level only.
* The word length of the machine may be assumed to be 32 bits. However, if you have assumed 16 or 64 bits then you may state in the documentation. 8-bit machine is not allowed.
* As for main memory, you may take it of size N, a power of 2, if you need it.
* There is no need to MAINTAIN a main memory. You just need cache and in case of misses or any replacement, just print the address of the line/block.
  * In case of miss: "address not found"
  * In case of replacement: address by which the block will be replaced
