import { NgModule } from '@angular/core';

import { LoginComponent } from './containers/login/login.component';

import { AuthRoutingModule } from './auth.routing';
import { SharedModule } from '@shared/shared.module';
import { SignUpComponent } from './containers/signup/signup.component';

@NgModule({
  declarations: [LoginComponent, SignUpComponent],
  imports: [AuthRoutingModule, SharedModule],
})
export class AuthModule {}
