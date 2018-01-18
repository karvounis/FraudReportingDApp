import { Injectable } from '@angular/core';
// Import the page's CSS. Webpack will know what to do with it.
import {Subject} from 'rxjs/Rx';
import { retry } from 'rxjs/operator/retry';

// Import libraries we need.
const Web3 = require('web3');
const contract = require('truffle-contract');
const fraud_reporting_artifacts = require('../../../build/contracts/FraudReporting.json');

/*
 * When you compile and deploy your Voting contract,
 * truffle stores the abi and deployed address in a json
 * file in the build directory. We will use this information
 * to setup a Voting abstraction. We will use this abstraction
 * later to create an instance of the Voting contract.
 * Compare this against the index.js from our previous tutorial to see the difference
 * https://gist.github.com/maheshmurthy/f6e96d6b3fff4cd4fa7f892de8a1a1b4#file-index-js
 */
@Injectable()
export class BlockchainService {
  private web3: any;
  public accounts: string[];
  public ready = false;
  public MetaCoin: any;
  public accountsObservable = new Subject<string[]>();
  
  FraudReporting = contract(fraud_reporting_artifacts);
  candidates = {};
  tokenPrice = null;


  constructor() {
    if (typeof this.web3 !== 'undefined') {
      this.web3 = new Web3(this.web3.currentProvider);
    } else {
      this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    }
    this.FraudReporting.setProvider(this.web3.currentProvider);
 }

  public async getAccounts() {
    this.web3.eth.getAccounts((err, accs) => {
      this.accounts = accs;
      this.accountsObservable.next(accs);
    });
  }

  public getAccountsOfWeb3() {
    return this.web3.eth.accounts;
  }

  public async getBountiesCounter() {
    this.FraudReporting.deployed().then( (contractInstance) => {
      contractInstance.bountiesCounter.call().then( (bountiesCounter) => {
        return bountiesCounter.toString();
      });
    })
  }

  public async getBalanceForAccountAddress(address) {
    return this.web3.fromWei(this.web3.eth.getBalance(address).toString());
  }

  public async getFraudReportingContract() {
    return this.FraudReporting.deployed();
  }

  public rewardBounty(fraudReportId: number, fromAddress: string, etherReward) {
    this.FraudReporting.deployed().then( (contractInstance) => {
      contractInstance.rewardBountyToFraudReport(fraudReportId, {from: fromAddress, value: etherReward * 10**18, gas:4000000}).then( (res) => {
        console.log(res);
      }).catch(error=> console.error(error));
    })
  }
}
