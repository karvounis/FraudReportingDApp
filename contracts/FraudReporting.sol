pragma solidity ^0.4.17;

contract FraudReporting {
    struct Bounty {
        address creator;
        uint bountyAmount;
    }

    struct FraudReport {
        address reporter;
        string url;
        int votes;
        bool isFraud;
    }

    mapping (uint => FraudReport) fraudReports;
    uint fraudReportCounter;
    mapping (address => uint) bounties;
    uint bountyCounter;

    function FraudReporting() public {
        
    }

    function createFraudReport(string url) public returns (uint) {
        
    }

    function approveFraudReport(uint fraudReportId) public returns (bool) {
        
    }

    function upVoteFraudReport(uint fraudReportId) public returns (bool) {
        
    }

    function downVoteFraudReport(uint fraudReportId) public returns (bool) {
        
    }

    function createBounty(uint amount) public returns (uint) {
        
    }

    function updateBounty(uint bountyId, uint amount) public returns (bool) {
        
    }

    function rewardBounty(uint bountyId, address bountyHunter) public returns (bool) {
        
    }

    function isFraudReportAFraud(uint fraudReportId) constant returns (bool) {
        
    }
}