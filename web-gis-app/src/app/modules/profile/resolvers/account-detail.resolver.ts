import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AccountService } from '@core/api/services/account.service';

export const AccountDetailResolver: ResolveFn<any> = () => {
  const accountService = inject(AccountService);
  return accountService.getCurrentUser();
};
