import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  FormArray,
  FormGroupDirective,
  NgForm,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { DashboardService } from '../../../services/dashboard.service';
@Component({
  selector: 'app-add-subscriber',
  templateUrl: './add-subscriber.component.html',
  styleUrls: ['./add-subscriber.component.css']
})
export class AddSubscriberComponent implements OnInit {
  contactsForm: FormGroup;
  userDetails: any;
  getAllCountry: any
  userfield: any = [];
  field = '';


  constructor(
    private formBuilder: FormBuilder,
    private _shared: SharedService,
    private _dashboard: DashboardService,
    private router: Router,
    private route: ActivatedRoute,

  ) { }

  ad() {
    this.userfield.push({ Column_Name: this.field, Column_Value: '' })
    // console.log('check', this.field);
    this.field = '';
  }

  ngOnInit(): void {
    this.userDetails = this._shared.getUserDetails();

    // console.log('user', this.userDetails);

    this._dashboard._getCountryApi().subscribe((res) => {
      this.getAllCountry = res;
      // console.log(" GET country ", this.getAllCountry);
      // Countries

    })

    this.contactsForm = this.formBuilder.group({


      contact_Email: new FormControl('', [Validators.required])

    });

    // this.contactsForm = new FormGroup({
    //   contacts: new FormArray([
    //     new FormGroup({
    //       contact_Email: new FormControl('', [Validators.required]),
    //       first_Name: new FormControl(''),
    //       last_Name: new FormControl(''),
    //       country: new FormControl(''),
    //       city: new FormControl(''),
    //       CompanyID: new FormControl(5),

    //     }),
    //   ]),
    // });
  }

  get contact() {
    return this.contactsForm.controls;
  }

  // get contacts(): FormArray {
  //   return this.contactsForm.get('contacts') as FormArray;
  // }
  // add() {
  //   this.contacts.push(
  //     new FormGroup({
  //       contact_Email: new FormControl('', [Validators.required]),
  //       first_Name: new FormControl(''),
  //       last_Name: new FormControl(''),
  //       country: new FormControl(''),
  //       city: new FormControl(''),
  //       CompanyID: new FormControl(5),

  //     })
  //   );

  // // console.log("tried",this.registerForm.value);
  // // console.log('pushed', this.education.value);
  // // console.log('pushed', this.educationForm.value);
  // }
  // remove(i: number) {
  //   this.contacts.removeAt(i);
  // }
  addContacts() {
    // console.log(JSON.stringify(this.userfield));



    let saveSubscribeData = {
      firstName: null,
      lastName: null,
      contact_Email: this.contactsForm.controls['contact_Email'].value,
      user_Details: this.userfield,



      // ...this.contactsForm.value,
      file_UploadId: 2,
      IsActive: 0,
      list_Id: 3,
      company_Id: this.userDetails.Company_Id,
      contact_Number: this.userDetails.UserPhoneNo
    }
    // console.log('check', JSON.stringify(saveSubscribeData));

    this._dashboard._postAddSubscriberApi(saveSubscribeData).subscribe((res: any) => {
      // console.log("Data Saved", res);
      this._shared.ToastPopup('', 'done', 'success');
      // if (res.data.success == true) {
      //   this.contactsForm.reset();
      //   this.router.navigateByUrl('/allContact')

      // } else {
      //   this._shared.ToastPopup('Email Already Exit', '', 'error');

      // }

    })

  }

}
