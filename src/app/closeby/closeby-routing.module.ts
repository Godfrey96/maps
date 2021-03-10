import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClosebyPage } from './closeby.page';

const routes: Routes = [
  {
    path: '',
    component: ClosebyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClosebyPageRoutingModule {}
