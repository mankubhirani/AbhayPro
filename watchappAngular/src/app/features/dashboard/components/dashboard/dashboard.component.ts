// Import necessary components, services, and libraries
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CompanyService } from 'src/app/features/company/service/company.service';
import { DashboardService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProfileService } from 'src/app/features/profile/services/profile.service';
import { Router } from '@angular/router';
import { Chart, registerables, ChartConfiguration, ChartData, } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardServer: any = [];
  p: number = 1; // Current page number
  itemsPerPage: number = 5;


  // Constructor to inject required services
  constructor(

    private _shared: SharedService,
    private CompanyService: CompanyService,
    private dashboardService: DashboardService,
    public router: Router,
    public _profileService: ProfileService,
    private http: HttpClient,
    private ngxService: NgxUiLoaderService,
  ) { }

  // Variables to store data
  Contact: any; // Current contact data
  getAllContact: any; // All contact data
  length: any;
  newArray_contact: any;
  userDetails: any; // User details data
  emaildata: any;
  userID:any;
  UserEmailObj: any;
  finaldata: any = [];
  id: any;
  totalServerNo: any;
  lastUpdated: any;
  fifteenMinutes: any;
  healthCheckUpData: any = [];
  serverInformationData: any = [];// serverInformation of data
  fileSummaryData: any = [];
  errorLogData: any = [];

  
 ngOnInit(): void {
    // Get user details on component initialization
    this.userDetails = this._shared.getUserDetails();
    this.totalServerNo = 8;
    this.lastUpdated = "Last Updated : 5 min";
    this.fifteenMinutes = "15 min"; 

    let editUserDetail = JSON.parse(localStorage.getItem('userDetails') || "{}");
    this.userID = editUserDetail.userId
    this.getServerInformation();
    
    this.getHealthCheckup();
    this.getErrorLog();
    this.getFileSummary();
    
    this.getdashboardTaskDetailsGraphServer();
    this.TotalServerStorage();
    this.getDashboardServer();
    // console.log("message", this.userDetails);
    // console.log("UserId", this.userDetails.UserId);
    // this.AllList();
  }

  getServerInformation(){

    let body = { 
      "user_id": this.userID
    }
    // console.log(body);
    this._profileService.getMapApi(body).subscribe((res: any) => {
      this.serverInformationData = res['data'];
      console.log('serverInformationData', this.serverInformationData);
      // console.log(this.getMapServerArr, 'this.getMapServerArr');
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

  getErrorLog(){
    let body = {
      "user_id": this.userID
    }
    // console.log(body);
    

    this._profileService.getApplicationCheckUp(body).subscribe((res: any) => {
      this.errorLogData = res['data'];

      // console.log(this.getApplicationCheckupArr,'this.getApplicationCheckupArr');
      
    })
  }
  getFileSummary() {
    let body = { 
      "user_id": this.userID
    }
    // console.log(body);

    this._profileService.getFileSummary(body).subscribe((res: any) => {
      this.fileSummaryData = res['data'];
    })
  }
 
  getdashboardTaskDetailsGraphServer(){
    const body = { userId: this.userID};
    this._profileService.getTaskDetailsGraph(body).subscribe((res: any) => {
      const chartData = res.data; // Assuming res.data is an array of objects as shown
      this.RenderChart(chartData);

    });
  }

  TotalServerStorage(){
    const body = { AdmUserId: this.userID};
    this._profileService.getAppHealthGraph(body).subscribe((res: any) => {
      const chartData = res.data; // Assuming res.data is an array of objects as shown
      this.createChart(chartData);

    });

}

  getGoogleAuth() {
    this.dashboardService._getGoogleApi().subscribe(res => {
      console.log("Res", res);
    })
  }
  // RenderChart(id:any,type:any) {
  //   const existingchart=Chart.getChart(id);
  //   if(existingchart){
  //     existingchart.destroy();
  //   };
  //   const mychart = new Chart("piechart", {

  //     type: 'bar',
  //     data: {
  //       labels: ['Adobe Acrobat', 'whatapp web', 'outlook', 'teams', 'chrome', 'Firefox', 'anydesk'],
  //       datasets: [{
  //         label: 'Today',
  //         data: [31, 40, 28, 51, 42, 82, 56],
  //         borderWidth: 1,

  //       }]
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true
  //         }
  //       }
  //     }
  //   });
  // }
  RenderChart(data: any) {
    const labels = data.map((item: any) => item.taskname);
    const values = data.map((item: any) => item.avg_cpu_usage);
    const colors = data.map((item: any) => item.status === "Ready" ? "green" : item.status === "Disabled" ? "red" : "gray");
  
    new Chart("piechart", {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'avg_cpu_usage',
          data: values,
          borderWidth: 1,
          backgroundColor: colors,
        }]
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
            }
           
          },
          x: {
            title: {
              display: true,
              text: 'App Name'
            }
          }
        },
        responsive: true,
        plugins: {
          legend: {
            display: false
        },
          // legend: {
          //   position: 'top' as const,
          // },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || '';
                const value = context.raw as number;
                const index = context.dataIndex;
                const taskName = labels[index];
                const task = data.find((item: any) => item.taskname === taskName) || {};
                return `${label}: ${value}\nStatus: ${task.status || 'N/A'}`;
              }
            }
          }
        }
      }
    });
  }
  

  // createChart(chartData: any): void {
  //   const data: ChartData<'doughnut'> = {
  //     labels: [
  //       "800 GB",
  //       "1000 GB",
  //       "400 GB",
  //       "1200 GB",
  //       "900 GB",
  //       "700 GB",
  //     ],
  //     datasets: [{
  //       data: [44, 55, 13, 43, 22, 11],
  //       backgroundColor: [
  //         'rgb(54, 162, 235)',
  //         'rgb(0, 227, 150)',
  //         'rgb(254, 176, 25)',
  //         'rgb(255, 69, 96)',
  //         'rgb(84, 26, 145)',
  //         'rgb(44, 63, 190)',
  //       ],
  //       hoverOffset: 4
  //     }]
  //   };
  //   const config: ChartConfiguration<'doughnut'> = {
  //     type: 'doughnut',
  //     data: data,
  //     options: {
  //       responsive: true,
  //       plugins: {
  //         legend: {
  //           position: 'bottom',
  //         },
  //         title: {
  //           display: true
  //         }
  //       }
  //     }
  //   };
  //   const chartElement = document.getElementById('myChart') as HTMLCanvasElement;
  //   new Chart(chartElement, config);
  // }

  createChart(chartData: any): void {


    const data: ChartData<'doughnut'> = {
      labels: [
        "800 GB",
        "1000 GB",
        "400 GB",
        "1200 GB",
        "900 GB",
        "700 GB",
      ],
      datasets: [{
        data: [44, 55, 13, 43, 22, 11],
        backgroundColor: [
          'rgb(54, 162, 235)',
          'rgb(0, 227, 150)',
          'rgb(254, 176, 25)',
          'rgb(255, 69, 96)',
          'rgb(84, 26, 145)',
          'rgb(44, 63, 190)',
        ],
        hoverOffset: 4
      }]
    };
    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true
          }
        }
      }
    };
    const chartElement = document.getElementById('myChart') as HTMLCanvasElement;
    new Chart(chartElement, config);
  }





  getDashboardServer() {
    let body = { 
      user_Id: this.userID
    };
    // console.log("Request Body:", body); 

    this._profileService.getDashboardStatistics(body).subscribe((res: any) => {
      // console.log("API Response:", res); 
      if (res && res.data) {
        this.dashboardServer = [
          { active: res.data.servers.active, inactive: res.data.servers.inactive },
          { active: res.data.taskSchedulers.active, inactive: res.data.taskSchedulers.inactive },
          { active: res.data.applications.active, inactive: res.data.applications.inactive }
        ];
        //  console.log("Mapped dashboardServer:", this.dashboardServer); // Debug: Log the mapped data
      } else {
         console.error("Invalid response format:", res);
      }
    }, (error) => {
       console.error("API Error:", error); // Debug: Log any errors from the API call
    });
  }
}

