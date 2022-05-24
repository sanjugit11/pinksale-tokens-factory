// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./TokenFactoryBase.sol";
import "../interfaces/IBuybackBabyToken.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "hardhat/console.sol";

contract BuybackBabyTokenFactory is TokenFactoryBase ,Initializable{
  using Address for address payable;
  using SafeMath for uint256;
  constructor(address factoryManager, address implementation) TokenFactoryBase(factoryManager, implementation) {}

  function create(
    string memory name_,
    string memory symbol_,
        uint256 totalSupply_,
        address rewardToken_,
        address router_,
        uint256[5] memory feeSettings_
  ) external payable enoughFee nonReentrant returns (address token) {
    // refundExcessiveFee();
    // payable(feeTo).sendValue(flatFee);
    (bool success, ) = payable(feeTo).call{value: flatFee}("");
    require(success, "Address: unable to send value, recipient may have reverted");
    console.log("BuybackBabyTokenFactory");
    token = Clones.clone(implementation);
    IBuybackBabyToken(token).initialize(name_, symbol_,totalSupply_,rewardToken_, router_,feeSettings_);
        console.log("BuybackBabyTokenFactory2");

    assignTokenToOwner(msg.sender, token, 0);
        console.log("BuybackBabyTokenFactory3");

    emit TokenCreated(msg.sender, token, 0);
  }
}

