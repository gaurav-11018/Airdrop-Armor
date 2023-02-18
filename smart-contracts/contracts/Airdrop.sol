// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "https://raw.githubusercontent.com/0xPolygonID/contracts/main/contracts/verifiers/ZKPVerifier.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; // import Ownable contract from OpenZeppelin
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // import ERC20 token interface from OpenZeppelin
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol"; // import SafeERC20 library from OpenZeppelin for safe token transfers
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol"; // import Elliptic Curve Digital Signature Algorithm (ECDSA) library from OpenZeppelin for signature verification
import "@openzeppelin/contracts/utils/math/SafeMath.sol"; // import SafeMath library from OpenZeppelin for safe mathematical operations
import "./ZKPVerifier.sol";

interface IZKPVerifier {
    function submitZKPResponse(
        uint64 requestId,
        uint256[] calldata inputs,
        uint256[2] calldata a,
        uint256[2][2] calldata b,
        uint256[2] calldata c
    ) external returns (bool); // interface for submitting zero-knowledge proof (ZKP) response to the verifier contract

    function setZKPRequest(
        uint64 requestId,
        address validator,
        uint256 schema,
        uint256 claimPathKey,
        uint256 operator,
        uint256[] calldata value
    ) external returns (bool); // interface for setting up a ZKP request
}

contract SybilAirdrop is Ownable {
    using SafeERC20 for IERC20; // import SafeERC20 library to extend ERC20 token functionality
    using SafeMath for uint256; // import SafeMath library to perform safe mathematical operations on uint256 data type

    IERC20 public token; // ERC20 token contract instance
    uint256 public amountPerAddress; // amount of tokens to be distributed per address
    uint256 public maxAddresses; // maximum number of addresses to receive airdrop
    uint256 public maxAmount; // maximum amount of tokens to be distributed in total

    uint256 public totalDistributed; // total amount of tokens distributed
    uint256 public totalAddresses; // total number of addresses that have claimed airdrop
    mapping(address => bool) public claimed; // mapping of addresses that have claimed airdrop

    IZKPVerifier public zkpVerifier; // ZKP verifier contract instance
    uint64 public zkpRequestId; // ZKP request ID

    constructor(
        address _token, // address of the ERC20 token contract
        uint256 _amountPerAddress, // amount of tokens to be distributed per address
        uint256 _maxAddresses, // maximum number of addresses to receive airdrop
        uint256 _maxAmount, // maximum amount of tokens to be distributed in total
        address _zkpVerifier, // address of the ZKP verifier contract
        uint64 _zkpRequestId // ZKP request ID
    ) {
        require(_token != address(0), "Invalid token address"); // require valid ERC20 token contract address
        require(_amountPerAddress > 0, "Invalid amount per address"); // require positive amount of tokens per address
        require(_maxAddresses > 0, "Invalid maximum addresses"); // require positive maximum number of addresses
        require(_maxAmount > 0, "Invalid maximum amount");
        require(_zkpVerifier != address(0), "Invalid ZKP verifier address");

        token = IERC20(_token);
        amountPerAddress = _amountPerAddress;
        maxAddresses = _maxAddresses;
        maxAmount = _maxAmount;

        zkpVerifier = IZKPVerifier(_zkpVerifier);
        zkpRequestId = _zkpRequestId;
    }

    function setAmountPerAddress(uint256 _amount) external onlyOwner {
        require(_amount > 0, "Invalid amount per address");
        amountPerAddress = _amount;
    }

    function setMaxAddresses(uint256 _max) external onlyOwner {
        require(_max > 0, "Invalid maximum addresses");
        maxAddresses = _max;
    }

    function setMaxAmount(uint256 _max) external onlyOwner {
        require(_max > 0, "Invalid maximum amount");
        maxAmount = _max;
    }

    function withdrawToken(uint256 _amount) external onlyOwner {
        require(
            _amount <= token.balanceOf(address(this)),
            "Insufficient balance"
        );
        token.safeTransfer(msg.sender, _amount);
    }

    function claim(bytes calldata _proof) external {
        require(!claimed[msg.sender], "Already claimed");
        require(
            totalAddresses.add(1) <= maxAddresses,
            "Exceeded maximum addresses"
        );
        require(
            totalDistributed.add(amountPerAddress) <= maxAmount,
            "Exceeded maximum amount"
        );

        bytes32 hash = keccak256(
            abi.encodePacked(msg.sender, amountPerAddress, zkpRequestId)
        );
        address signer = ECDSA.recover(hash, _proof);
        require(signer == owner(), "Invalid signature");

        uint256[] memory inputs = new uint256[](3);
        inputs[0] = uint256(uint160(address(msg.sender)));
        inputs[1] = amountPerAddress;
        inputs[2] = zkpRequestId;

        uint256[2] memory a;
        uint256[2][2] memory b;
        uint256[2] memory c;

        // Call ZKPVerifier contract to verify proof
        bool success = zkpVerifier.submitZKPResponse(
            zkpRequestId,
            inputs,
            a,
            b,
            c
        );
        require(success, "ZKP proof verification failed");

        // Transfer tokens and update state variables
        claimed[msg.sender] = true;
        totalAddresses = totalAddresses.add(1);
        totalDistributed = totalDistributed.add(amountPerAddress);
        token.safeTransfer(msg.sender, amountPerAddress);
    }
}
