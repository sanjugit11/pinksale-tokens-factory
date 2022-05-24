// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;

interface IBuybackBabyToken {
    function initialize(
        string memory name_, 
        string memory symbol_, 
        uint256 totalSupply_,
        address rewardToken_,
        address router_,
        uint256[5] memory feeSettings_
    ) payable external;
}