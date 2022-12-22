const hre = require("hardhat");
const fs = require('fs')
async function main() {
  const whiteList = await hre.ethers.getContractFactory("Whitelist");
  console.log('----------------deploying--------------------')
  const whitelist = await whiteList.deploy(10);
  await whitelist.deployed()
  const data = {
    address: whitelist.address,
    abi: JSON.parse(whitelist.interface.format('json'))
  }
  console.log(`deployed at: ${whitelist.address}`)
  // fs.writeFileSync('./data.json', JSON.stringify(data))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
