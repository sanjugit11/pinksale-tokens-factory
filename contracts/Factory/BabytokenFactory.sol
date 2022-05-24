// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./TokenFactoryBase.sol";
import "../interfaces/IBabyToken.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "hardhat/console.sol";

contract BabyTokenFactory is TokenFactoryBase ,Initializable{
  using Address for address payable;
  using SafeMath for uint256;
  constructor(address factoryManager, address implementation) TokenFactoryBase(factoryManager, implementation) {}

  function create(
    string memory name, 
    string memory symbol, 
    uint256 totalSupply,
    address[4] memory addrs, // reward, router, marketing wallet, dividendTracker
    uint256[3] memory feeSettings, // rewards, liquidity, marketing
    uint256 minimumTokenBalanceForDividends_

  ) external payable enoughFee nonReentrant returns (address token) {
    refundExcessiveFee();
    (bool success, ) = payable(feeTo).call{value: flatFee}("");
    require(success, "Address: unable to send value, recipient may have reverted");   
     token = Clones.clone(implementation);

    IBabyToken(token).initialize(name, symbol,totalSupply,addrs, feeSettings,minimumTokenBalanceForDividends_);

    assignTokenToOwner(msg.sender, token, 0);

    emit TokenCreated(msg.sender, token, 0);
  }
}

