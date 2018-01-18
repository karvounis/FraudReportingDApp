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
      console.warn("Using web3 detected from external source like Metamask")
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(this.web3.currentProvider);
    } else {
      console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    }
    console.log("this.web3 in constructor = ", this.web3);
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
  // this.web3.eth.getBalance(address, (error, result) => {
  //   console.log("account balance", result)
  //   return result.toString();
  //   //$("#contract-balance").html(web3.fromWei(result.toString()) + " Ether");
  // });
}

}
