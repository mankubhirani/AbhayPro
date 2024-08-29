import { Component, OnInit, HostListener, QueryList, ViewChildren } from '@angular/core';
import { Chart } from 'chart.js';
import { ProfileService } from "src/app/features/profile/services/profile.service";
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-iis-server-status',
  templateUrl: './iis-server-status.component.html',
  styleUrls: ['./iis-server-status.component.css']
})
export class IisServerStatusComponent implements OnInit {



  chart:any;
  ServerIPadress:any;
  status: boolean = false;
  selectAll = false;
  isDropdownOpen3 = false;
  userID: any;
  getServerStatusArr: any = [];
  filteredServerStatusArr: any = [];
  itemsPerPageIIS: number = 10;
  currentPageIIS: number = 1;
  totalPagesIIS: number = 0;
  totalCount: number = 0;
  isLoading: boolean = false;
  searchQuery: string = '';
  serverIp:any;
  fromDate:any;
  toDate:any;

  columnsIIS = {
    serial_number:true,
    site_name: true,
    site_path: true,
    server_state: true,
    application_pool: true,
    server_bindings: true,
    last_checked: true,
  };

  allColumnsHidden: boolean = false;
  p: string|number|undefined;

  constructor(private _profileService: ProfileService) {}

  ngOnInit(): void {
    const userDetail = JSON.parse(localStorage.getItem('userDetails') || '{}');
    this.userID = userDetail.userId;
    this.getServerStatus();
    this.getTaskDetailsGraph();
    this.GetServerIp();
  }

  getIISServerIp(e: any) {
    this.serverIp = e.target.value;
  }


  searchWithServerIp() {
    
    this.getServerStatus();
  }

  getServerStatus(): void {
    this.isLoading = true;
    let body: any = { 
      user_id: this.userID, 
      PageNumber: this.currentPageIIS, 
      RowsPerPage: this.itemsPerPageIIS 
    };
    if (this.serverIp) {
      body.serveripaddress = this.serverIp;
    }
    if (this.fromDate) {
      body.fromdate = this.fromDate;
    }
    if (this.toDate) {
      body.todate = this.toDate;
    }
    if (this.status) {
      body.status = this.status;
    }
    this._profileService.getISSServerStatus(body).subscribe((res: any) => {
      this.getServerStatusArr = res.data;
      this.filteredServerStatusArr = res.data; // Initialize filtered array
      this.totalCount = res.totalCount;
      this.totalPagesIIS = Math.ceil(this.totalCount / this.itemsPerPageIIS);
      this.isLoading = false;
      this.updateVisibilityStatus();
    });
  }


  GetServerIp(): void {
    const body = { UserId: this.userID };
    this._profileService.getServerIP(body).subscribe((res: any) => {
      this.ServerIPadress = res.data;
    });
  }
  renderChart(data: any) {
    const labels = data.map((item: any) => item.taskname);
    const values = data.map((item: any) => item.avg_cpu_usage);
    const colors = data.map((item: any) =>
      item.status === "Ready"
        ? "green"
        : item.status === "Disabled"
        ? "red"
        : "gray"
    );
    const ready = data.map((items: any) =>
      items.status === "Ready"
        ? "green"
        : items.status === "Disabled"
        ? "green"
        : "gray"
    );
    // Destroy existing chart if it exists
    // if (this.chart) {
    //   this.chart.destroy();
    // }

    this.chart = new Chart("pieeeeChart", {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Disabled",
            data: values,
            borderWidth: 1,
            backgroundColor: colors,
          },
          {
            label: "Ready",
            data: values, // Use same or different data if needed
            borderWidth: 1,
            backgroundColor: ready,
            hidden: true, // This dataset will not be displayed
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 50,
            title: {
              text: "CPU Usage",
              display: true,
            },
          },
          x: {
            title: {
              display: true,
              text: "App Name",
            },
          },
        },
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || "";
                const value = context.raw as number;
                const index = context.dataIndex;
                const taskName = labels[index];
                const task =
                  data.find((item: any) => item.taskname === taskName) || {};
                return `${label}: ${value}\nStatus: ${task.status || "N/A"}`;
              },
            },
          },
        },
      },
    });
  }

  getTaskDetailsGraph() {
    let body;
   
      body = {
        userId: this.userID,
        
      };
    

    this._profileService.getTaskDetailsGraph(body).subscribe((res: any) => {
      const chartData = res.data;
      this.renderChart(chartData);
    });
  }

  showCheckboxes() {
    this.status = !this.status;
  }

  toggleAllCheckboxes(event: any) {
    const isChecked = event.target.checked;
    for (let key in this.columnsIIS) {
      this.columnsIIS[key] = isChecked;
    }
    this.updateVisibilityStatus();
  }

  toggleColumn(column: string) {
    this.columnsIIS[column] = !this.columnsIIS[column];
    this.updateVisibilityStatus();
  }

  updateVisibilityStatus() {
    this.allColumnsHidden = !Object.values(this.columnsIIS).some(value => value);
  }

  searchTask() {
    this.filteredServerStatusArr = this.getServerStatusArr.filter((task: any) =>
      task.sitename.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      task.sitepath.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      task.serverstate.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      task.applicationpool.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      task.serverbindings.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      task.lastchecked.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onSearchChange() {
    this.searchTask();
  }

  updateItemsPerPageIIS(event: any) {
    this.itemsPerPageIIS = parseInt(event.target.value, 10);
    this.getServerStatus();
  }

  nextIIS() {
    if (this.currentPageIIS < this.totalPagesIIS) {
      this.currentPageIIS++;
      this.getServerStatus();
    }
  }

  prevIIS() {
    if (this.currentPageIIS > 1) {
      this.currentPageIIS--;
      this.getServerStatus();
    }
  }

  exportToExcel() {
    const dataToExport = this.filteredServerStatusArr.map((item: any, index: number) => ({
      "S. No": index + 1,
      "Site Name": item.sitename,
      "Site Path": item.sitepath,
      "Server State": item.serverstate,
      "Application Pool": item.applicationpool,
      "Server Bindings": item.serverbindings,
      "Last Checked": item.lastchecked,
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'IIS_Server_Status.xlsx');
  }
}
