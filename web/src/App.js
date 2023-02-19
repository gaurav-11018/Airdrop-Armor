const { ethers } = require("ethers");

// ABI for the SybilAirdrop contract
const SybilAirdropABI = [
  [
    {
      inputs: [
        {
          internalType: "uint64",
          name: "requestId",
          type: "uint64",
        },
        {
          internalType: "address",
          name: "validator",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "schema",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "claimPathKey",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "operator",
          type: "uint256",
        },
        {
          internalType: "uint256[]",
          name: "value",
          type: "uint256[]",
        },
      ],
      name: "setZKPRequest",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint64",
          name: "requestId",
          type: "uint64",
        },
        {
          internalType: "uint256[]",
          name: "inputs",
          type: "uint256[]",
        },
        {
          internalType: "uint256[2]",
          name: "a",
          type: "uint256[2]",
        },
        {
          internalType: "uint256[2][2]",
          name: "b",
          type: "uint256[2][2]",
        },
        {
          internalType: "uint256[2]",
          name: "c",
          type: "uint256[2]",
        },
      ],
      name: "submitZKPResponse",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
];

// Address of the SybilAirdrop contract on the Ethereum network
const SybilAirdropAddress = "0x0ba521c07aeee9ef89173e08b3ab23f5e36a8a1d";

// Address of the ERC20 token contract on the Ethereum network
const TokenAddress = "0x463c96a29f442c7fac48bc5b7d468f7b5dd37c94";

// Provider for the Ethereum network
const provider = new ethers.providers.JsonRpcProvider();

// Signer for the owner of the SybilAirdrop contract
const signer = provider.getSigner("0x0ba521c07aeee9ef89173e08b3ab23f5e36a8a1d");

// Contract instance for the SybilAirdrop contract
const SybilAirdropContract = new ethers.Contract(
  SybilAirdropAddress,
  SybilAirdropABI,
  provider
);

// Contract instance for the ERC20 token contract
const TokenContract = new ethers.Contract(
  TokenAddress,
  ["function balanceOf(address) view returns (uint)"],
  provider
);

// Function to claim the airdrop for a given Ethereum address
async function claimAirdrop(address, proof) {
  // Check if the address has already claimed the airdrop
  const hasClaimed = await SybilAirdropContract.claimed(address);
  if (hasClaimed) {
    console.log("Address has already claimed the airdrop");
    return;
  }

  // Get the amount of tokens to be distributed per address
  const amountPerAddress = await SybilAirdropContract.amountPerAddress();

  // Get the ZKP request ID for the SybilAirdrop contract
  const zkpRequestId = await SybilAirdropContract.zkpRequestId();

  // Compute the hash of the message to be signed
  const hash = ethers.utils.solidityKeccak256(
    ["address", "uint256", "uint64"],
    [address, amountPerAddress, zkpRequestId]
  );

  // Verify the signature of the message
  const signer = await ethers.utils.verifyMessage(
    ethers.utils.arrayify(hash),
    proof
  );
  if (signer !== "0x1234567890123456789012345678901234567890") {
    console.log("Invalid signature");
    return;
  }

  // Submit the ZKP response to the SybilAirdrop contract
  const inputs = [address, amountPerAddress, zkpRequestId];
  const a = [0, 0];
  const b = [
    [0, 0],
    [0, 0],
  ];
  const c = [0, 0];

  const response = await SybilAirdropContract.submitZKPResponse(
    inputs,
    a,
    b,
    c
  );
  if (!response) {
    console.log("Failed to submit ZKP response");
    return;
  }

  // Transfer tokens to the address
  const tokenBalance = await TokenContract.balanceOf(SybilAirdropAddress);
  const amount = Math.min(tokenBalance, amountPerAddress);
  const transferResponse = await TokenContract.transfer(address, amount);
  if (!transferResponse) {
    console.log("Failed to transfer tokens to address");
    return;
  }

  console.log(`Transferred ${amount} tokens to address ${address}`);
}
