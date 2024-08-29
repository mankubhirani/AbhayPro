import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/header/header.component';
import { LeftComponent } from './shared/left/left.component';
import { DashboardComponent } from './features/components/dashboard/dashboard.component';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, HeaderComponent, LeftComponent, DashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'DemoServie';
  tab: string = '';
  // inputVal: string = '';
  // toDestroy: boolean = false;
  // display: boolean = false;

  // ngAfterViewInit() {
  //   console.log('ngAfterViewInit hook of appcomponent is  called');
  //   //console.log("ngAfterViewInit:", this.tempPara);
  // }
  // ngAfterViewChecked() {
  //   console.log('ngAfterViewChecked of appcomponent  hook is called');
  // }

  // onBtnClicked(inputEl: HTMLInputElement) {
  //   this.inputVal = inputEl.value;
  // }
  // destroyComponent() {
  //   this.toDestroy = !this.toDestroy;
  // }

  // displayTermOfServices() {
  //this.display = true;
  // }
  onInfoClicked() {
    this.tab = 'info';
  }
  onServiceClicked() {
    this.tab = 'service';
  }
  onPrivacyClicked() {
    this.tab = 'privacy';
  }
  onUserClicked() {
    this.tab = 'user';
  }


  isSidebarOpen: boolean = false;

  onToggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
