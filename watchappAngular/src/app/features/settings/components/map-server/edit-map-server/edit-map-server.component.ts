import { Component, OnInit , ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from 'src/app/features/profile/services/profile.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'app-edit-map-server',
  templateUrl: './edit-map-server.component.html',
  styleUrls: ['./edit-map-server.component.css']
  
})


export class EditMapServerComponent implements OnInit {

  @ViewChild('teams') teams! : ElementRef;
  selectedTeam = '';
  onSelected(event: any, id: number):void{
   this.selectedTeam = this.teams.nativeElement.value;
   const selectedValue = event.target.value;
   if (selectedValue === 'edit') {
     this.router.navigate(['/settings/add-map-server']);
   } 
}

  id: any;
  msd_id: any;
  display: string = 'none';
  getMapServerArr: any = [];
  selectedStatus: string = '';
  
  // count:any;
  userID: any;
  // userID: any;

  // collection: any[] = [];
  p: number = 1; // Current page number
  itemsPerPage: number = 5; // Number of items per page

  //action button by id
  isDropdownOpen1: any;
  dropdownStates = new Map<number, boolean>();

  


  constructor(
    public router: Router,
    public _profileService: ProfileService,
    private http: HttpClient,
    private _shared: SharedService,
    private ngxService: NgxUiLoaderService,

  ) { }
  
  ngOnInit(): void {
    //getting data from the server
    let editUserDetail = JSON.parse(localStorage.getItem('userDetails') || "{}");
    this.userID = editUserDetail.userId
    // console.log(editUserDetail);

   //calling getEdit fun 
  
    this.fetchData();
      this.getEditMapServer();
  }

  fetchData() {
    this.http.get('https://watchappapi.cylsys.com/getMapServer') // Replace with your API endpoint
      .subscribe((res: any) => {
        this.getMapServerArr = res;
        
      });
  }
  toggleDropdown1(id: number) {
    // Toggle the state of the dropdown with the given id
    this.dropdownStates.set(id, !this.dropdownStates.get(id));
  }
  isDropdownOpen(id: number): boolean {
    return this.dropdownStates.get(id) || false;
  }
  updateItemsPerPage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(target.value, 10);
  }
  
  deleteDocument(id: number){
   console.log(id);
    let body = {
      "msd_id":id
    }
     console.log(body)
    this.ngxService.start();
    this._profileService.deleteMapServer(body).subscribe((res:any) => {
      // console.log("Res");
      this.ngxService.stop();
      this._shared.ToastPopup(res.message,'','success');
      this.getEditMapServer();
    });
  }
  addServer() {
    this.router.navigate(['/settings/add-map-server'])
  }
  editServer(id: number): void {
    this.router.navigate(['/edit-server', id]);
  }
  
  onStatusChange(event: any) {
    this.selectedStatus = event.target.value;
    if (this.selectedStatus === "Connected") {
      return this.getMapServerArr;
    } else if (this.selectedStatus === 'Disconnected') {
      return this.getMapServerArr.filter(value => !value.active);
    } else {
      return null;
    }
  }
  getEditMapServer(){

    let body = { 
      "user_id": this.userID
    }
    // console.log(body);

    this._profileService.getMapApi(body).subscribe((res: any) => {
      this.getMapServerArr = res['data'];

      // console.log(this.getMapServerArr, 'this.getMapServerArr');
    })
  }
}
