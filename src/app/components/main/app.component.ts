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

  acts = [];
  constructor(private BlockchainService: BlockchainService) {
    console.log("HELLO");
    this.watchAccount();
    this.BlockchainService.getAccounts();
    
    setInterval(() => {this.refreshAccountsAndBalances()}, 500);
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
    this.BlockchainService.createBounty(this.bountyAmount, this.selectedAccount);
   }
   
  createFraudReport() {
    console.log('Create fraud report');
    this.BlockchainService.createFraudReport(this.fraudReportUrl, this.fraudReportBountyId, this.selectedAccount);
  }

  accountSelected() {
    console.log('Change account noticed');
    this.BlockchainService.getBalanceForAccountAddress(this.selectedAccount).then((res) => {
      this.balance = res;
    });
  }
};
