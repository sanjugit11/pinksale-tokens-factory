// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.6.0) (token/ERC20/IERC20.sol)

pragma solidity ^0.8.0;

interface IBabyTokenDividendTracker {
       function initialize( address rewardToken_, uint256 minimumTokenBalanceForDividends_  ) external  ;
}