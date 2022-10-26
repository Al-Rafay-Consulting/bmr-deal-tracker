import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';

@Injectable({
  providedIn: 'root'
})
export class ExcelReaderService {

  constructor() { }

  async ReadWorkbookAndReturnWorksheetRows(file: File) {
    return this.getFileArrayBuffer(file).then((data: any) => {
      return new Promise((resolve, reject) => {
        const workbook = new Workbook();
        workbook.xlsx.load(data)
          .then(function () {
            //const worksheet = workbook.getWorksheet(1);
            // worksheet.eachRow(function (row, rowNumber) {
            //   console.log('Row: ' + rowNumber + ' Value: ' + row.values);
            // });
            let rows = null;
            if (workbook.worksheets.length > 1)
              rows = workbook.worksheets[1]._rows;
            if (rows) {
              const sheet = {
                name: workbook.worksheets[1].name.toLowerCase().trim(),
                rows: rows
              }
              resolve(sheet);
            }
            else
              reject();
          });
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  async getFileArrayBuffer(aFile: File) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsArrayBuffer(aFile);
      reader.onloadend = (function (e) {
        var data = e.target.result;
        if (data)
          resolve(data);
        else
          reject();
      });
    });
  }

}
