pragma solidity ^0.4.18;

contract FraudReporting {
    
    struct FraudReport {
        address bountyHunter;
        string url;
        uint bountyId;
        bool bountyClaimed;
        int votes;
    }

    struct Bounty {
        address bountyCreator;
        uint bountyAmount;
        uint timesClaimed;
    }

    mapping (uint => FraudReport) public fraudReports;
    uint public fraudReportsCounter;
    
    mapping (uint => Bounty) public bounties;
    uint public bountiesCounter;

    uint public bountiesClaimed;

    event FraudReportCreated(string url, uint bountyId);
    event BountyCreated(uint bountyAmount);
    event Log(string message);

    modifier bountyIdExists(uint bountyId) {
        require (bountyId < bountiesCounter);
        _;
    }

    function rewardBountyToFraudReport(uint fraudReportId) payable public returns (bool) {
        require (msg.sender == bounties[fraudReports[fraudReportId].bountyId].bountyCreator);
        require(fraudReports[fraudReportId].bountyClaimed == false);
       
        fraudReports[fraudReportId].bountyHunter.transfer(bounties[fraudReports[fraudReportId].bountyId].bountyAmount);
        fraudReports[fraudReportId].bountyClaimed = true;
        bounties[fraudReports[fraudReportId].bountyId].timesClaimed++;
        bountiesClaimed++;
        return true;
    }

    function createFraudReport(string url, uint bountyId) public bountyIdExists(bountyId) returns (uint) {
        require(msg.sender != bounties[bountyId].bountyCreator);

        var fraudReportId = fraudReportsCounter++;
        fraudReports[fraudReportId] = FraudReport(msg.sender, url, bountyId, false, 0);
        FraudReportCreated(url, bountyId);
        return fraudReportId;
    }

    function createBounty(uint bountyAmount) public {
        require (msg.sender.balance >= bountyAmount);
        var bountyId = bountiesCounter++;
        bounties[bountyId] = Bounty(msg.sender, bountyAmount, 0);
        BountyCreated(bountyAmount);
    }

    function getEthBalanceOfSender() public constant returns (uint) {
        return msg.sender.balance;
    }

    function upVoteFraudReport(uint fraudReportId) public {
        fraudReports[fraudReportId].votes++;
    }

    function downVoteFraudReport(uint fraudReportId) public {
        fraudReports[fraudReportId].votes--;
    }
}