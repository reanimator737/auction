// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract AuctionEngine {
    address public owner;
    uint constant DURATION = 1 days;
    uint constant FEE = 5;

    struct Auction {
        address payable seller;
        uint startingPrice;
        uint finalPrice;
        uint startAt;
        uint endsAt;
        uint discountRate;
        string item;
        bool stopped;
    }

    Auction[] public auction;

    constructor(){
        owner = msg.sender;
    }

    event AuctionCreated(uint index, string item, uint startPrice,uint duration);
    event AuctionEnded(uint index, string item, uint finalPrice,address winner);

    function createAuction(uint _startPrice, uint _discountRate, string calldata _item, uint _duration ) external{
        uint duration = _duration == 0 ? DURATION : _duration;
        require(_startPrice >= _discountRate * duration, "Incorrect starting price");
        Auction memory newAuction = Auction({
            seller: payable(msg.sender),
            startingPrice: _startPrice,
            finalPrice: _startPrice,
            discountRate: _discountRate,
            startAt: block.timestamp,
            endsAt: block.timestamp + duration,
            item: _item,
            stopped: false
        });

        auction.push(newAuction);

        emit AuctionCreated(auction.length - 1, _item, _startPrice, duration);
    }

    function getPriceFor(uint index) public view returns(uint){
        Auction memory current = auction[index];
        require(!current.stopped, "stopped");
        uint elapsed = block.timestamp - current.startAt;
        uint discount = current.discountRate * elapsed;
        return current.startingPrice - discount;
    }

    function buy(uint _index) external payable{
        Auction storage current = auction[_index];
        require(!current.stopped, "stopped");
        require(block.timestamp < current.endsAt, "ended");
        uint currentPrice = getPriceFor(_index);
        require(msg.value >= currentPrice, "not enough funds");
        current.stopped = true;
        current.finalPrice = currentPrice;
        uint refund = msg.value - currentPrice;

        if (refund > 0) {
            payable(msg.sender).transfer(refund);
        }

        current.seller.transfer(currentPrice - (currentPrice * FEE / 100));
        emit AuctionEnded(_index, current.item, currentPrice, msg.sender);
    }
}
