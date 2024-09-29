import { FormGroup, ValidationErrors } from '@angular/forms';

export function PasswordMatchValidator(
  group: FormGroup
): ValidationErrors | undefined | null {
  const formGroupArray = Object.values(group.controls);
  const currentPassword = formGroupArray[0];
  const confirmPassword = formGroupArray[1];

  if (confirmPassword?.errors && !confirmPassword?.errors?.notSame) {
    return;
  }

  if (currentPassword?.value !== confirmPassword?.value) {
    confirmPassword?.setErrors({ notSame: true });
    return { notSame: true };
  } else {
    confirmPassword?.setErrors(null);
  }

  return null;
}
