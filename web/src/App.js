import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const SybilAirdropAddress = "0x0ba521c07aeee9ef89173e08b3ab23f5e36a8a1d"; // replace with the actual address of the SybilAirdrop contract
const SybilAirdropABI = [
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
];

function App() {
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [sybilAirdropContract, setSybilAirdropContract] = useState(null);

  const [amountPerAddress, setAmountPerAddress] = useState(0);
  const [maxAddresses, setMaxAddresses] = useState(0);
  const [maxAmount, setMaxAmount] = useState(0);
  const [totalDistributed, setTotalDistributed] = useState(0);
  const [totalAddresses, setTotalAddresses] = useState(0);
  const [claimed, setClaimed] = useState(false);

  const [proof, setProof] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);
        const signer = web3Provider.getSigner();
        setSigner(signer);
        const account = await signer.getAddress();
        setAccount(account);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const claimTokens = async () => {
    if (signer && sybilAirdropContract && proof) {
      try {
        const tx = await sybilAirdropContract.claim(proof);
        await tx.wait();
        setClaimed(true);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const getSybilAirdropContract = () => {
      if (provider) {
        const sybilAirdropContract = new ethers.Contract(
          SybilAirdropAddress,
          SybilAirdropABI,
          provider
        );
        setSybilAirdropContract(sybilAirdropContract);
      }
    };
    getSybilAirdropContract();
  }, [provider]);

  useEffect(() => {
    const getSybilAirdropData = async () => {
      if (sybilAirdropContract) {
        try {
          const amountPerAddress =
            await sybilAirdropContract.amountPerAddress();
          setAmountPerAddress(amountPerAddress);
          const maxAddresses = await sybilAirdropContract.maxAddresses();
          setMaxAddresses(maxAddresses);
          const maxAmount = await sybilAirdropContract.maxAmount();
          setMaxAmount(maxAmount);
          const totalDistributed =
            await sybilAirdropContract.totalDistributed();
          setTotalDistributed(totalDistributed);
          const totalAddresses = await sybilAirdropContract.totalAddresses();
          setTotalAddresses(totalAddresses);
        } catch (error) {
          console.error(error);
        }
      }
    };
    getSybilAirdropData();
  }, [sybilAirdropContract]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sybil Airdrop Claim</h1>
      </header>
      <main>
        {account ? (
          <>
            <p>Connected account: {account}</p>
            <p>Amount per address: {amountPerAddress.toString()}</p>
            <p>Maximum number of addresses: {maxAddresses.toString()}</p>
            <p>Maximum amount to be distributed: {maxAmount.toString()}</p>
            <p>Total distributed: {totalDistributed.toString()}</p>
            <p>Total number of addresses: {totalAddresses.toString()}</p>
            {claimed ? (
              <p>Tokens claimed!</p>
            ) : (
              <>
                <input
                  type="text"
                  value={proof}
                  onChange={(e) => setProof(e.target.value)}
                />
                <button onClick={claimTokens}>Claim tokens</button>
              </>
            )}
          </>
        ) : (
          <button onClick={connectWallet}>Connect wallet</button>
        )}
      </main>
    </div>
  );
}

export default App;
