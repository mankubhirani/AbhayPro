import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../profile/services/profile.service';

@Component({
  selector: 'app-file-summary-report',
  templateUrl: './file-summary-report.component.html',
  styleUrls: ['./file-summary-report.component.css']
})
export class FileSummaryReportComponent implements OnInit {
  p: any = 1;
  itemsPerPage: number = 7;
  displayColumns: any = {
    appName: true,
    fileName: true,
    filePath: true,
    fileSize: true,
    fileExtension: true,
    createdDate: true,
    remark: true
  };

  constructor(
    public _profileService: ProfileService,
  ) { }

  fileSummaryData: any = [];
  userID: any;

  ngOnInit(): void {
    let userDetail = JSON.parse(localStorage.getItem('userDetails') || '{}');
    this.userID = userDetail.userId;
    this.getFileSummary();
  }

  updateItemsPerPage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(target.value, 10);
  }

  getFileSummary() {
    let body = {
      "user_id": this.userID
    };
    this._profileService.getFileSummary(body).subscribe((res: any) => {
      this.fileSummaryData = res['data'];
    });
  }

  toggleColumn(column: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.displayColumns[column] = target.checked;
  }

  toggleAllColumns(event: Event): void {
    const target = event.target as HTMLInputElement;
    const allChecked = target.checked;
    for (const key in this.displayColumns) {
      if (this.displayColumns.hasOwnProperty(key)) {
        this.displayColumns[key] = allChecked;
      }
    }
  }

  displayAnyColumn(): boolean {
    return Object.values(this.displayColumns).some((value) => value === true);
  }
}
