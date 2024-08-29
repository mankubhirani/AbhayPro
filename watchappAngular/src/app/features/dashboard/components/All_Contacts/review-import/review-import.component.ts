import { Component, OnInit } from '@angular/core';
import { read, utils, writeFile } from 'xlsx';

@Component({
  selector: 'app-review-import',
  templateUrl: './review-import.component.html',
  styleUrls: ['./review-import.component.css']
})
export class ReviewImportComponent implements OnInit {
contactView: any[] = [];
  constructor() { }
  handleImport($event:any){
    const files = $event.target.files;
    if(files.length){
      const file = files[0];
      const reader = new FileReader();
      reader.onload=(event:any) =>{
        const contact = read(event.target.result);

        const sheets = contact.SheetNames;
        if(sheets.length) {
          const row = utils.sheet_to_json(contact.Sheets[sheets[0]])
          // console.log(row);
        this.contactView = row
        }

      }
      reader.readAsArrayBuffer(file);
      // // console.log(file);
    }

  }

  handleExport(){

  }

  ngOnInit(): void {
  }



}
