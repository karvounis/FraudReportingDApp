import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Rx';

const Web3 = require('web3');
const contract = require('truffle-contract');
const fraud_reporting_artifacts = require('../../../build/contracts/FraudReporting.json');

@Injectable()
export class BlockchainService {
  private web3: any;
  public accounts: string[];
  public accountsObservable = new Subject<string[]>();
  
  FraudReporting = contract(fraud_reporting_artifacts);

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
    const contractInstance = await this.FraudReporting.deployed();
    return await contractInstance.bountiesCounter.call();
  }

  public async getFraudReportsCounter() {
    const contractInstance = await this.FraudReporting.deployed();
    return await contractInstance.fraudReportsCounter.call();
  }

  public async getBalanceForAccountAddress(address) {
    return this.web3.fromWei(this.web3.eth.getBalance(address).toString());
  }

  public async getFraudReportingContract() {
    return this.FraudReporting.deployed();
  }

  public async rewardBounty(fraudReportId: number, fromAddress: string, etherReward) {
    const contractInstance = await this.FraudReporting.deployed();
    return await contractInstance.rewardBountyToFraudReport(fraudReportId, {from: fromAddress, value: etherReward * 10**18, gas:4000000});
    // this.FraudReporting.deployed().then( (contractInstance) => {
    //   contractInstance.rewardBountyToFraudReport(fraudReportId, {from: fromAddress, value: etherReward * 10**18, gas:4000000}).then( (res) => {
    //     console.log(res);
    //   }).catch(error=> console.error(error));
    // })
  }
}
