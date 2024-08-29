
import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor/lib/config';
import { ProfileService } from 'src/app/features/profile/services/profile.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
 
 
@Component({
  selector: 'app-add-alarms-triggers',
  templateUrl: './add-alarms-triggers.component.html',
  styleUrls: ['./add-alarms-triggers.component.css']
})
export class AddAlarmsTriggersComponent implements OnInit {
  settings: IDropdownSettings = {};
  selectedItems: any = [];
  alarmAndTriggerArr: any;
  mapForm: FormGroup;
  submitted: any;
  value: any;
  is_task_scheduler: boolean = false;
  is_application: boolean = false;
  is_error_code: boolean = false;
  is_email: boolean = false;
  serverlist: any = [];
  userID: any;
  form: FormGroup;
  servernamelist: any;
  serverstatuslist: any;
  taskGetSchedulerArr: any;
  taskSchedularlist: any[];
  applicationtypelist: any;
  applicationNamelist: any;
 
  constructor(
    private fb: FormBuilder,
    public profileservive: ProfileService,
    private _router: Router,
    public _shared: SharedService,
  ) { }
 
  ngOnInit(): void {
 
 
    let userDetail = JSON.parse(localStorage.getItem('userDetails') || '{}');
    this.userID = userDetail.userId;
 
    this.getServers();
    this.mapAlarmForm();
    this.serverNames()
    this.statusNames()
    this.getTaskScheduleder()
    this.applicationType()
    //this.applicationName()
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
      noDataAvailablePlaceholderText:'select server',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };
  }
 
  mapAlarmForm() {
    this.mapForm = new FormGroup({
      alarmName: new FormControl(''),
      servers: new FormControl([]),
      serverName: new FormControl(''),
      status: new FormControl(true),
      errorCode: new FormControl(''),
      email: new FormControl(true),
      to: new FormControl(''),
      cc: new FormControl(''),
      bcc: new FormControl(''),
      description: new FormControl(''),
      attachmentType: new FormControl(''),
    });
  }
 
  getFormValues() {
    console.log(this.mapForm.value);
  }
 
  server_name(evt: any) {
    console.log("evt", evt.value);
    let value = evt.value;
    if (value === "1") {
      this.is_task_scheduler = true;
      this.is_application = false;
      console.log(this.is_task_scheduler);
    } else {
      this.is_application = true;
      this.is_task_scheduler = false;
    }
  }
 
  status_name(evt: any) {
    console.log("evt", evt.value);
    let value = evt.value;
    if (value === "error") {
      this.is_error_code = true;
    } else {
      this.is_error_code = false;
    }
  }
 
  emailChecked(evt: any) {
    console.log("evt", evt.value);
    let is_checked = evt.checked;
    console.log(evt.checked);
    if (is_checked === true) {
      this.is_email = true;
    } else {
      this.is_email = false;
    }
  }
 
  //---Text-editor
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '15rem',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here',
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
 
  attachments: string[] = ['Error log', 'Health Check-up', 'File Summary'];
  selectedAttachments: string[] = [];
  dropdownOpen: boolean = false;
 
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
 
  toggleAttachment(attachment: string) {
    const index = this.selectedAttachments.indexOf(attachment);
    if (index === -1) {
      this.selectedAttachments.push(attachment);
    } else {
      this.selectedAttachments.splice(index, 1);
    }
  }
 
  isSelected(attachment: string): boolean {
    return this.selectedAttachments.includes(attachment);
  }
 
  ////////////////////////////////////////////////
 
  //----------------------------------------------------------------
  addAlarmAndTrigger() {
    let body = {
      userId: this.userID,
      AlarmName: this.mapForm.value.alarmName,
      serverId: this.mapForm.value.servers[0].serverId,
      ServerNameId: this.mapForm.value.serverName || 1,
      ServerStatusId: this.mapForm.value.status,
      TaskSchedulerId: this.mapForm.value.TaskSchedulerId,
      ApplicationTypeId:this.mapForm.value.ApplicationTypeId,
      ApplicationId: this.mapForm.value.ApplicationId,     
      ErrorCode: this.mapForm.value.errorCode,
      IsEmail: this.mapForm.value.email,
      EmailTo: this.mapForm.value.to,
      EmailCc: this.mapForm.value.cc,
      EmailBcc: this.mapForm.value.bcc,
      EmailDescription: this.mapForm.value.description,
      EmailAttachment: this.mapForm.value.attachmentType,
      IsSent:this.mapForm.value.IsSent
    }
    console.log("....", body)
    this.profileservive.addAlarmAndTrigger(body).subscribe((res: any) => {
      this.alarmAndTriggerArr = res['data'];
      if (res.success) {
        this._shared.ToastPopup('', res.message, 'success');
        this._router.navigate(['/settings/alarm-triggers']);
      }
      console.log(this.alarmAndTriggerArr, 'this.alarmAndTriggerArr');
    }, err => {
      console.log("err", err);
    })
  }
 
 
  getServers() {
    let body = {
      "userId": this.userID
    }
    this.profileservive.getServers(body).subscribe((res: any) => {
      console.log("ser", res.data)
      this.serverlist = res.data;
      this.selectedItems = [...this.serverlist];
    })
  }
 
 
  serverNames() {
    let body = {
      "userId": this.userID
    }
    this.profileservive.getServerName(body).subscribe((res: any) => {
      console.log("ser", res.data)
      this.servernamelist = res.data;
 
    })
  }
 
  statusNames() {
    let body = {
      "userId": this.userID
    }
    this.profileservive.getStatusName(body).subscribe((res: any) => {
        console.log("ser", res.data)
        this.serverstatuslist = res.data;
 
      })
    }
 
   getTaskScheduleder(){
    let body = {
      "userId": this.userID
      // "userId": 2
    
    }
    console.log(body);
    this.profileservive.getTaskScheduled(body).subscribe((res: any) => {
    
      this.taskGetSchedulerArr = res.data;
      this.taskSchedularlist = [...res['data']];
    
      console.log(this.taskGetSchedulerArr, 'this.taskGetSchedulerArr');
      
    })
   }
  
   applicationType() {
    let body = {
      "userId": this.userID
    }
    this.profileservive.getAlarmApplicationTypes(body).subscribe((res: any) => {
        console.log("ser", res.data)
        this.applicationtypelist = res.data;
 
      })
    }
 
    applicationName() {
      let body = {
        "userId": this.userID
      }
      this.profileservive.getApplicationTypes(body).subscribe((res: any) => {
          console.log("ser", res.data)
          this.applicationNamelist = res.data;
  
        })
      }
 
  //-------------------------------------------
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
 