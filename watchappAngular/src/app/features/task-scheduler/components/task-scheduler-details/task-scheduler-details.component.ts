import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { Chart, registerables } from "chart.js";
import { ProfileService } from "src/app/features/profile/services/profile.service";
import * as XLSX from "xlsx";

Chart.register(...registerables);

@Component({
  selector: "app-task-scheduler-details",
  templateUrl: "./task-scheduler-details.component.html",
  styleUrls: ["./task-scheduler-details.component.css"],
})
export class TaskSchedulerDetailsComponent implements OnInit {
  serverIpGraph: any;
  taskSchedularData: any = [];
  filteredData: any = [];
  status: string = ''; // Initialize as an empty string
  userID: any;
  searchQuery: string = "";
  columns = {
    SrNo:true,
    appName: true,
    status: true,
    Address: true,
    nextRunTime: true,
    lastRunTime: true,
    author: true,
    created: true,
    server: true,
    action: true,
  };
  allColumnsHidden: boolean = false;
  itemsPerPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  isLoading: boolean = false;
  p: string | number | undefined;
  ServerIPadress: any = [];
  serverIp: any;

  fromDate: string = "";
  toDate: string = "";
  selectedServer: any;
  dropdownOpen: any;
  isDropdownVisible = false;

  private chart: Chart | undefined;
  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    const userDetail = JSON.parse(localStorage.getItem("userDetails") || "{}");
    this.userID = userDetail.userId;
    this.getScheduledTask();
    this.getTaskDetailsGraphServer();
    this.GetServerIp();
  }

  renderChart(data: any) {
    const labels = data.map((item: any) => item.taskname);
    const values = data.map((item: any) => item.avg_cpu_usage);
    const colors = data.map((item: any) => item.status === "Ready" ? "green" : item.status === "Disabled" ? "red" : "gray");

    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart("pieChart", {
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
            backgroundColor: colors,
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
              font: {
                weight: 'bold', // Makes the text bold
                size: 18, // You can adjust the size if needed
              },
            },
          },
          x: {
            title: {
              display: true,
              text: "App Name",
              font: {
                weight: 'bold', // Makes the text bold
                size: 18, // You can adjust the size if needed
              },
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

  getScheduledServerIp(e: any) {
    this.serverIp = e.target.value;
  }

  getServerIpForGraph(e: any) {
    this.serverIpGraph = e.target.value;
    this.getTaskDetailsGraphServer();
  }

  searchWithServerIp() {
    this.filteredData = [];
    this.getScheduledTask();
  }

  getScheduledTask(autoRefresh: boolean = false): void {
    let body: any = { user_id: this.userID };

    if (this.serverIp) {
      body.server_ip = this.serverIp;
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

    console.log("body", body);

    this.isLoading = true;

    this.profileService.getScheduledTask(body).subscribe((res: any) => {
      if (!autoRefresh) {
        this.isLoading = false;
      }
      this.taskSchedularData = res.data;
      this.filteredData = this.taskSchedularData;
    });
  }

  GetServerIp(): void {
    const body = { UserId: this.userID };
    this.profileService.getServerIP(body).subscribe((res: any) => {
      this.ServerIPadress = res.data;
    });
  }

  searchTask() {
    if (this.searchQuery.trim()) {
      this.filteredData = this.taskSchedularData.filter((task: any) =>
        task.taskname.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredData = this.taskSchedularData;
    }
  }

  onSearchChange() {
    this.searchTask();
  }

  showCheckboxes() {
    this.status = this.status === 'Ready' ? 'Disabled' : 'Ready'; // Toggle between 'Ready' and 'Disabled'
  }

  toggleColumn(column: string) {
    this.columns[column] = !this.columns[column];
    this.checkAllColumnsHidden();
  }

  checkAllColumnsHidden() {
    this.allColumnsHidden = Object.values(this.columns).every(
      (value) => !value
    );
  }

  @ViewChildren("checkbox") checkboxes!: QueryList<any>;

  toggleAllCheckboxes(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    Object.keys(this.columns).forEach((column) => {
      this.columns[column] = isChecked;
    });
    this.checkAllColumnsHidden();
  }

  getTaskDetailsGraphServer() {
    let body;
    if (this.serverIpGraph) {
      body = {
        userId: this.userID,
        serverIPAddress: this.serverIpGraph,
      };
    } else {
      body = { userId: this.userID };
    }

    this.profileService.getTaskDetailsGraph(body).subscribe((res: any) => {
      const chartData = res.data;
      this.renderChart(chartData);
    });
  }

  updateItemsPerPage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(target.value, 10);
  }

  prev(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getScheduledTask();
    }
  }

  next(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getScheduledTask();
    }
  }

  exportToExcel(): void {
    // Convert headers to a readable format
    const formattedData = this.filteredData.map((item: any) => {
      const formattedItem: any = {};
      Object.keys(item).forEach((key) => {
        const formattedKey = this.formatHeader(key);
        formattedItem[formattedKey] = item[key];
      });
      return formattedItem;
    });

    // Create a worksheet from the formatted data
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);

    // Format the headers
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4F81BD" } },
    };

    // Apply the style to the header row
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "");
    for (let C = range.s.c; C <= range.e.c; C++) {
      const address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (worksheet[address]) {
        worksheet[address].s = headerStyle;
      }
    }

    // Create a workbook and add the worksheet to it
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ["data"],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Save the workbook as an Excel file
    this.saveAsExcelFile(excelBuffer, "taskscheduler_data");
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: "application/octet-stream",
    });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(data);
      link.setAttribute("href", url);
      link.setAttribute("download", fileName + ".xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  private formatHeader(key: string): string {
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (str) => str.toUpperCase());
  }
}
