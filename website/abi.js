var contractAddress = "0x1234567890123456789012345678901234567890";
var abi = [
  {
    constant: false,
    inputs: [
      {
        name: "recipients",
        type: "address[]",
      },
      {
        name: "amounts",
        type: "uint256[]",
      },
    ],
    name: "airdropTokens",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];
