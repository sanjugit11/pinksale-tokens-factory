// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./TokenFactoryBase.sol";
import "../interfaces/IStandardERC20.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "hardhat/console.sol";

contract StandardTokenFactory is TokenFactoryBase ,Initializable{
  using Address for address payable;
  using SafeMath for uint256;
  constructor(address factoryManager_, address implementation_) TokenFactoryBase(factoryManager_, implementation_) {}

  function create(
    string memory name, 
    string memory symbol, 
    uint8 decimals, 
    uint256 totalSupply
  ) external payable enoughFee nonReentrant returns (address token) {
     console.log(feeTo,"feeTo");
    (bool success, ) = payable(feeTo).call{value: flatFee}("");
    require(success, "Address: unable to send value, recipient may have reverted");
        
    console.log(implementation,"implementation");
    token = Clones.clone(implementation);
    ///console
    console.log("before initialize");  console.log(token,"token");  console.log( name ); console.log( symbol );
    console.log( decimals );
    console.log( totalSupply );
    console.log(msg.value,"payable");
    console.log(flatFee,"flatfee");

    IStandardERC20(token).initialize(name, symbol, decimals, totalSupply);

    console.log(token,"token after ");
    assignTokenToOwner(msg.sender, token, 0);
    emit TokenCreated(msg.sender, token, 0);
  }
}
