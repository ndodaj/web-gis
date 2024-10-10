import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { fadeInUp400ms } from '@shared/animations/fade-in-up.animation';
import { AccountService } from '@core/api/services/account.service';
import { finalize, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  animations: [fadeInUp400ms],
})
export class LoginComponent implements OnInit {
  form!: UntypedFormGroup;
  loading!: boolean;

  constructor(
    private fb: UntypedFormBuilder,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  signIn(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;
    const { username, password } = this.form.getRawValue();
    // const redirectUrl =
    //   this.route.snapshot.queryParams.redirectUrl || '/dashboard';

    const payload = {
      username: username,
      password: password,
    };

    console.log(payload);

    this.accountService
      .login(payload)
      .pipe(
        take(1),
        finalize(() => {
          this.loading = false;
        }),
        tap((response) => {
          console.log('response', response);
        })
      )
      .subscribe();
  }
}
