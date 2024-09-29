import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ProfileComponent } from './containers/account-detail/account-detail.component';

@NgModule({
  declarations: [ProfileComponent, ChangePasswordComponent],
  imports: [CommonModule, ProfileRoutingModule, SharedModule]
})
export class ProfileModule {}
