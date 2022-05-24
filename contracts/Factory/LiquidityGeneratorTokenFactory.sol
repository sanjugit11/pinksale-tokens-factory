// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./TokenFactoryBase.sol";
import "../interfaces/ILiquidityGeneratorToken.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "hardhat/console.sol";


contract LiquidityGeneratorTokenFactory is TokenFactoryBase ,Initializable{
  using Address for address payable;

  constructor(address factoryManager_, address implementation_) TokenFactoryBase(factoryManager_, implementation_) {}

  function create(
    string memory name,
    string memory symbol,
    uint256 totalSupply,
    address router,
    address charity,
    uint16 taxFeeBps, 
    uint16 liquidityFeeBps,
    uint16 charityBps
  ) external payable enoughFee nonReentrant returns (address token) {
        console.log(feeTo,"feeTo");
        console.log(flatFee,"flatFee");
        console.log(token,"token");  console.log( name ); console.log( symbol );
    // payable(feeTo).sendValue(flatFee);
     (bool success, ) = payable(feeTo).call{value: flatFee}("");
    require(success, "Address: unable to send value, recipient may have reverted");
    
     token = Clones.clone(implementation);
     console.log("hellllooooooooo");
    ILiquidityGeneratorToken(token).initialize(
      name,
      symbol,
      totalSupply,
      router,
      charity,
      taxFeeBps,
      liquidityFeeBps,
      charityBps
    );

    assignTokenToOwner(msg.sender, token, 1);
    emit TokenCreated(msg.sender, token, 1);
  }
}