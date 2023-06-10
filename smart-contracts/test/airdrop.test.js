const { expect } = require("chai");
const { ethers } = require("hardhat");
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const { hexStripZeros } = require("ethers/lib/utils");

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

describe("AirDrop", function () {
  const TOKENS_IN_POOL = toWei(1000000000)
  const REWARD_AMOUNT = toWei(500)
  let addrs
  let contractBlocknumber
  const blockNumberCutoff = 11 
  before(async function () {
    this.shuffle = []
    while (this.shuffle.length < 20) {
      let r = Math.floor(Math.random() * 20)
      if (this.shuffle.indexOf(r) === -1) {
        this.shuffle.push(r)
      }
    }

    addrs = await ethers.getSigners();
    const EthSwapFactory = await ethers.getContractFactory('EthSwap', addrs[0]);
    this.ethSwap = await EthSwapFactory.deploy();
    const receipt = await this.ethSwap.deployTransaction.wait()
    contractBlocknumber = receipt.blockNumber

    let tokenAddress = await this.ethSwap.token();
    this.token = (
      await ethers.getContractFactory('Token', addrs[0])
    ).attach(tokenAddress);

    expect(
      await this.token.balanceOf(this.ethSwap.address)
    ).to.equal(TOKENS_IN_POOL);

    await Promise.all(this.shuffle.map(async (i, indx) => {
      const receipt = await (await this.ethSwap.connect(addrs[i]).buyTokens({ value: toWei(10) })).wait()
      expect(receipt.blockNumber).to.eq(indx + 2)
    }))

    const filter = this.ethSwap.filters.TokensPurchased()
    const results = await this.ethSwap.queryFilter(filter, contractBlocknumber, blockNumberCutoff)
    expect(results.length).to.eq(blockNumberCutoff - contractBlocknumber)

    this.leafNodes = results.map(i => keccak256(i.args.account.toString()))
    this.merkleTree = new MerkleTree(this.leafNodes, keccak256, { sortPairs: true });
    const rootHash = this.merkleTree.getRoot()
    const AirDropFactory = await ethers.getContractFactory('AirDrop', addrs[0]);
    this.airDrop = await AirDropFactory.deploy(rootHash, REWARD_AMOUNT);

    // Log eligible addresses
    console.log("Eligible addresses for airdrop:");
    for (let i = 0; i < this.leafNodes.length; i++) {
      console.log(hexStripZeros(this.leafNodes[i]));
    }
  });

  it("Only eligible accounts should be able to claim airdrop", async function () {
    let ineligibleAddresses = [];

    for (let i = 0; i < 20; i++) {
      const proof = this.merkleTree.getHexProof(keccak256(addrs[i].address))
      if (proof.length !== 0) {
        await this.airDrop.connect(addrs[i]).claim(proof)
        expect(await this.airDrop.balanceOf(addrs[i].address)).to.eq(REWARD_AMOUNT)
        await expect(this.airDrop.connect(addrs[i]).claim(proof)).to.be.revertedWith("Already claimed air drop")
      } else {
        ineligibleAddresses.push(hexStripZeros(addrs[i].address));
        await expect(this.airDrop.connect(addrs[i]).claim(proof)).to.be.revertedWith("Incorrect merkle proof")
        expect(await this.airDrop.balanceOf(addrs[i].address)).to.eq(0)
      }
    }

    // Log ineligible addresses
    console.log("Ineligible addresses for airdrop:");
    for (let i = 0; i < ineligibleAddresses.length; i++) {
      console.log(ineligibleAddresses[i]);
    }
  });
});
