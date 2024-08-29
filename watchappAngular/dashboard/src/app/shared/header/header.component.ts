import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { LeftComponent } from '../left/left.component';
import { CommonModule } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

    onToggleSidebar() {
        this.toggleSidebar.emit();
    }

    


    ngOnInit() {
      this.fullHeight();
      this.initSidebarCollapse();
    }
  
    fullHeight() {
      const windowHeight = $(window).height();
    if (windowHeight !== undefined) {
      $(".js-fullheight").css("height", windowHeight.toString() + "px");
      $(window).resize(() => {
        const resizedHeight = $(window).height();
        if (resizedHeight !== undefined) {
          $(".js-fullheight").css("height", resizedHeight.toString() + "px");
        }
      });
    }
    }
  
    initSidebarCollapse() {
      $("#sidebarCollapse").on("click", () => {
        $("#sidebar").toggleClass("active");
      });
    }
}
