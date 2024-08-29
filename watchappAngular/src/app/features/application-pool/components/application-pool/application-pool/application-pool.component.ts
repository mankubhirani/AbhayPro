import { Component, OnInit, HostListener } from '@angular/core';
import { ProfileService } from "src/app/features/profile/services/profile.service";
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Chart, registerables } from "chart.js";


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-application-pool',
  templateUrl: './application-pool.component.html',
  styleUrls: ['./application-pool.component.css']
})
export class ApplicationPoolComponent implements OnInit {
  itemsPerPageIIS: number = 10;
  currentPageIIS: number = 1;
  totalPagesIIS: number = 0;
  

  

serverIp:any;
serverIpGraph:any;
ServerIPadress: any;
chart:any;
  status: boolean = false;
  selectAll = false;
  isDropdownOpen3 = false;
  userID: any;
  getApplicationPoolArr: any[] = [];
  filteredData: any[] = []; // For filtered search results
  itemsPerPage: number = 10;
  currentPage: number = 1;
  totalItems: number = 0;
  totalPages: number = 1;
  isLoading: boolean = false;
  searchQueryPOOL: string = ''; // For search query
  searchQueryIIS: string = ''; // For search query


  //------IIS Server 
  getServerStatusArr:any;
  filteredServerStatusArr: any = [];
  totalCount: number = 0;

  columns: { name: string, visible: boolean }[] = [
    { name: 'App Pool Name', visible: true },
    { name: 'Status', visible: true },
    { name: 'Memory Usage', visible: true },
    { name: 'CPU Usage', visible: true },
    { name: 'Last Checked', visible: true },
    { name: 'Error Count', visible: true },
    { name: 'Uptime', visible: true },
  ];

  pageSize: string | number | undefined;
  page: string | number | undefined;
fromDate: any;
toDate: any;

  constructor(public _profileService: ProfileService) {}

  ngOnInit(): void {
    const userDetail = JSON.parse(localStorage.getItem('userDetails') || '{}');
    this.userID = userDetail.userId;
    this.getApplicationPool();
    this.GetServerIp();
    this.getServerStatus();
  
    this.getpoolGraphServer();
  }

  

  renderChart(data: any) {
    const labels = data.map((item: any) => item.apppoolname);
    const values = data.map((item: any) => item.avg_cpu_usage);
    const colors = data.map((item: any) =>
      item.status === "Running"
        ? "green"
        : item.status === "Stopped"
        ? "red"
        : "gray"
    );
    const ready = data.map((items: any) =>
      items.status === "Running"
        ? "green"
        : items.status === "Stopped"
        ? "green"
        : "gray"
    );
    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart("pChart", {
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

  GetServerIp(): void {
    const body = { UserId: this.userID };
    this._profileService.getServerIP(body).subscribe((res: any) => {
      this.ServerIPadress = res.data;
    });
  }
  toggleAllColumns(): void {
    this.columns.forEach(column => column.visible = this.selectAll);
  }

  showCheckboxes(): void {
    this.status = !this.status;
  }

  updateItemsPerPage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(target.value, 10);
    this.currentPage = 1; // Reset to first page on page size change
    this.getApplicationPool();
  }

  toggleDropdown3(): void {
    this.isDropdownOpen3 = !this.isDropdownOpen3;
  }

  @HostListener("document:click", ["$event"])
  closeDropdown(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.matches(".dropbtn")) {
      this.isDropdownOpen3 = false;
    }
  }

  searchWithServerpool() {
    this.getApplicationPool();
  }

  getScheduledServerpool(e: any) {
    this.serverIp = e.target.value;
  }

  getApplicationPool(): void {
    this.isLoading = true;
    let body:any = { 
      user_id: this.userID,
      PageNumber: this.currentPage,
      RowsPerPage: this.itemsPerPage
    }
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
    this._profileService.getApplicationPool(body).subscribe((res: any) => {
      this.getApplicationPoolArr = res.data;
      this.totalItems = res.totalCount || 0;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      this.filteredData = this.getApplicationPoolArr; // Initialize filtered data
      this.isLoading = false;
    }, (error: any) => {
      this.isLoading = false;
      console.error('Error fetching application pool data', error);
    });
  }

  getSerialNumber(index: number): number {
    return (this.currentPage - 1) * this.itemsPerPage + index + 1;
  }

  prev(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getApplicationPool();
    }
  }

  next(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getApplicationPool();
    }
  }

  SearchChangePOOL() {
    this.searchTaskPOOL();
  }

  searchTaskPOOL() {
    if (this.searchQueryPOOL.trim() === '') {
      // If search query is empty, show all data
      this.filteredData = this.getApplicationPoolArr;
    } else {
      // Filter data based on search query
      this.filteredData = this.getApplicationPoolArr.filter(item =>
        item.apppoolname.toLowerCase().includes(this.searchQueryPOOL.toLowerCase())
      );
    }
    // Reset pagination when search query changes
    this.currentPage = 1;
  }

  toggleColumnVisibility(index: number): void {
    this.columns[index].visible = !this.columns[index].visible;
  }

  exportToExcel(): void {
    const visibleData = this.filteredData.map(item => {
      const visibleItem: any = {};
      this.columns.forEach((column, index) => {
        if (column.visible) {
          visibleItem[column.name] = item[this.getColumnKey(index)];
        }
      });
      return visibleItem;
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(visibleData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'application_pool');
  }

  getColumnKey(index: number): string {
    switch (index) {
      case 0: return 'apppoolname';
      case 1: return 'status';
      case 2: return 'memoryusage';
      case 3: return 'cpuusage';
      case 4: return 'lastchecked';
      case 5: return 'errorcount';
      case 6: return 'uptime';
      case 7: return 'server_ipaddress';


      default: return '';
    }
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, `${fileName}_${new Date().getTime()}${EXCEL_EXTENSION}`);

  }

  getServerIpForpoolGraph(e: any) {
    this.serverIpGraph = e.target.value;
    this.getpoolGraphServer();
  }
  getpoolGraphServer() {
    let body;
    if (this.serverIpGraph) {
      body = {
        userId: this.userID,
        serverIPAddress: this.serverIpGraph,
      };
    } else {
      body = { userId: this.userID };
    }

    this._profileService.getpoolgraph(body).subscribe((res: any) => {
      const chartData = res.data;
      this.renderChart(chartData);
    });
  }

  //-----------------------------------IIS POOL START HOGA ------------------------

  getSerialNumberIIS(index: number): number {
    return (this.currentPageIIS - 1) * this.itemsPerPageIIS + index + 1;
  }
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

  showCheckbox() {
    this.status = !this.status;
  }

  toggleAllCheckboxesIIS(event: any) {
    const isChecked = event.target.checked;
    for (let key in this.columnsIIS) {
      this.columnsIIS[key] = isChecked;
    }
    this.updateVisibilityStatusIIS();
  }

  toggleColumnIIS(column: string) {
    this.columnsIIS[column] = !this.columnsIIS[column];
    this.updateVisibilityStatusIIS();
  }

  updateVisibilityStatusIIS() {
    this.allColumnsHidden = !Object.values(this.columnsIIS).some(value => value);
  }

  getIISServerIp(e: any) {
    this.serverIp = e.target.value;
  }
//---All dropdown search function
  searchWithServerIp() {
    
    this.getServerStatus();
  }
//----IIS Pool Api Function
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
    this.updateVisibilityStatusIIS();
  });
}
 //---------searchbar IIS POOL
  searchTaskIIS() {
    this.filteredServerStatusArr = this.getServerStatusArr.filter(task =>
      (task.sitename?.toLowerCase().includes(this.searchQueryIIS.toLowerCase()) || '') ||
      (task.sitepath?.toLowerCase().includes(this.searchQueryIIS.toLowerCase()) || '') ||
      (task.serverstate?.toLowerCase().includes(this.searchQueryIIS.toLowerCase()) || '') ||
      (task.applicationpool?.toLowerCase().includes(this.searchQueryIIS.toLowerCase()) || '') ||
      (task.serverbindings?.toLowerCase().includes(this.searchQueryIIS.toLowerCase()) || '') ||
      (task.lastchecked?.toLowerCase().includes(this.searchQueryIIS.toLowerCase()) || '')
     );
  }

  onSearchChangeIIS() {
    this.searchTaskIIS();
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

  updateItemsPerPageIIS(event: any) {
    this.itemsPerPageIIS = parseInt(event.target.value, 10);
    this.getServerStatus();
  }

  exportTo() {
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
