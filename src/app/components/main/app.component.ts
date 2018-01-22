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
  selectedAccount;
  balance;
  bountiesCounter;
  bountyAmount;
  fraudReportUrl;
  fraudReportBountyId;
  fraudReportsCounter;
  fraudReportIdReward;
  etherReward;
  logs = [];

  newEthToEurPrice = 0;

  acts = [];
  constructor(private BlockchainService: BlockchainService) {
    this.watchAccount();
    this.BlockchainService.getAccounts();
    
    setInterval(() => {this.refreshAccountsAndBalances()}, 3000);
    setInterval(() => {this.refreshBountiesCounter()}, 2000);
    setInterval(() => {this.refreshFraudReportsCounter()}, 2000);
    setInterval(() => {this.refreshEthereumPrice()}, 1000);
  }

  refreshEthereumPrice() {
    this.BlockchainService.getPriceForCoin('ETH','EUR').subscribe((data) => {
      let body = data.text();  // If response is a JSON use json()
   if (body) {
        let bodyParsed = JSON.parse(body);
        let euroPrice = bodyParsed.EUR;
        this.newEthToEurPrice = euroPrice;
      }
    });
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
    this.BlockchainService.getBountiesCounter().then((res) => {
      this.bountiesCounter = res.toString();
    })
  }

  refreshFraudReportsCounter() {
    this.BlockchainService.getFraudReportsCounter().then((res) => {
        this.fraudReportsCounter = res.toString();
    }).catch(error=> console.error(error));
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
        this.bountiesCounter++;
        this.logToPage('Address ' + this.selectedAccount + ' successfully created a Bounty');
      }).catch(error=> console.error(error));
    })
   }
   
  createFraudReport() {
    console.log('Create fraud report');
    this.BlockchainService.getFraudReportingContract().then((contractInstance) => {
      contractInstance.createFraudReport(this.fraudReportUrl, this.fraudReportBountyId, {from: this.selectedAccount, gas:4000000}).then( (res) => {
        console.log(res);
        this.fraudReportsCounter++;
        this.logToPage('Address ' + this.selectedAccount + ' successfully created a Fraud report');
      }).catch(error=> console.error(error));
    })
  }
  
  rewardBountyToFraudReport() {
    console.log('Reward bounty');
    this.BlockchainService.rewardBounty(this.fraudReportIdReward, this.selectedAccount, this.etherReward).then( (res) => {
      console.log(res);
      this.logToPage('Address ' + this.selectedAccount + ' successfully rewarded ' + this.etherReward + ' to Fraud report id ' + this.fraudReportIdReward);
    }).catch(error=> console.error(error));
  }

  accountSelected() {
    console.log('Change account noticed');
    this.BlockchainService.getBalanceForAccountAddress(this.selectedAccount).then((res) => {
      this.balance = res;
    });
  }
  
  logToPage(message: string): void {
    this.logs.push(message);
  }

  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }
};
