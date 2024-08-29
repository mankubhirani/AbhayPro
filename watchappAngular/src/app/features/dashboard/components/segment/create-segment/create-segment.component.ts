import { Component, OnInit } from '@angular/core';
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
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-create-segment',
  templateUrl: './create-segment.component.html',
  styleUrls: ['./create-segment.component.css']
})
export class CreateSegmentComponent implements OnInit {
  createSegment: any = FormGroup;
  userDetails: any;

  constructor(
    private formBuilder: FormBuilder,
    private _shared: SharedService,
    private _dashboard: DashboardService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.createSegment = new FormGroup({
      segmentName: new FormControl(''),
      fieldType: new FormControl(''),
      contactfieldType: new FormControl(''),
      FieldfindBy: new FormControl(''),
      criteria: new FormControl(''),
      segment: new FormArray([
        new FormGroup({
          fieldType: new FormControl(''),
          contactfieldType: new FormControl(''),
          FieldfindBy: new FormControl(''),
          criteria: new FormControl(''),
        }),
      ]),
    });
  this.userDetails = this._shared.getUserDetails();

  }
  get segmentVail() {
    return this.createSegment.controls;
  }

  get segment(): FormArray {
    return this.createSegment.get('segment') as FormArray;
  }
  add() {
    this.segment.push(
      new FormGroup({
        fieldType: new FormControl(''),
        contactfieldType: new FormControl(''),
        FieldfindBy: new FormControl(''),
        criteria: new FormControl(''),
      })
    );
  }
  remove(i: number) {
    this.segment.removeAt(i);
  }

  url(){
    this.router.navigateByUrl('/segment')
  }

  send() {
    let saveSegmentData = {
      segment_Id: 1,
      segmentName: this.createSegment.controls['segmentName'].value,
      criteria: this.createSegment.controls['criteria'].value,
      contactfieldType: this.createSegment.controls['contactfieldType'].value,
      FieldfindBy: this.createSegment.controls['FieldfindBy'].value,
      Is_And: 4,
      Is_Or: 4,
      IsActive: 1,
      UserId: this.userDetails.UserId,
      company_Id: 5,



    }
    // console.log(saveSegmentData);
    this._dashboard._postSegmentApi(saveSegmentData).subscribe((res) => {
      // console.log("Data Saved", res);
      // if(res.success==true){

      // }else{

      // }
      this._shared.ToastPopup(' Successfully', 'Save', 'success');
      this.createSegment.reset();
      this.router.navigate(['/segmentcriteria'])

    })


  }

}
