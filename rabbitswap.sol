// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RabbitSwap_Alpha_0.0.4_Final
 * @dev Optimized for Paseo Asset Hub. Fixed Checksum.
 */
contract RabbitSwap {
    // Addresses with mandatory EIP-55 Checksum
    address public constant owner = 0xa036B32c86E2aB7F2AdE9ACC15984B2A2DDe8977;
    address public constant HOPx = 0xFf7FBB044170c855527735F08443A3e74C9E5580; 
    uint256 public constant RATE = 200;

    // Token Metadata
    string public constant name = "RabbitSwap Token X";
    string public constant symbol = "RABx";
    uint8 public constant decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() {
        _mint(address(this), 100_000_000 * 10**18);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    function _mint(address to, uint256 n) internal {
        totalSupply += n;
        balanceOf[to] += n;
        emit Transfer(address(0), to, n);
    }

    function mintRABx(uint256 n) external onlyOwner {
        _mint(address(this), n);
    }

    function swapHOPxforRABx(uint256 nIn) external {
        uint256 nOut = nIn * RATE;
        require(balanceOf[address(this)] >= nOut, "LOW_LIQ");

        // Execute HOPx pull
        (bool s, bytes memory d) = HOPx.call(
            abi.encodeWithSignature("transferFrom(address,address,uint256)", msg.sender, address(this), nIn)
        );
        require(s && (d.length == 0 || abi.decode(d, (bool))), "TX_FAIL");

        balanceOf[address(this)] -= nOut;
        balanceOf[msg.sender] += nOut;
        emit Transfer(address(this), msg.sender, nOut);
    }

    function rescueTokens(address t, uint256 n) external onlyOwner {
        (bool s, ) = t.call(abi.encodeWithSignature("transfer(address,uint256)", owner, n));
        require(s, "FAIL");
    }

    function transfer(address to, uint256 n) external returns (bool) {
        require(balanceOf[msg.sender] >= n, "BAL");
        balanceOf[msg.sender] -= n;
        balanceOf[to] += n;
        emit Transfer(msg.sender, to, n);
        return true;
    }

    function approve(address s, uint256 n) external returns (bool) {
        allowance[msg.sender][s] = n;
        emit Approval(msg.sender, s, n);
        return true;
    }
}
