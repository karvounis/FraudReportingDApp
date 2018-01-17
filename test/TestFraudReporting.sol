pragma solidity ^0.4.18;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/FraudReporting.sol";

contract TestFraudReporting {
    FraudReporting fr = FraudReporting(DeployedAddresses.FraudReporting());
    uint public initialBalance = 1 ether;

    function testTheTest() public {
        uint bountyId = fr.createBounty(250);

        Assert.equal(bountyId, 0, "Proper bountyId was returned.");
        Assert.equal(1, fr.bountiesCounter(), "BountyCounter is working");
        var bounty = fr.bounties(bountyId);
        Assert.equal(250, bounty.bountyAmount, "Bounty Creator is equal");
        // Assert.equal(expected, bounty.bountyAmount, "Bounty Amount is equal");
        }
}