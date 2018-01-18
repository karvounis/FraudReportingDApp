import { Component } from '@angular/core';
// Import libraries we need.
import { BlockchainService } from '../../services/blockchain.service';
import { setInterval } from 'timers';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  //members
  accounts: string[];
  FraudReporting: any;
  status = '';
  selectedAccount = '';
  balance;
  bountiesCounter;
  bountyAmount;
  fraudReportUrl;
  fraudReportBountyId;
  fraudReportsCounter;
  fraudReportIdReward;
  etherReward;

  acts = [];
  constructor(private BlockchainService: BlockchainService) {
    this.watchAccount();
    this.BlockchainService.getAccounts();
    
    setInterval(() => {this.refreshAccountsAndBalances()}, 10000);
    setInterval(() => {this.refreshBountiesCounter()}, 5000);
    setInterval(() => {this.refreshFraudReportsCounter()}, 4000);
  }

  watchAccount() {
    this.BlockchainService.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      for (let account of accounts) {
        let data = {
          'address': account,
          'balance': 0
        }
        this.acts.push(data);
      }
    });
  }
  
  refreshBountiesCounter() {
    this.BlockchainService.getFraudReportingContract().then((contractInstance) => {
      contractInstance.bountiesCounter.call().then((res) => {
        this.bountiesCounter = res.toString();
      }).catch(error=> console.error(error));
      });
  }

  refreshFraudReportsCounter() {
    this.BlockchainService.getFraudReportingContract().then((contractInstance) => {
      contractInstance.fraudReportsCounter.call().then((res) => {
        this.fraudReportsCounter = res.toString();
      }).catch(error=> console.error(error));
      });
  }

  refreshAccountsAndBalances() {
    let accounts = this.BlockchainService.getAccountsOfWeb3();
    this.acts = [];
    for (let account of accounts) {      
      this.BlockchainService.getBalanceForAccountAddress(account).then((res) => {
        let data = {
          'address': account,
          'balance': res
        }
        this.acts.push(data);
      });
    }
  }

  createBounty() { 
    console.log('Create bounty');
    this.BlockchainService.getFraudReportingContract().then((contractInstance) => {
      contractInstance.createBounty(this.bountyAmount * 10**18, {from: this.selectedAccount}).then( (res) => {
        console.log(res);
      }).catch(error=> console.error(error));
    })
   }
   
  createFraudReport() {
    console.log('Create fraud report');
    this.BlockchainService.getFraudReportingContract().then((contractInstance) => {
      contractInstance.createFraudReport(this.fraudReportUrl, this.fraudReportBountyId, {from: this.selectedAccount, gas:4000000}).then( (res) => {
        console.log(res);
      }).catch(error=> console.error(error));
    })
  }
  
  rewardBountyToFraudReport() {
    console.log('Reward bounty');
    this.BlockchainService.rewardBounty(this.fraudReportIdReward, this.selectedAccount, this.etherReward);
  }

  getAllFraudReports() {
    this.BlockchainService.getFraudReportingContract().then((contractInstance) => {
      contractInstance.fraudReportsCounter.call().then((res) => {
        console.log(res)
        this.fraudReportsCounter = res.toString();
      }).catch(error=> console.error(error));
      });
  }

  accountSelected() {
    console.log('Change account noticed');
    this.BlockchainService.getBalanceForAccountAddress(this.selectedAccount).then((res) => {
      this.balance = res;
    });
  }
};
