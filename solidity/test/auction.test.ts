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

    async function getTimestamp(blockNumber: number): Promise<number> {
        return (await ethers.provider.getBlock(blockNumber)).timestamp
    }

    it('Create auction', async () => {
        const startPrice = ethers.utils.parseEther('0.001');
        const discountRate = 10;
        const item = "Very good product";
        const duration = 60;
        const tx = await contract.connect(auctionCreator).createAuction(startPrice, discountRate, item, duration);

        if (!tx.blockNumber){
            return new Error()
        }

        const currentAuc = await contract.auction(0);
        const time = await getTimestamp(tx.blockNumber)
        expect(currentAuc.item).to.equal(item)
        expect(currentAuc.seller).to.equal(auctionCreator.address)
        expect(currentAuc.stopped).to.equal(false)
        expect(currentAuc.endsAt).to.equal(time + duration)

    })
})