import { Component, OnInit, HostListener , ViewChildren,QueryList} from '@angular/core';
import { ProfileService } from "src/app/features/profile/services/profile.service";
import { AfterViewInit, ElementRef, Renderer2 } from '@angular/core';


@Component({
  selector: 'app-database-health-status',
  templateUrl: './database-health-status.component.html',
  styleUrls: ['./database-health-status.component.css']
})
export class DatabaseHealthStatusComponent implements OnInit {
searchWithMSSQLServerIp: any;
searchWithServerIp() {
throw new Error('Method not implemented.');
}
ServerIPadress: any;
fromDate: any;
getIISServerIp($event: Event) {
throw new Error('Method not implemented.');
}

  status = false;
  selectAll = false;
  isDropdownOpen3 = false;
  userID: any;
  getDatabaseHealthStatusArr: any;
  itemsPerPage:number = 7;
  p: any = 1;



  columns = {
    DatabaseName: true,
    DatabaseStatus: true,
    InstanceStatus: true,
    TotalCPUUsageInMilliseconds: true,
    TotalMemoryUsageInMB: true,
    NumberOfReads: true,
    NumberOfWrites: true ,
    TotalSizeMB: true,
    UsedSpaceMB: true ,
    FreeSpaceMB: true,
    LastBackupDate: true,
    BackupSizeMB : true,
    BackupStatus: true,
    RestoreDate: true,
    LogSizeMB: true ,
    LogSpaceUsedMB: true,
    LogSpaceUsedPercent: true,
    PointInTimeRecoveryName : true,
    PointInTimeRecoveryDate: true,
    last_checked: true,
  };
  allColumnsHidden: boolean = false;
toDate: any;
  constructor(public _profileService: ProfileService,
    private el: ElementRef, private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    const userDetail = JSON.parse(localStorage.getItem('userDetails') || '{}');
    this.userID = userDetail.userId;
    this.getDatabaseHealthStatusServer();
  }

  toggleColumn(column: string) {
    this.columns[column] = !this.columns[column];
    this.checkAllColumnsHidden();
  }

  checkAllColumnsHidden() {
    this.allColumnsHidden = Object.values(this.columns).every(value => !value);
  }
  @ViewChildren('checkbox') checkboxes!: QueryList<any>;

  toggleAllCheckboxes(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    Object.keys(this.columns).forEach(column => {
      this.columns[column] = isChecked;
    });
    this.checkAllColumnsHidden();
  }
  toggleColumnVisibility(index: number): void {
    this.columns[index].visible = !this.columns[index].visible;
  }

  showCheckboxes(): void {
    this.status = !this.status;
  }

  updateItemsPerPage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(target.value, 10);
  }

  toggleDropdown3(): void {
    this.isDropdownOpen3 = !this.isDropdownOpen3;
  }

  @HostListener("document:click", ["$event"])
  closeDropdown(event: MouseEvent){
    const target = event.target as HTMLElement;
    if (!target.closest(".dropbtn")) {
      this.status = false;
    }
  }

  getDatabaseHealthStatusServer(): void {
    const body = { user_id: this.userID };
    this._profileService.getDatabaseHealthStatus(body).subscribe((res: any) => {
      this.getDatabaseHealthStatusArr = res.data;
    });
}
ngAfterViewInit() {
  const accordions = this.el.nativeElement.querySelectorAll('.accordion');
  
  accordions.forEach((accordion: HTMLElement) => {
    this.renderer.listen(accordion, 'click', () => {
      accordion.classList.toggle('active');
      const panel = accordion.nextElementSibling as HTMLElement;
      
      if (panel.style.maxHeight) {
        panel.style.maxHeight = '';  // Set to an empty string instead of null
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}
}
