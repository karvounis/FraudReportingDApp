import { Component, OnInit } from '@angular/core';
import { BlockchainService } from '../../services/blockchain.service';

@Component({
  selector: 'app-create-bounty',
  templateUrl: './create-bounty.component.html',
  styleUrls: ['./create-bounty.component.css']
})
export class CreateBountyComponent implements OnInit {
  ngOnInit() {}
  
  bountyAmount: string;

  constructor(private BlockchainService: BlockchainService) {
  }

  onSubmit() { 
    console.log('Create bounty');

   }
}
