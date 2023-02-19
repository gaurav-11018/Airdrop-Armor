import React, { useState, useEffect } from "react";
import Web3 from "web3";
import SybilAirdrop from "./contracts/SybilAirdrop.json";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        await window.ethereum.enable();
        const web3 = new Web3(window.ethereum);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SybilAirdrop.networks[networkId];
        const contract = new web3.eth.Contract(
          SybilAirdrop.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContract(contract);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      }
    };
    init();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await contract.methods.claim(recipient, amount).send({ from: account });
      setRecipient("");
      setAmount(0);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Sybil Airdrop</h1>
      {account ? (
        <p>Connected Account: {account}</p>
      ) : (
        <p>Connect your wallet to get started</p>
      )}
      <form onSubmit={handleSubmit}>
        <label>
          Recipient:
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </label>
        <br />
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <br />
        <button type="submit" disabled={!contract || loading}>
          {loading ? "Loading..." : "Claim"}
        </button>
        {error && <p>Error: {error}</p>}
      </form>
    </div>
  );
}

export default App;
