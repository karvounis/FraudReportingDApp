pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/FraudReport.sol";

contract FraudReportTest {
  FraudReport fraudReport = FraudReport(DeployedAddresses.FraudReport());
    
    // function testNotarize() public {
    //     // console.log(fraudReport.getProofCount());
    //     // Assert.equal(0, fraudReport.getProofCount(), "Well done");
    //     bool ok = fraudReport.notarize("http://www.dailymail.co.uk/sport/football/article-5270781/Henrikh-Mkhitaryan-arrives-hotel-despite-Man-Utd-doubts.html");
    //     bool ok2 = true;

    //     // Assert.equal(ok, ok2, "Well done");
    //     Assert.equal(1, fraudReport.getProofCount(), "Well done");
    //     fraudReport.notarize("http://www.dailymail.co.uk/sport/football/article-5270781/Henrikh-Mkhitaryan-arrives-hotel-despite-Man-Utd-doubtss.html");
    //     // console.log(fraudReport.getProofCount());
    //     Assert.equal(2, fraudReport.getProofCount(), "Well done");
    //     fraudReport.notarize("http://www.dailymail.co.uk/sport/football/article-5270781/Henrikh-Mkhitaryan-arrives-hotel-despite-Man-Utd-doubtss.html");
    //     // console.log(fraudReport.getProofCount());
    //     Assert.equal(2, fraudReport.getProofCount(), "Well done");

    //     fraudReport.notarize("http://www.dailsymail.co.uk/sport/football/article-5270781/Henrikh-Mkhitaryan-arrives-hotel-despite-Man-Utd-doubtss.html");
    //     // console.log(fraudReport.getProofCount());
    //     Assert.equal(3, fraudReport.getProofCount(), "Well done");

    // }

    function testHasProof() public {
        var oldProof = fraudReport.checkUrl("https://www.contra.gr");
        Assert.isFalse(oldProof, "is false");
        fraudReport.notarize("https://www.contra.gr");
        Assert.equal(1, fraudReport.getProofCount(), "is false2");

        // var oldProof2 = fraudReport.checkUrl("https://www.contra.gr");
        // Assert.isTrue(oldProof2,"is true");
        // fraudReport.notarize("https://www.contra.gr");
        // Assert.equal(1, fraudReport.getProofCount(), "Well done");

        var oldProof3 = fraudReport.checkUrl("https://www.contra.grgr");
        Assert.isFalse(oldProof3, "is false3");
        fraudReport.notarize("https://www.contra.grgr");
        Assert.equal(2, fraudReport.getProofCount(), "Well done");
    }
}