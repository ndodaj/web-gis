import { HttpErrorResponse } from '@angular/common/http';

import { ApiErrorResponse } from './api-error-response';

export type AppErrorResponse = HttpErrorResponse & { error?: ApiErrorResponse };
