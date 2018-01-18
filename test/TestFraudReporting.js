var FraudReporting = artifacts.require("../contracts/FraudReporting.sol");

contract('FraudReporting', function(accounts) {

  let bountiesCreated = 0;
  it("should create successfully a Bounty", async function() {
    let fr = await FraudReporting.deployed();
    const bountyNumber = 2500;
    let bountyId = await fr.createBounty(bountyNumber, {from: web3.eth.accounts[0]});

    let bounty = await fr.bounties(bountiesCreated++);

    let bountiesCounter = await fr.bountiesCounter();

    assert.equal(bountiesCounter, 1, "Number of bounties is correct");
    assert.equal(bounty[0], web3.eth.accounts[0], "Bounty reporter is correct")
    assert.equal(bounty[1], bountyNumber, "Bounty amount is correct")
    assert.equal(bounty[2], 0, "Bounty times claimed is correct")
  });

  it("should create successfully a FraudReport", async function() {
    let fr = await FraudReporting.deployed();
    let bountyId = await fr.createBounty(3500, {from: web3.eth.accounts[1]});
    const url = "www.randomUrl.com";
    let fraudReportId = await fr.createFraudReport(url, bountiesCreated);
    let fraudReport = await fr.fraudReports(0, {from: web3.eth.accounts[0]});

    let fraudReportCounter = await fr.fraudReportsCounter();

    assert.equal(fraudReportCounter, 1, "Number of fraud reports is correct");
    assert.equal(fraudReport[0], web3.eth.accounts[0], "FraudReport bounty hunter is correct");
    assert.equal(fraudReport[1], url, "FraudReport url is correct");
    assert.equal(fraudReport[2], bountiesCreated, "FraudReport bounty id is correct");
    assert.equal(fraudReport[3], false, "FraudReport bounty claimed is correct");
    assert.equal(fraudReport[4], 0, "FraudReport votes is correct");
  });

})
