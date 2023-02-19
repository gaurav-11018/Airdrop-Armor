# SybilAirdrop
A smart contract on the Polygon network that facilitates Sybil-resistant airdrops using POLYGON ID and zero-knowledge proofs.

## Overview

The Sybil Airdrop project is an Ethereum-based smart contract that enables the distribution of a fixed amount of ERC20 tokens to a maximum number of addresses while ensuring Sybil resistance. The contract uses zero-knowledge proofs (ZKPs) to verify the identity of the recipients and Polygon ID to make it resistant to Sybil attacks.

Importance of Using Polygon ID and ZKP

Polygon ID is a decentralized identity solution that provides a unique ID to each user on the Polygon network. It helps to solve the problem of Sybil attacks by ensuring that each user has a unique identity that can be verified by the network. This means that the contract can easily check if the recipient has already claimed their share of the airdrop and prevent them from claiming again.

Zero-knowledge proofs (ZKPs) are cryptographic techniques that enable two parties to prove the validity of a statement without revealing any additional information. In the context of the Sybil Airdrop, the ZKP is used to verify that the recipient is who they claim to be without revealing their actual identity. This makes it impossible for an attacker to claim the airdrop multiple times using different identities, thereby ensuring Sybil resistance.

The combination of Polygon ID and ZKPs in the Sybil Airdrop contract provides a robust and secure solution for distributing airdrops while preventing Sybil attacks.


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
