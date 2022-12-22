// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IWhitelist.sol";

contract Gang is ERC721Enumerable, Ownable {
    //token URI
    string _baseuri;
    //price per NFT to mint
    uint256 public _price = 0.001 ether;
    // _paused is used to pause the contract in case of an emergency
    bool public _paused;
    //total NFT
    uint256 public maxTokenIds = 50;
    // total number of tokenIds minted
    uint256 public currentTokenIds;
    // Whitelist contract instance of interface
    IWhitelist whitelist;
    // boolean to keep track of whether presale started or not
    bool public presaleStarted;
    // timestamp for when presale would end
    uint256 public presaleEnded;

    //modifier
    modifier onlyWhenNotPaused() {
        require(!_paused, "Currently contract is paused");
        _;
    }

    constructor(string memory baseURI, address whitelistContract)
        ERC721("GANG", "GOW")
    {
        _baseuri = baseURI;
        whitelist = IWhitelist(whitelistContract);
    }

    function startPreSale() public onlyOwner {
        presaleStarted = true;
        presaleEnded = block.timestamp + 10 minutes;
    }

    /**
     * @dev presaleMint allows a user to mint one NFT per transaction during the presale.
     */
    function presaleMint() public payable onlyWhenNotPaused {
        require(
            presaleStarted && block.timestamp < presaleEnded,
            "presale is not running"
        );
        require(
            whitelist.whitelistedAddresses(msg.sender),
            "You are not whiteListed, you miss opportunity, Go and check there might be chance of whitelisting"
        );
        require(
            currentTokenIds < maxTokenIds,
            "All NFT has been minted, sorry you are late :("
        );
        require(msg.value >= _price, "Please Enter correct price");
        currentTokenIds += 1;
        _safeMint(msg.sender, currentTokenIds);
    }

    /**
     * @dev mint allows a user to mint 1 NFT per transaction.
     */
    function mint() public payable onlyWhenNotPaused {
        
        require(
            currentTokenIds < maxTokenIds,
            "All NFT has been minted, sorry you are late :("
        );
        require(msg.value >= _price, "Please Enter correct price");
        currentTokenIds += 1;
        _safeMint(msg.sender, currentTokenIds);
    }

    /**
     * @dev _baseURI overides the Openzeppelin's ERC721 implementation which by default
     * returned an empty string for the baseURI
     */

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseuri;
    }

    /// @dev setPaused makes the contract paused or unpaused in case of emergency

    function setPaused(bool val) public onlyOwner {
        _paused = val;
    }

    function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 Ammount = address(this).balance;
        (bool send, ) = _owner.call{value: Ammount}("");
        require(send, "Failed to withdaraw");
    }

    receive() external payable {}

    fallback() external payable {}
}
