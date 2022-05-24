// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;

interface IBabyToken {
    function initialize(
      string memory name_, 
    string memory symbol_, 
    uint256 totalSupply_,
    address[4] memory addrs, // reward, router, marketing wallet, dividendTracker
    uint256[3] memory feeSettings, // rewards, liquidity, marketing
    uint256 minimumTokenBalanceForDividends_
    
    ) payable external;
}