import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutocompletePage } from './autocomplete.page';

const routes: Routes = [
  {
    path: '',
    component: AutocompletePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutocompletePageRoutingModule {}
