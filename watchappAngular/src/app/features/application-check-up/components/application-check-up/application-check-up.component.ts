import { Component, HostListener, OnInit } from "@angular/core";
import { Chart, ChartConfiguration, ChartData, registerables } from "chart.js";
import { ProfileService } from "src/app/features/profile/services/profile.service";
import { NgxPaginationModule } from 'ngx-pagination';

 
@Component({
  selector: "app-application-check-up",
  templateUrl: "./application-check-up.component.html",
  styleUrls: ["./application-check-up.component.css"],
})
export class ApplicationCheckUpComponent implements OnInit {
  isDropdownOpen = false;
  isDropdownOpen1 = false;
  isDropdownOpen2 = false;
  isDropdownOpen3 = false;
  uniqueApplications: any[] = [];
  selectAll = false;
  p: number = 1; // Current page number
  itemsPerPage: number = 5; // Number of items per page
  healthCheckUpData:any = [];
  getApplicationCheckupArr: any = [];
  userID: any;
  getFileSummaryData: any = [];
  
 
  constructor(
    public _profileService: ProfileService
  ) {
    Chart.register(...registerables);
  
  }
 
  ngOnInit(): void {
  
    this.createChart();
    this.createChart1();

    let getApplicationCheckupDetails = JSON.parse(localStorage.getItem('userDetails') || "{}");
    this.userID = getApplicationCheckupDetails.userId
    // console.log(getApplicationCheckupDetails);

    this.getApplicationCheckupServer();
    this.getFileSummaryServer();
    this.getHealthCheckup();
    this.getHealthCheckUpApplicationGraphServer();
  }


  columnsVisibility = {
    logCode: true,
    logDetails: true,
    applicationName: true,
    serverName: true,
    occurTime: true,
    pageFunction: true
  };
 
  onSelectAllChange() {
    for (let key in this.columnsVisibility) {
      this.columnsVisibility[key] = !this.selectAll;
    }
  }

  onColumnChange() {
    const allSelected = Object.values(this.columnsVisibility).every(value => !value);
    // this.selectAll = allSelected;
    return allSelected
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
 
  toggleDropdown1() {
    this.isDropdownOpen1 = !this.isDropdownOpen1;
  }
  toggleDropdown2() {
    this.isDropdownOpen2 = !this.isDropdownOpen2;
  }
  toggleDropdown3() {
    this.isDropdownOpen3 = !this.isDropdownOpen3;
  }
  updateItemsPerPage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(target.value, 10);
  }
  @HostListener("document:click", ["$event"])
  closeDropdown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.matches(".dropbtn")) {
      this.isDropdownOpen = false;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen3 = false;
    }
  }
 
  RenderChart(data: any) {

    const labels = data.map((item: any) => item.taskname);
    const values = data.map((item: any) => item.TaskCount);

    new Chart("piechart", {
      type: "line",
      data: {
        labels: [
          "00:00",
          "01:00",
          "02:00",
          "03:00",
          "04:00",
          "05:00",
        ],
        datasets: [
          {
            label: "Today",
            
            data: [31, 40, 28, 51, 42, 82, 56],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
 
  createChart(): void {
    const data: ChartData<"doughnut"> = {
      labels: ["800 GB", "1000 GB", "400 GB", "1200 GB", "900 GB", "700 GB"],
      datasets: [
        {
          data: [44, 55, 13, 43, 22, 11],
          backgroundColor: [
            "rgb(54, 162, 235)",
            "rgb(0, 227, 150)",
            "rgb(254, 176, 25)",
            "rgb(255, 69, 96)",
            "rgb(84, 26, 145)",
          ],
          hoverOffset: 4,
        },
      ],
    };
 
    const config: ChartConfiguration<"doughnut"> = {
      type: "doughnut",
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
          title: {
            display: true,
          },
        },
      },
    };
 
    const chartElement = document.getElementById(
      "myChart"
    ) as HTMLCanvasElement;
    new Chart(chartElement, config);
  }
 
  createChart1(): void {
    const data: ChartData<"doughnut"> = {
      labels: ["800 GB", "1000 GB", "400 GB", "1200 GB", "900 GB", "700 GB"],
      datasets: [
        {
          data: [44, 55, 13, 43, 22, 11],
          backgroundColor: [
            "rgb(54, 162, 235)",
            "rgb(0, 227, 150)",
            "rgb(254, 176, 25)",
            "rgb(255, 69, 96)",
            "rgb(84, 26, 145)",
          ],
          hoverOffset: 4,
        },
      ],
    };
 
    const config: ChartConfiguration<"doughnut"> = {
      type: "doughnut",
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
          title: {
            display: true,
          },
        },
      },
    };
 
    const chartElement = document.getElementById(
      "myChart1"
    ) as HTMLCanvasElement;
    new Chart(chartElement, config);
  }

  getApplicationCheckupServer(){
    let body = {
      "user_id": this.userID
    }
    // console.log(body);
    

    this._profileService.getApplicationCheckUp(body).subscribe((res: any) => {
      this.getApplicationCheckupArr = res['data'];
      this.uniqueApplications = this.getUniqueApplications(this.getApplicationCheckupArr);
      // console.log(this.getApplicationCheckupArr,'this.getApplicationCheckupArr');
      
    })
  }


  getHealthCheckUpApplicationGraphServer(){
    let body = {
      "AdmUserId": 46
    }
    // console.log(body);
    this._profileService.getHealthCheckUpApplicationGraph(body).subscribe((res: any) => {
      const chartData = res.data; // Assuming res.data is an array of objects as shown
      this.RenderChart(chartData);
    })
  }

  

  getUniqueApplications(data: any[]): any[] {
    const seen = new Set();
    return data.filter(item => {
      const duplicate = seen.has(item.appname);
      seen.add(item.appname);
      return !duplicate;
    });
  }

  getFileSummaryServer(){
    let body = {
      "user_id": this.userID
    }
    // console.log(body);
    this._profileService.getFileSummary(body).subscribe((res: any) => {
      this.getFileSummaryData = res['data'];
    })
  }
  
  getHealthCheckup() {
    let body = {
      "user_id": this.userID
    }
    // console.log(body);
    this._profileService.getHealthCheckUp(body).subscribe((res: any) => {
      this.healthCheckUpData = res['data'];
    })
  }
}
