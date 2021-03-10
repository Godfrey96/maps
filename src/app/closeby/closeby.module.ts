import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClosebyPageRoutingModule } from './closeby-routing.module';

import { ClosebyPage } from './closeby.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClosebyPageRoutingModule
  ],
  declarations: [ClosebyPage]
})
export class ClosebyPageModule {}
