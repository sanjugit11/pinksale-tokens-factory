import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { mineBlocks, expandTo18Decimals, expandTo16Decimals } from "./Utilities/utlities";

import {
  StandardTokenFactory,
  StandardTokenFactory__factory,
  StandardToken,
  StandardToken__factory,
  IStandardERC20,
  TokenFactoryManager,
  TokenFactoryManager__factory,
  LiquidityGeneratorToken,
  LiquidityGeneratorToken__factory,
  LiquidityGeneratorTokenFactory,
  LiquidityGeneratorTokenFactory__factory,
  UniswapV2Factory,
  UniswapV2Factory__factory,
  UniswapV2Router02,
  UniswapV2Router02__factory,
  WETH9,
  UniswapV2Pair__factory,
  WETH9__factory,
  NewERC20__factory,
  CalHash,
  CalHash__factory,
  BuybackBabyToken,
  BuybackBabyToken__factory,
  BuybackBabyTokenFactory,
  BuybackBabyTokenFactory__factory,
  BabyTokenFactory,
  BabyTokenFactory__factory,
  BabyToken,
  BabyToken__factory,
  BabyTokenDividendTracker,
  BabyTokenDividendTracker__factory,
  DividendPayingToken,
  DividendPayingToken__factory


} from "../typechain";
import { time } from "console";

const provider = waffle.provider;
describe("", async () => {
  let Stoken: StandardToken;
  let Sfactory: StandardTokenFactory;
  let factoryManager: TokenFactoryManager;
  let LiquidityToken: LiquidityGeneratorToken;
  let LiquidityFactory: LiquidityGeneratorTokenFactory;
  let owner: SignerWithAddress;
  let s1: SignerWithAddress;
  let s2: SignerWithAddress;
  let s3: SignerWithAddress;
  let signers: SignerWithAddress[];
  let router: UniswapV2Router02;
  let factory: UniswapV2Factory;
  let WETH: WETH9;
  let CalHash: CalHash;
  let BuybackBabyToken:BuybackBabyToken;
  let BuybackBabyTokenFactory: BuybackBabyTokenFactory;
  let BabyToken :BabyToken;
  let BabyTokenFactory : BabyTokenFactory;
  let Dtraker : BabyTokenDividendTracker;

  beforeEach(async () => {
    signers = await ethers.getSigners();
    owner = signers[0];
    s1 = signers[1];
    s2 = signers[2];
    s3 = signers[3];

    factory = await new UniswapV2Factory__factory(owner).deploy(owner.address);
    WETH = await new WETH9__factory(owner).deploy();
    router = await new UniswapV2Router02__factory(owner).deploy(factory.address, WETH.address);

    factoryManager = await new TokenFactoryManager__factory(owner).deploy();

    Stoken = await new StandardToken__factory(owner).deploy();
    Sfactory = await new StandardTokenFactory__factory(owner).deploy(factoryManager.address, Stoken.address);

    LiquidityToken = await new LiquidityGeneratorToken__factory(owner).deploy();
    LiquidityFactory = await new LiquidityGeneratorTokenFactory__factory(owner).deploy(factoryManager.address, LiquidityToken.address);

    BuybackBabyToken  = await new BuybackBabyToken__factory(owner).deploy();
    BuybackBabyTokenFactory = await new BuybackBabyTokenFactory__factory(owner).deploy(factoryManager.address,BuybackBabyToken.address);

    BabyToken = await new BabyToken__factory(owner).deploy();
    BabyTokenFactory = await new BabyTokenFactory__factory(owner).deploy(factoryManager.address,BabyToken.address);


    // DPToken = await new DividendPayingToken__factory(owner).deploy();
    Dtraker= await new BabyTokenDividendTracker__factory(owner).deploy();
    console.log(factoryManager.address, "Tfactory from test");
    console.log(router.address, "router from test");

    console.log(owner.address, "owner from test");
    console.log(s1.address, "s1 from test");
    const balanceInWei2contract = await provider.getBalance(owner.address);
    console.log(ethers.utils.formatEther(balanceInWei2contract), "owner.address balance before");
  })

  describe("standard token test", async () => {
    it("Should clone new token", async function () {
      console.log(Stoken.address, "Stoken from test");
      console.log(Sfactory.address, "Sfactory from test");
      await factoryManager.connect(owner).addTokenFactory(Sfactory.address);
      await Sfactory.connect(s1).create("hello", "HELLO", 18, expandTo18Decimals(999), { value: expandTo18Decimals(1), gasLimit: 30000000 });
      const balanceInWei2contract = await provider.getBalance(owner.address);
      console.log(ethers.utils.formatEther(balanceInWei2contract), "owner.address balance after");
    });

    it("should transfer token",async()=>{
       await factoryManager.connect(owner).addTokenFactory(Sfactory.address);
       await Sfactory.connect(s1).create("hello", "HELLO", 18, expandTo18Decimals(999), { value: expandTo18Decimals(1), gasLimit: 30000000 });
       const newTokenAddr= await factoryManager.getToken(s1.address,0);
       const newToken = newTokenAddr[0];
      //  console.log(newToken,"newTokenAddr");
       const letsToken = Stoken.attach(newToken);
      //  console.log(await letsToken.totalSupply(),"this is the totalSupply");
      //  console.log(await letsToken.balanceOf(s1.address),"this is the s1 balance");
       await letsToken.connect(s1).transfer(s2.address,expandTo18Decimals(22),{ gasLimit: 30000000 });
       console.log(await letsToken.balanceOf(s2.address),"this is the s2 balance");
       console.log(await letsToken.balanceOf(s1.address),"this is the s1 balance");
    })
  })

  it("call hash", async () => {
    CalHash = await new CalHash__factory(owner).deploy();
    const hash = await CalHash.getInitHash();
    console.log(hash, "hash");
  })

  it("this is the call of add liquidity ETH --1", async () => {
    let token1 = await new NewERC20__factory(owner).deploy(expandTo18Decimals(10000));

    await token1.approve(router.address, expandTo18Decimals(10000));

    await router.connect(owner).addLiquidityETH(token1.address, expandTo18Decimals(10000), expandTo18Decimals(1),
      expandTo18Decimals(1), owner.address, 1678948210, { value: 1, gasLimit: 30000000 });

    const pair = await factory.getPair(token1.address, WETH.address);
    // console.log(pair);

    const Pair_instance = await new UniswapV2Pair__factory(owner).attach(pair);
    let result = await Pair_instance.getReserves();
    // console.log(result, "this is pair instance");

    let Reserve0 = Number(result._reserve0);
    let Reserve1 = Number(result._reserve1);
    // expect(Number(Reserve0)).to.be.lessThanOrEqual(Number(expandTo18Decimals(10000)));
    // expect(Number(Reserve1)).to.be.lessThanOrEqual(Number(expandTo18Decimals(1)));
  })


  it("should clone new liquidity token ", async () => {
    console.log(LiquidityToken.address, "LiquidityToken from test");
    console.log(LiquidityFactory.address, "LiquidityFactory from test");
    await factoryManager.connect(owner).addTokenFactory(LiquidityFactory.address);
    console.log("yoo");
    await LiquidityFactory.connect(s1).create("this", "THIS", expandTo18Decimals(199), router.address, s1.address, 2, 2, 10, { value: expandTo18Decimals(1), gasLimit: 30000000 });
    const balanceInWei2contract = await provider.getBalance(owner.address);
    console.log(ethers.utils.formatEther(balanceInWei2contract), "owner.address balance after");
  })


  it("should clone buy Back baby token", async()=>{
    console.log(BuybackBabyToken.address, "BuybackBabyToken from test");
    await factoryManager.connect(owner).addTokenFactory(BuybackBabyTokenFactory.address);
    let token1 = await new NewERC20__factory(owner).deploy(expandTo18Decimals(10000));

    await BuybackBabyTokenFactory.connect(s1).create("buyback","BBACk",expandTo18Decimals(188),token1.address,router.address,[2,2,2,2,40], { value: expandTo18Decimals(1), gasLimit: 30000000 });


  })

  it.only("should clone  baby token", async()=>{
    console.log(BabyToken.address, "BuybackBabyToken from test");
    let token1 = await new NewERC20__factory(owner).deploy(expandTo18Decimals(10000));
    await factoryManager.connect(owner).addTokenFactory(BabyTokenFactory.address);
    console.log(Dtraker.address,"Dtraker.address,");

    await BabyTokenFactory.connect(s1).create("baby","BABY",expandTo18Decimals(188),[token1.address,router.address,s2.address,Dtraker.address],[2,3,4],10, { value: expandTo18Decimals(1), gasLimit: 30000000 });


  })

})








