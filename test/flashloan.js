const { expect } = require("chai");
//const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
//const hre = require("hardhat");

const { DAI, DAI_WHALE, POOL_ADDRESS_PROVIDER } = require("../config");

describe("Deploy a Flash Loan:", function () {
  it("Should take a flash loan and be able to return it", async function () {
    const flashLoan = await ethers.getContractFactory("FlashLoan");

    const _flashLoan = await flashLoan.deploy(
      // Address of the PoolAddressProvider: you can find it here: https://docs.aave.com/developers/deployed-contracts/v3-mainnet/polygon
      POOL_ADDRESS_PROVIDER
    );
    await _flashLoan.deployed();

    console.log("FlashLoan contract is deployed at ", _flashLoan.address);

    const token = await ethers.getContractAt("IERC20", DAI);
    const BALANCE_AMOUNT_DAI = ethers.utils.parseEther("2000");
    console.log("Total Balance before premium is paid: ", BALANCE_AMOUNT_DAI);

    // Impersonate the DAI_WHALE account to be able to send transactions from that account
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DAI_WHALE],
    });
    const signer = await ethers.getSigner(DAI_WHALE);
    await token
      .connect(signer)
      .transfer(_flashLoan.address, BALANCE_AMOUNT_DAI); // Sends our contract 2000 DAI from the DAI_WHALE

    const tx = await _flashLoan.createFlashLoan(DAI, 1000); // Borrow 1000 DAI in a Flash Loan with no upfront collateral
    await tx.wait();

    const remainingBalance = await token.balanceOf(_flashLoan.address); // Check the balance of DAI in the Flash Loan contract afterwards
    console.log("Remaining Balance after premium is paid: ", remainingBalance);

    expect(remainingBalance.lt(BALANCE_AMOUNT_DAI)).to.be.true; // We must have less than 2000 DAI now, since the premium was paid from our contract's balance
  });
});

/*

  Deploy a Flash Loan:
FlashLoan contract is deployed at  0x232A4710D1A21AfEfB021654C5B48092e5faB67F
Total Balance before premium is paid:  BigNumber { value: "2000000000000000000000" }
Remaining Balance after premium is paid:  BigNumber { value: "1999999999999999999999" }

*/
