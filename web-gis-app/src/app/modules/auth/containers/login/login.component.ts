import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInUp400ms } from '@shared/animations/fade-in-up.animation';
import { AccountService } from '@core/api/services/account.service';
import { finalize, take, tap } from 'rxjs/operators';
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
    private accountService: AccountService,
    private route: ActivatedRoute,
    private authService: AuthService
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
    const redirectUrl =
      this.route.snapshot.queryParams.redirectUrl || '/dashboard';

    const payload = {
      username: username,
      password: password,
      provider: 'db',
      refresh: true,
    };

    this.accountService
      .login(payload)
      .pipe(
        take(1),
        finalize(() => {
          this.loading = false;
        }),
        tap((response) => {
          this.authService.setUserLoggedInAccount(response);
          this.accountService
            .getCurrentUser()
            .pipe(
              take(1),
              tap((res) => {
                this.authService.setUserLoggedInRoles(res?.data.roles[0]);
                this.router.navigateByUrl(redirectUrl);
              })
            )
            .subscribe();
        })
      )
      .subscribe();
  }
}
