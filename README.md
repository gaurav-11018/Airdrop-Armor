# SybilAirdrop
A smart contract on the Polygon network that facilitates Sybil-resistant airdrops using POLYGON ID and zero-knowledge proofs.

## Installation
This project requires Node.js v12+ and npm v5+ to run.


## Smart Contract
The SybilAirdrop.sol contract includes the following functionality:

Set the amount of tokens to distribute per address
Set the maximum number of addresses to receive airdrop
Set the maximum amount of tokens to distribute in total
Withdraw tokens from the contract
Claim airdrop using a zero-knowledge proof
The smart contract implements the Ownable contract from OpenZeppelin for ownership functionality. It also includes the following libraries from OpenZeppelin:

IERC20.sol: interface for ERC20 token functionality
SafeERC20.sol: library for safe token transfers
ECDSA.sol: library for Elliptic Curve Digital Signature Algorithm (ECDSA) functionality
SafeMath.sol: library for safe mathematical operations
Zero-Knowledge Proof
The zero-knowledge proof is implemented in the zkp directory and consists of the following files:

circuit.circom: the arithmetic circuit that the prover will generate a proof for
prover.js: the prover that generates the zero-knowledge proof
verifier.sol: the verifier that verifies the zero-knowledge proof
The zero-knowledge proof generates a proof that the user owns a unique and valid identity on the Polygon network, which ensures that each address is valid and unique.

## Deployment
The smart contract is deployed on the Mumbai testnet using Remix with the following configuration:

ERC20 token: USDC (0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e)
Amount per address: 1000
Maximum addresses: 10
Maximum amount: 10000
ZKP verifier: (0xdD6596cA1f2fae8E8DD1C9a7C45DdFc18d2318e1)
ZKP request ID: 1
The deployed contract can be found at the following address:

Copy code
0x3E3D8B39CB2eaf71FB051D1C0123d4A4C546FE63
Screenshots
Home
Home

Connect Wallet
Connect Wallet

Claim Airdrop
Claim Airdrop

ZKP Prover
ZKP Prover

ZKP Verifier
ZKP Verifier

License
This project is licensed under the MIT License - see the LICENSE file for details.
