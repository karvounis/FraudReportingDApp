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

    event FraudReportCreated(string url, uint bountyId, uint fraudReportId);
    event BountyCreated(uint bountyAmount, uint bountyId);

    modifier bountyIdExists(uint bountyId) {
        require (bountyId < bountiesCounter);
        _;
    }

    modifier fraudReportHasNotClaimedBounty(uint fraudReportId) {
        require(fraudReports[fraudReportId].bountyClaimed == false);
        _;
    }

    /* Creates a Fraud report given a url and a bounty id. By generating a fraud report, you have to register it to a specific Bounty, thus you need to provide the bounty id*/
    function createFraudReport(string url, uint bountyId) public bountyIdExists(bountyId) returns (uint) {
        require(msg.sender != bounties[bountyId].bountyCreator);

        var fraudReportId = fraudReportsCounter++;
        fraudReports[fraudReportId] = FraudReport(msg.sender, url, bountyId, false, 0);
        FraudReportCreated(url, bountyId, fraudReportId);
        return fraudReportId;
    }

    /** Creates a Bounty given a bounty amount */
    function createBounty(uint bountyAmount) public {
        require (msg.sender.balance >= bountyAmount);
        var bountyId = bountiesCounter++;
        bounties[bountyId] = Bounty(msg.sender, bountyAmount, 0);
        BountyCreated(bountyAmount, bountyId);
    }

    /** 
        Rewards Bounty money to the address that generated the Fraud Report. 
        The Fraud Report must not have claimed the bounty again in the past.
        The sender of the message must be the creator of the Bounty that the Fraud Report is claiming.
        The value of the message must be exactly the same with the bounty amount.
     */
    function rewardBountyToFraudReport(uint fraudReportId) payable public fraudReportHasNotClaimedBounty(fraudReportId) returns (bool) {
        require (msg.sender == bounties[fraudReports[fraudReportId].bountyId].bountyCreator);
        require(msg.value == bounties[fraudReports[fraudReportId].bountyId].bountyAmount);

        fraudReports[fraudReportId].bountyHunter.transfer(msg.value);
        fraudReports[fraudReportId].bountyClaimed = true;
        bounties[fraudReports[fraudReportId].bountyId].timesClaimed++;
        bountiesClaimed++;
        return true;
    }

    /** Upvotes a Fraud Report */
    function upVoteFraudReport(uint fraudReportId) public {
        fraudReports[fraudReportId].votes++;
    }

    /** Downvotes a Fraud Report */
    function downVoteFraudReport(uint fraudReportId) public {
        fraudReports[fraudReportId].votes--;
    }
}