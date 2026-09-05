// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AuraProtocol {
    struct Listing { address seller; uint256 price; string metadataUri; bool active; }
    uint256 public nextListingId;
    mapping(uint256 => Listing) public listings;

    event ListingCreated(uint256 indexed listingId, address indexed seller, uint256 price, string metadataUri);
    event ListingPurchased(uint256 indexed listingId, address indexed buyer, uint256 price);

    function createListing(uint256 price, string calldata metadataUri) external returns (uint256 listingId) {
        require(price > 0, "price is zero");
        listingId = nextListingId++;
        listings[listingId] = Listing(msg.sender, price, metadataUri, true);
        emit ListingCreated(listingId, msg.sender, price, metadataUri);
    }

    function purchaseListing(uint256 listingId) external payable {
        Listing storage listing = listings[listingId];
        require(listing.active, "listing inactive");
        require(msg.value == listing.price, "incorrect payment");
        listing.active = false;
        payable(listing.seller).transfer(msg.value);
        emit ListingPurchased(listingId, msg.sender, msg.value);
    }
}