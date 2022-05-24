import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import yesno from 'yesno';

const abi = require('ethereumjs-abi');
const AbiCoder = ethers.utils.AbiCoder;
const ADDRESS_PREFIX_REGEX = /^(41)/;

export async function mineBlocks(provider: typeof ethers.provider, count: number): Promise<void> {
  for (let i = 1; i < count; i++) {
    await provider.send('evm_mine', []);
  }
}

export function addressFromNumber(n: number): string {
  const addressZeros = '0000000000000000000000000000000000000000';
  return `0x${addressZeros.substring(n.toString().length)}${n.toString()}`;
}

export async function requestConfirmation(message = 'Ready to continue?'): Promise<void> {
  const ok = await yesno({
    yesValues: ['', 'yes', 'y', 'yes'],
    question: message,
  });
  if (!ok) {
    throw new Error('Script cancelled.');
  }
}

export function expandTo15Decimals(n: number): BigNumber {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(15));
}

export function expandTo6Decimals(n: number): BigNumber {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(6));
}

export function expandTo18Decimals(n: number): BigNumber {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(18));
}

export function expandTo17Decimals(n: number): BigNumber {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(17));
}

export function expandTo16Decimals(n: number): BigNumber {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(16));
}

export function getNodeURL(network: string): string {
  return network == 'mainnet' ? 'https://api.trongrid.io' : 'https://api.shasta.trongrid.io';
}

export function getMethodId(name: string, args: string[]) {
  return '0x' + abi.methodID(name, args).toString('hex');
}

export function encodeCall(name: string, args: string[], values: FunctionParams[]): string {
  return getMethodId(name, args) + encodeParams(values);
}

export function encodeParams(inputs: FunctionParams[]): string {
  let parameters = '';

  if (inputs.length == 0) return parameters;
  const abiCoder = new AbiCoder();
  const types = [];
  const values = [];

  for (let i = 0; i < inputs.length; i++) {
    let { type, value } = inputs[i];
    if (type == 'address') value = value.replace(ADDRESS_PREFIX_REGEX, '0x');
    else if (type == 'address[]') value = value.map((v: any) => v.toString('hex').replace(ADDRESS_PREFIX_REGEX, '0x'));
    types.push(type);
    values.push(value);
  }

  try {
    parameters = abiCoder.encode(types, values).replace(/^(0x)/, '');
  } catch (ex) {
    console.log(ex);
  }
  return parameters;
}

export async function callMethod(
  tronWeb: any,
  contractAddress: string,
  feeLimit: string,
  functionSelector: string,
  parameters: FunctionParams[] = [],
): Promise<string> {
  const options = {
    feeLimit: feeLimit,
    callValue: 0,
  };
  const issuerAddress = tronWeb.defaultAddress.base58;
  const transactionObject = await tronWeb.transactionBuilder.triggerConstantContract(
    contractAddress,
    functionSelector,
    options,
    parameters,
    tronWeb.address.toHex(issuerAddress),
  );

  console.log('transactionObject ', functionSelector, transactionObject.constant_result);
  return transactionObject.constant_result[0];
}

export async function sendTransaction(
  tronWeb: any,
  contractAddress: string,
  feeLimit: string,
  functionSelector: string,
  parameters: FunctionParams[] = [],
): Promise<void> {
  const options = {
    feeLimit: feeLimit,
    callValue: 0,
  };
  const issuerAddress = tronWeb.defaultAddress.base58;
  const transactionObject = await tronWeb.transactionBuilder.triggerSmartContract(
    contractAddress,
    functionSelector,
    options,
    parameters,
    tronWeb.address.toHex(issuerAddress),
  );

  console.log('transactionObject: ', JSON.stringify(transactionObject));

  if (!transactionObject.result || !transactionObject.result.result) return console.error('Unknown error');

  const signedTransaction = await tronWeb.trx.sign(transactionObject.transaction);
  if (!signedTransaction.signature) {
    return console.error('Transaction was not signed properly');
  }

  await tronWeb.trx.sendRawTransaction(signedTransaction);
}

export type FunctionParams = { type: string; value: any };
