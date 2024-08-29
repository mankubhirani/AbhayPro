import { Component, OnInit, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ProfileService } from 'src/app/features/profile/services/profile.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-map-server',
  templateUrl: './add-map-server.component.html',
  styleUrls: ['./add-map-server.component.css']
})
export class AddMapServerComponent implements OnInit {
  AddMapServerArr: any = [];
  submitted: any;
  userID: any;
    // Sign-up form group
  mapForm!: FormGroup;

  constructor(
    public _profileService: ProfileService,
    private fb  : FormBuilder,
    private _router: Router,
    private ngxService: NgxUiLoaderService,
    private _shared: SharedService,
  ) { }

  ngOnInit(): void {
    let addUserDetail = JSON.parse(localStorage.getItem('userDetails') || "{}");
    this.userID = addUserDetail.userId
    this.mapFunc();
  }

  getcontrol(name: any): AbstractControl | null {
    return this.mapForm.get(name);
  }
  
  mapFunc() {
    this.mapForm = this.fb.group({
     
      server_name: ['', [Validators.required]],
      // username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      server_ip: ['', [Validators.required]],
      server_description: ['', [Validators.required]],
     
    
    })
  }
  // Getter for accessing the form controls
  get f() {
   return this.mapForm.controls;
 }

 // Function to handle sign-up form submission
 submitmap() {
   this.submitted = true;

  

   // Check if the form is valid and submitted
   if (this.submitted && this.mapForm.valid) {

          // Prepare data to send to the API
          let body = {
            "user_id": this.userID,
            // user_id: 2,
            "server_ip": this.mapForm.controls['server_ip'].value,
            "server_description": this.mapForm.controls['server_description'].value,
            "server_name": this.mapForm.controls['server_name'].value,
          }
     
          // Call the sign-up API
          this.ngxService.start();
          this._profileService.postmapApi(body).subscribe(
            (res: any) => {
              // console.log("registered", res);
              this.ngxService.stop();
              if (res.success == true) {
                // Display success message and navigate to login page on successful registration
                this._shared.ToastPopup('Successfully', res.message, 'success');
                this._router.navigate(['/settings/map-server']);
                this.mapForm.reset();
              }
            }, (err) => {
              console.log("err",err);
              this.ngxService.stop();
     
              // Display error message if OTP is not found or there's an error in API call
              this._shared.ToastPopup('Please Enter Valid Data', '', 'error');
            })
        }
      }
      
      addServer() {
        if(this.mapForm.valid){
          this.AddMapServerArr.push({
            "server_ip": this.mapForm.controls['server_ip'].value,
            "server_description": this.mapForm.controls['server_description'].value,
            "server_name": this.mapForm.controls['server_name'].value,
            // You can also add other properties here as needed
          });
          this.mapForm.reset();
        }
        
      }
  
  // getAddMapServerDetail() {
    
  //   let userDetail = JSON.parse(localStorage.getItem('userDetails') || '{}');
  //   console.log(userDetail);

  //   let body = {
  //     // "userId": userDetail.userId
  //     "user_id": 4,
  //     "server_name": "My Serv12365487910",
  //     "server_ip": "192.168.1.108",
  //     "server_description": "Description of my server"
  //   }
  //   this._profileService.getAddMapServer(body).subscribe((res: any) => {

  //     this.AddMapServerArr = res['data'];

  //     console.log(this.AddMapServerArr, 'this.AddMapServerArr');

  //   })
  // }

  config: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: '15rem',
      minHeight: 'auto',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    sanitize: true,
    toolbarPosition: 'top',
};
}
