# Airdrop-Armor

## Securing Airdrops Using Merkle-Tree Approach

# Merkle Airdrop Project

## Overview

The Merkle Airdrop Project is a Solidity based decentralized application that utilizes a Merkle Tree structure to facilitate efficient and secure airdrops of tokens to a large number of addresses. The project employs OpenZeppelin's MerkleProof library for the airdrop mechanism.

The project involves three primary smart contracts:

1. **Token.sol**: An ERC20 implementation for creating our own token.
2. **EthSwap.sol**: A contract that simulates a token exchange where users can buy tokens.
3. **AirDrop.sol**: A contract implementing the airdrop mechanism with the use of Merkle Proofs.

The project also includes a deployment script and a test suite to automate the process of contract deployment and verification of their functionality.

## Contracts

### Token.sol

This contract represents a basic implementation of the ERC20 standard. It mints a predetermined amount of tokens to the address deploying the contract. These tokens are subsequently available for purchase via the EthSwap contract.

### EthSwap.sol

EthSwap is a simple contract representing a token swap. Users can buy tokens by sending ETH to the contract. The contract emits an event, `TokensPurchased`, recording the buyer's address.

### AirDrop.sol

The AirDrop contract forms the crux of the Merkle Airdrop mechanism. During initialization, it accepts a Merkle root (which represents a set of addresses eligible for the airdrop) and a reward amount. Users can call the `claim` function along with a Merkle proof to claim their airdrop reward. The contract verifies the validity of the proof and the fact that the reward has not been claimed before, then sends the token to the claimant's address.

## Deployment Script

The `scripts/deploy.js` script manages the deployment of the contract. It fetches the contract factory, deploys the contracts, and logs the address where the contract has been deployed. This script leverages the Hardhat runtime environment and the ethers.js library.

## Testing

The `test/airdrop.js` file includes the test suite for this project. 

It commences by simulating a situation where multiple addresses buy tokens in a random sequence. This is followed by fetching all token purchase events, forming a Merkle Tree using the addresses of eligible users (those who interacted before a certain block), and deploying the AirDrop contract with the root of the tree.

The test then confirms that only eligible accounts can claim the airdrop, checks that the correct amount of tokens are received, and ensures that users can't claim the airdrop more than once.

The Merkle Tree and proofs are formed using the `merkletreejs` and `keccak256` libraries, respectively.

## Running the Project

Before running the project, ensure the presence of Node.js, Hardhat, ethers.js, and @openzeppelin/contracts.

1. Compile the contracts using Hardhat: `npx hardhat compile`
2. Run the deployment script: `npx hardhat run scripts/deploy.js --network localhost`
3. Run the tests: `npx hardhat test`

If all setups are correctly done, the tests should pass, indicating that the airdrop mechanism works as expected.

Remember to update the network configurations in the `hardhat.config.js` file as per your requirements (like when deploying to a testnet or mainnet).

## Conclusion

This project displays the use of Merkle Trees for efficient, secure airdrops in a decentralized application. The implementation ensures that only eligible users can claim their airdrop and double-claims are prevented. Tests ensure the implementation's validity and simulate a realistic usage scenario.
