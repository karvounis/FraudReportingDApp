//angular imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

//components
import { AppComponent } from './components/main/app.component';

//services
import { BlockchainService } from './services/blockchain.service';

@NgModule({
  declarations: [ // components / directives / pipes
      AppComponent
  ],
  imports: [ // put all your modules here angular+ 3rd party
      BrowserModule,
      FormsModule,
      HttpModule
  ],
  providers: [ //services
      BlockchainService,
  ],
  bootstrap: [ // Components to be bootsrapped to main.ts (usually only one)
      [AppComponent]
  ]
})
export class AppModule { }
