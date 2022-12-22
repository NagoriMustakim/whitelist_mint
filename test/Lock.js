const { expect } = require('chai');
const { ethers } = require('hardhat');
describe('WhiteList', () => {
  let whitelist, whiteList, demo, owner, demo1, owner1
  beforeEach(async () => {
    [demo, demo1, owner1] = await ethers.getSigners();
    //deploying smart contract locally
    whitelist = await ethers.getContractFactory('whitelist')
    whiteList = await whitelist.deploy('10')
    owner = await whiteList.owner()
  
    // console.log(`Contract Address is: ${(typeof whitelist.address)}`)
  })
  describe('Testing Varaibles', () => {
    it('check maxAmount People', async () => {
      const maxAddresses = await whiteList.MaxAmountPeople();
      // console.log(maxAddresses)
      expect(maxAddresses).to.be.equal('10');
    })
    it('check current whiteListed', async () => {
      const curent = await whiteList.currentWhiteListed()
      expect(curent).to.be.equal('0')
    })

  })
  describe('testing whitelist function', () => {
    it('check currentWhiteListed < MaxAmountPeople', async () => {
      const curent = await whiteList.currentWhiteListed()
      const maxAddresses = await whiteList.MaxAmountPeople();
      expect(curent).to.be.lessThan(maxAddresses);
    })
    it('check Address should not be whitelisted', async () => {
      const result = await whiteList.whitelistedAddresses(demo1.address)
      expect(result).to.be.equal(false)
    })
    it('Approving WhiteList Function', async () => {
      const transcation = await whiteList.connect(demo1).WhiteList();
      await transcation.wait();
      console.log('Function Approved')
      const result = await whiteList.whitelistedAddresses(demo1.address)
      expect(result).to.be.equal(true)
      const curent = await whiteList.currentWhiteListed()
      expect(curent).to.be.equal('1')

    })

  })
  describe('updateMaxAmountPeople onlyowner can', () => {
    it('update MaxAmountPeople veraible', async () => {
      const transcation = await whiteList.updateMaxAmountPeople(20)
      await transcation.wait()
      const maxAddresses = await whiteList.MaxAmountPeople();
      expect(maxAddresses).to.be.equal(20)

    })
  })
  describe('transfer ownership of contract another address', () => {
    it('ownerShipTransfer', async () => {
      const transcation = await whiteList.ownerShipTransfer(owner1.address)
      await transcation.wait()
      let newOwner = await whiteList.owner()
      expect(newOwner).to.be.equal(owner1.address)
     
    })
  })
})