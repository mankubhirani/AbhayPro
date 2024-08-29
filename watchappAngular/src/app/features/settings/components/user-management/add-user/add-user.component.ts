import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from 'src/app/features/profile/services/profile.service';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  Admin_ID: number = 1; // Set Admin_ID to 1
  userForm: FormGroup;
 
  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private toastr: ToastrService,
    private router: Router
  ) {}
 
  ngOnInit(): void {
    this.userForm = this.fb.group({
      Admin_id: [this.Admin_ID],  
      user_name: ['', Validators.required],  
      mobile_no: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      role_type: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      Password: ['', Validators.required],
      reporting_manager: ['']
    });
  }
 
  onSubmit(): void {
    if (this.userForm.valid) {
      let payload = {
        Admin_id: this.Admin_ID,
        user_name: this.userForm.value.user_name,
        mobile_no: this.userForm.value.mobile_no,
        role_type: this.userForm.value.role_type,
        email: this.userForm.value.email,
        Password: this.userForm.value.Password,
        reporting_manager: this.userForm.value.reporting_manager
      };
 
      this.profileService.createUser(payload).subscribe(
        response => {
          console.log('User created successfully:', response);
          this.toastr.success('User created successfully', 'Success');
          // Navigate to user management component after adding
          this.router.navigate(['/settings/user-management']);
        },
        error => {
          console.error('Error creating user:', error);
          this.toastr.error('Error creating user', 'Error');
        }
      );
    } else {
      console.log('Form is invalid');
      this.toastr.error('Form is invalid', 'Error');
    }
  }
 
  onSaveAndNew(): void {
    if (this.userForm.valid) {
      let payload = {
        Admin_id: this.Admin_ID,
        user_name: this.userForm.value.user_name,
        mobile_no: this.userForm.value.mobile_no,
        role_type: this.userForm.value.role_type,
        email: this.userForm.value.email,
        Password: this.userForm.value.Password,
        reporting_manager: this.userForm.value.reporting_manager
      };
 
      this.profileService.createUser(payload).subscribe(
        response => {
          console.log('User created successfully:', response);
          this.toastr.success('User created successfully', 'Success');
          // Clear the form fields after successful submission
          this.userForm.reset({
            Admin_id: this.Admin_ID
          });
        },
        error => {
          console.error('Error creating user:', error);
          this.toastr.error('Error creating user', 'Error');
        }
      );
    } else {
      console.log('Form is invalid');
      this.toastr.error('Form is invalid', 'Error');
    }
  }
 
  onCancel(): void {
    // Clear the form fields
    this.userForm.reset({
      Admin_id: this.Admin_ID
    });
    // Navigate to user management component
    this.router.navigate(['/settings/user-management']);
  }
}