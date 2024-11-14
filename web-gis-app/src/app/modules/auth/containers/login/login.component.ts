import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { fadeInUp400ms } from '@shared/animations/fade-in-up.animation';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@core/api/services/account.service';
import { finalize, take, tap } from 'rxjs';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  animations: [fadeInUp400ms],
})
export class LoginComponent implements OnInit {
  form!: UntypedFormGroup;
  loading!: boolean;

  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  signIn(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;
    const { email, password } = this.form.getRawValue();
    const redirectUrl =
      this.route.snapshot.queryParams.redirectUrl || '/dashboard';

    const payload = {
      email: email,
      password: password,
    };
    console.log(payload);
    //this.router.navigateByUrl(redirectUrl);
    // console.log(payload);

    this.accountService
      .login(payload)
      .pipe(
        take(1),
        finalize(() => {
          this.loading = false;
        }),
        tap((response) => {
          console.log('response', response);
          this.authService.setUserLoggedInAccount(response);
          this.router.navigateByUrl(redirectUrl);
        })
      )
      .subscribe();
  }
}
