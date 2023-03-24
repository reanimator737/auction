import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/src/signers";
import {AuctionEngine} from "../typechain-types";
const { ethers } = require('hardhat');
const { expect } = require("chai");

describe("Token contract", () => {
    let contractOwner: SignerWithAddress;
    let auctionCreator: SignerWithAddress;
    let user: SignerWithAddress;
    let contract: AuctionEngine;

    beforeEach(async () => {
        [contractOwner, auctionCreator, user] = await ethers.getSigners();
        const AucEngine = await ethers.getContractFactory('AuctionEngine', contractOwner)
        contract = await AucEngine.deploy()
        await contract.deployed()
    })
})