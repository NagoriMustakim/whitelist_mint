const { ethers } = require('hardhat');
const fs = require('fs')
const data = require('./data.json')
const metadata = "https://nft-collection-sneh1999.vercel.app/api/"
const whitelistAddress = "0x8Ea3E0a8b403E28B2Aa79a2f013B644EF45fbfAF"
async function main() {
    const Gang = await ethers.getContractFactory("Gang")
    const gang = await Gang.deploy(metadata, whitelistAddress)
    console.log(`deployed at ${gang.address}`)
    const data = {
        address: gang.address,
        abi: JSON.parse(gang.interface.format('json'))
    }
    fs.writeFileSync('./NFTdata.json', JSON.stringify(data))

}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });