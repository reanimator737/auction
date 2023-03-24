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

    it('Check owner', async () => {
        const _owner = await contract.owner()
        expect(_owner).to.equal(contractOwner.address)
    })

    it('Create auction', async () => {
        const startPrice = 10_000_000;
        const discountRate = 10;
        const item = "Very good product";
        const duration = 0;
        await contract.connect(auctionCreator).createAuction(startPrice, discountRate, item, duration);

        const currentAuc = await contract.auction(0);
        expect(currentAuc.item).to.equal(item)
        expect(currentAuc.seller).to.equal(auctionCreator.address)
        expect(currentAuc.stopped).to.equal(false)


    })
})