import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { fadeInUp400ms } from '@shared/animations/fade-in-up.animation';
import { catchError, finalize, take, tap } from 'rxjs/operators';
import { AppResponseHandlerService } from '@core/services/app-response-handler.service';
import { ACTIVE_OPTIONS } from '@shared/constants/active-options';
import { PasswordMatchValidator } from '@shared/validators/password-match-validator';
import { AccountService } from '@core/api/services/account.service';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  animations: [fadeInUp400ms],
})
export class SignUpComponent implements OnInit {
  roles: any = [
    {
      id: 14,
      name: 'Infocenters, Guesthouses',
    },
    {
      id: 12,
      name: 'NGO',
    },
    {
      id: 2,
      name: 'Researchers',
    },
  ];
  form!: UntypedFormGroup;
  loading!: boolean;
  activeOptions = ACTIVE_OPTIONS;

  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    private accountService: AccountService,
    private snackBarService: MatSnackBar,
    private appResponseHandlerService: AppResponseHandlerService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      role_id: ['', Validators.required],
      username: ['', Validators.required],

      passwordForm: this.fb.group(
        {
          password: ['', Validators.required],
          confirmPassword: ['', Validators.required],
        },
        { validator: PasswordMatchValidator }
      ),
    });
  }

  signUp(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;
    const { first_name, last_name, username, email, role_id, passwordForm } =
      this.form.getRawValue();
    const redirectUrl = '/auth/login';

    const payload = {
      first_name,
      last_name,
      username,
      email,
      role_id,
      password: passwordForm.password,
    };

    this.accountService
      .signUp(payload)
      .pipe(
        take(1),
        finalize(() => {
          this.loading = false;
        }),

        this.appResponseHandlerService.handleErrorMessage(),
        tap((response) => {
          if (response) {
            this.router.navigateByUrl(redirectUrl);
          }
        }),
        catchError((err: HttpErrorResponse) => {
          // Handle the error here, for example, you can store the error message in a variable
          const errorMessage = err.error.message || 'An error occurred';

          // Open the snackbar here and return an empty observable
          this.snackBarService.open(errorMessage);
          return throwError(errorMessage);
        })
      )
      .subscribe();
  }

  // goToLoginPage() {
  //   this.router.navigate('/auth/login');
  // }
}
