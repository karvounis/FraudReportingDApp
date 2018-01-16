var FraudReporting = artifacts.require("./FraudReporting.sol");

module.exports = function(deployer) {
    deployer.deploy(FraudReporting);
};