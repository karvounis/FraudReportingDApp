pragma solidity ^0.4.18;

contract FraudReporting {
    
    struct FraudReport {
        address reporter;
        string url;
        int votes;
        bool isFraud;
    }

    mapping (address => uint) public balances;
    mapping (uint => FraudReport) public fraudReports;
    uint public fraudReportsCounter;
    mapping (address => uint) public bounties;
    uint public bountiesCounter;

    function FraudReporting() public {
        fraudReportsCounter = 0;
        bountiesCounter = 0;
    }

    function createFraudReport(string url) public returns (uint) {
        var fraudReportId = fraudReportsCounter++;
        fraudReports[fraudReportId] = FraudReport(msg.sender, url, 0, false);
        return fraudReportId;
    }

    function approveFraudReport(uint fraudReportId) public returns (bool) {
        fraudReports[fraudReportId].isFraud = true;
        return true;
    }

    function upVoteFraudReport(uint fraudReportId) public {
        fraudReports[fraudReportId].votes++;
    }

    function downVoteFraudReport(uint fraudReportId) public {
        fraudReports[fraudReportId].votes--;
    }

    function createBounty(uint amount) public {
        require (balances[msg.sender] >= amount);
        bounties[msg.sender] = amount;
        bountiesCounter++;
    }

    function addBalance() payable public returns (uint) {
        balances[msg.sender] += msg.value;
        return balances[msg.sender];
    }
    
    function rewardBounty(uint fraudReportId) public {
        require (balances[msg.sender] >= bounties[msg.sender]);
        balances[msg.sender] -= bounties[msg.sender];
        fraudReports[fraudReportId].reporter.transfer(bounties[msg.sender]);
        fraudReports[fraudReportId].isFraud = true;
        // balances[bountyHunter] += bounties[msg.sender];
    }
}