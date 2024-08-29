import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ProfileService } from 'src/app/features/profile/services/profile.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-task-scheduler',
  templateUrl: './add-task-scheduler.component.html',
  styleUrls: ['./add-task-scheduler.component.css']
})
export class AddTaskSchedulerComponent implements OnInit {

  value: any;
  serverlist: any;
  taskAddSchedulerArr: any = [];
  SetApplicationTypeArr: any = [];
  taskSchedulerForm: FormGroup;
  userID: any;
  public settings = {};
  public selectedItems = [];
  public Application = {};

  constructor(
    public _profileService: ProfileService,
    public _shared: SharedService,
    private fb: FormBuilder,
    private _router: Router

  ) { }

  ngOnInit(): void {

    this.settings = {
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
      searchPlaceholderText: 'Tìm kiếm',
      noDataAvailablePlaceholderText: 'No Data Avaialable',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };

    this.Application = {
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
      searchPlaceholderText: 'Tìm kiếm',
      noDataAvailablePlaceholderText:'No Data Available',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };

    let userDetail = JSON.parse(localStorage.getItem('userDetails') || '{}');
    this.userID = userDetail.userId;

    this.getApplicationTypes();
    this.getTaskServers();
    this.initializeForm();
  }

  initializeForm() {
    this.taskSchedulerForm = new FormGroup({
      taskSchedulerName: new FormControl(''),
      validFrom: new FormControl(''),
      validTo: new FormControl(''),
      servers: new FormControl([]),
      applications: new FormControl([]),
      status: new FormControl(true),
      description: new FormControl('')
    });
  }
  

  getFormValues() {
    console.log(this.taskSchedulerForm.value);
  }

  //----text-editor-TS
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
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
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

  //---ADD TASK SCHEDULAR---
  addTaskScheduler() {
    let body = {
      userId: this.userID,
      taskSchedulerName: this.taskSchedulerForm.value.taskSchedulerName,
      taskValidFrom: this.taskSchedulerForm.value.validFrom,
      taskValidTo: this.taskSchedulerForm.value.validTo,
      serverId: this.taskSchedulerForm.value.servers.length ? this.taskSchedulerForm.value.servers[0].serverId : null,
      applicationName: this.taskSchedulerForm.value.applications.length ? this.taskSchedulerForm.value.applications[0].id : null,
      taskDescription: this.taskSchedulerForm.value.description,
      isEnable: this.taskSchedulerForm.value.status
    }
    console.log(body);
    this._profileService.addTaskScheduler(body).subscribe((res: any) => {
      this.taskAddSchedulerArr = res['data'];
      if (res.success) {
        this._shared.ToastPopup('', res.message, 'success');
        this._router.navigate(['/settings/edit-task-scheduler'])
      }
      console.log(this.taskAddSchedulerArr, 'this.taskAddSchedulerArr');
    }, err => {
      console.log("err", err);
    })
  }
  

  //--Server Task--API
  getTaskServers() {
    let body = {
      "userId": this.userID
    }
    this._profileService.getTaskServers(body).subscribe((res: any) => {
      console.log("ser", res.data)
      this.serverlist = res.data;
    })
  }

  //---Get-Applications-API----
  getApplicationTypes() {
    let body = {
      "userId": this.userID
    }
    this._profileService.getApplicationTypes(body).subscribe((res: any) => {
      this.SetApplicationTypeArr = res['data'];
      console.log(this.SetApplicationTypeArr, 'SetApplicationTypeArr');
    })
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
