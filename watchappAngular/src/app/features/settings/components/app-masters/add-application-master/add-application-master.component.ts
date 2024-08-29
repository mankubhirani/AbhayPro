import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ProfileService } from 'src/app/features/profile/services/profile.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-application-master',
  templateUrl: './add-application-master.component.html',
  styleUrls: ['./add-application-master.component.css']
})
export class AddApplicationMasterComponent implements OnInit {
  loadingUserArr: any
  value: any;
  addApplicationType: any;
  serverlis: any;
  operationAPIarray: any;
  SetApplicationType: any = [];
  applicationTypes: any = [];
  userID: any;
  public setting = {};
  public selectedItems = [];
  public Applications = {};
  public Operation = {};
  public addUserDrop ={};
  selectedFile: File | null = null; // Initialize selectedFile to null

  appForm: FormGroup;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: 'auto',
    maxHeight:'auto',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    enableToolbar: true,
  };

  constructor(
    public _profileservice: ProfileService,
    public _shared: SharedService,
    private fb: FormBuilder,
    private _router: Router
  ) {
    this.appForm = this.fb.group({
      appName: new FormControl(''),
      validFrom: new FormControl(''),
      validTo: new FormControl(''),
      servers: new FormControl([]),
      applications: new FormControl([]),
      status: new FormControl(true),
      description: new FormControl(''),
      Operation: new FormControl([]),
      applicationUser:new FormControl([]),
      appIcon: new FormControl(null), // Initialize appIcon in the form with null
    });
  }

  ngOnInit(): void {
    let userDetail = JSON.parse(localStorage.getItem('userDetails') || '{}');
    this.userID = userDetail.userId;

    this.getTaskServer();
    this.fetchApplicationTypes();
    this.getOperationAPI();
    this.loadingUsers();

    this.setting = {
      singleSelection: false,
      idField: 'serverId',
      textField: 'serverName',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Search',
      noDataAvailablePlaceholderText: 'No Data Available',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };

    this.Operation = {
      singleSelection: false,
      idField: 'oprationId',
      textField: 'oprationName',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Search',
      noDataAvailablePlaceholderText: 'No Data Available',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };

    this.Applications = {
      singleSelection: false,
      idField: 'id',
      textField: 'application_name',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Search',
      noDataAvailablePlaceholderText: 'No Data Available',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };

    this.addUserDrop = {
      singleSelection: false,
      idField: 'um_id',
      textField: 'um_email_id',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Search',
      noDataAvailablePlaceholderText: 'No Data Available',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };
  }

  addSetApplliaction() {
    let formData = new FormData();
    formData.append('user_Id', this.userID);
    formData.append('applicationName', this.appForm.value.appName);
    formData.append('validFrom', this.appForm.value.validFrom);
    formData.append('validTo', this.appForm.value.validTo);
    formData.append('serverId', this.appForm.value.servers[0]?.serverId);
    formData.append('operationId', this.appForm.value.Operation.map((op: any) => op.oprationId).join(','));
    formData.append('um_id', this.appForm.value.applicationUser.map((um:any)=> um.um_id).join(','));
    formData.append('applicationType', this.appForm.value.applications[0]?.id);
    formData.append('applicationDescription', this.appForm.value.description);
    formData.append('isEnable', this.appForm.value.status.toString());
    if (this.selectedFile) {
        formData.append('logo', this.selectedFile, this.selectedFile.name);
    }

    // Log the FormData content for debugging
    formData.forEach((value, key) => {
        console.log(key + ', ' + value);
    });

    this._profileservice.addApplication(formData).subscribe(
        (res: any) => {
            this.addApplicationType = res.data;
            console.log('Response:', res);
        },
        (err: any) => {
            console.error('Error adding application:', err);
        }
    );
}


  getTaskServer() {
    let body = {
      userId: this.userID
    };

    this._profileservice.getTaskServers(body).subscribe(
      (res: any) => {
        this.serverlis = res.data;
      },
      (err: any) => {
        console.error('Error fetching task servers:', err);
      }
    );
  }

  loadingUsers() {
    let body = {
      userId: this.userID
    };

    this._profileservice.getUserList(body).subscribe(
      (res: any) => {
        this.loadingUserArr = res.data;
      },
      (err: any) => {
        console.error('Error fetching user managament:', err);
      }
    );
  }

  getOperationAPI() {
    let body = {
      userId: this.userID
    };

    this._profileservice.getOprations(body).subscribe(
      (res: any) => {
        this.operationAPIarray = res.data;
      },
      (err: any) => {
        console.error('Error fetching operations:', err);
      }
    );
  }

  fetchApplicationTypes() {
    let body = {
      userId: this.userID
    };

    this._profileservice.getApplicationTypes(body).subscribe(
      (res: any) => {
        this.SetApplicationType = res.data;
      },
      (err: any) => {
        console.error('Error fetching application types:', err);
      }
    );
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.appForm.patchValue({ appIcon: this.selectedFile });
    }
  }

  public onFilterChange(item: any) {
    console.log(item);
  }

  public onDropDownClose(item: any) {
    console.log(item);
  }

  public onItemSelect(item: any) {
    console.log(item);
  }

  public onDeSelect(item: any) {
    console.log(item);
  }

  public onSelectAll(items: any) {
    console.log(items);
  }

  public onDeSelectAll(items: any) {
    console.log(items);
  }
}
