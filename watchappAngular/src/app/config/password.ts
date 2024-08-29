import { FormGroup} from "@angular/forms";


// export function passwordMatch(password: string, confirm_password: string) {
//     return function (form: AbstractControl) {
//         const passwordvalue = form.get(password)?.value
//         const confirmPasswordvalue =form.get(confirm_password)?.value

//         if (passwordvalue === confirmPasswordvalue) {
//             return null;
//         }  
//             return { passwordMismatchError: true }

//     }
// }


export function passwordMatchValidator(formGroup: FormGroup<any>) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirm_password')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirm_password')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirm_password')?.setErrors(null);
    }
}