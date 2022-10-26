import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
//import * as logoFile from './carlogo.js';
// import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  DepartmentExpenseExcelData: any = [];
  totalDepositReceived: number = 0;
  totalExpenseAmount: number = 0;
  totalRevenue: number = 0;
  constructor() { }

  generateExcel(data: any) {
    //Excel Title, Header, Data

    const header = ["Account Name", "", "Description", "Amount"]
    //const expenseheader = ["", "Account Name", "Description", "Amount"]
    const headerRevenue = ["Revenue", "", "", ""]
    const headerExpense = ["Expenses", "", "", ""]
    const headerDepositsReceived = ["Deposits and Adjustments", "", "", ""]
    const eventInformation = ["Event Information", ""]

    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Settlement Report');

    const borderThin = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    const borderThick = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
    const currencyFormat = '$#,##0.00;[Red]-$#,##0.00';

    //Add Image
    let logo = workbook.addImage({
      base64: "data:image/jpeg;base64,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",
      extension: 'jpeg',
      width: 100,
      alignment: 'right',
      margin: [0, 0, 0, 20]
    });

    worksheet.addImage(logo, 'C1:D3', {
      ext: { width: 50, height: 50 }
    })
    worksheet.mergeCells(`C1:D3`);


    //Add Row and formatting
    var eventData = data.Event;
    const reportTitle = eventData.SettlementCategory + ' Settlement Report';
    //worksheet.addRow([]);
    //let titleRow = worksheet.addRow([reportTitle]);
    //titleRow.font = { name: 'Segoe UI', family: 4, size: 16, underline: 'double', bold: true };
    //worksheet.addRow([]);
    //worksheet.mergeCells(`A5:D5`);
    //worksheet.getCell('A5').alignment = { horizontal: 'center' };

    worksheet.getCell('A2').value = eventData.SettlementCategory + ' Settlement Report';
    worksheet.getCell('A2').font = { size: 14, bold: true };

    //Blank Row 
    worksheet.addRow([]);
    //Add Revenue section header
    let eventRowInfo = worksheet.addRow(eventInformation);

    // Cell Style : Fill and Border
    eventRowInfo.eachCell((cell, number) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E8E6E5' } };
      //cell.border = borderThick;
    });
    eventRowInfo.font = { size: 16, bold: true };

    worksheet.mergeCells(`A${eventRowInfo.number}:D${eventRowInfo.number}`);

    let eventRow = ['Event ID', eventData.ID, 'Venue', eventData.Venue];
    worksheet.addRow(eventRow);
    worksheet.getCell('B6').alignment = { horizontal: 'left' };


    eventRow = ['Event Name', eventData.Name, 'Settlement Category', eventData.SettlementCategory];
    worksheet.addRow(eventRow);
    eventRow = ['Client', eventData.Client, 'Attendance', eventData.Attendance];
    worksheet.addRow(eventRow);
    // eventRow = ['Attendance', eventData.Attendance, "", ""];
    // worksheet.addRow(eventRow);

    worksheet.getCell('A6').font = { bold: true };
    worksheet.getCell('A7').font = { bold: true };
    worksheet.getCell('A8').font = { bold: true };
    worksheet.getCell('C6').font = { bold: true };
    worksheet.getCell('C7').font = { bold: true };
    worksheet.getCell('C8').font = { bold: true };
    // worksheet.getCell('A12').font = { size: 12, bold: true };
    // worksheet.getCell('C9').font = { size: 12, bold: true };
    // worksheet.getCell('C10').font = { size: 12, bold: true };
    // worksheet.getCell('C11').font = { size: 12, bold: true };
    // worksheet.getCell('A9').border = borderThin;
    // worksheet.getCell('A10').border = borderThin;
    // worksheet.getCell('A11').border = borderThin;
    // worksheet.getCell('A12').border = borderThin;
    // worksheet.getCell('A9').border = borderThin;
    // worksheet.getCell('A10').border = borderThin;
    // worksheet.getCell('A11').border = borderThin;
    // worksheet.getCell('B9').border = borderThin;
    // worksheet.getCell('B10').border = borderThin;
    // worksheet.getCell('B11').border = borderThin;
    // worksheet.getCell('B12').border = borderThin;
    // worksheet.getCell('D9').border = borderThin;
    // worksheet.getCell('D11').border = borderThin;
    // worksheet.getCell('D10').border = borderThin;
    // worksheet.getCell('C9').border = borderThin;
    // worksheet.getCell('D10').border = borderThin;
    // worksheet.getCell('C11').border = borderThin;
    // worksheet.getCell('C12').border = borderThin;
    // worksheet.getCell('D12').border = borderThin;

    //Set Columns width
    worksheet.getColumn(1).width = 50;
    worksheet.getColumn(2).width = 40;
    worksheet.getColumn(3).width = 35;
    worksheet.getColumn(4).width = 12;

    if (eventData.SettlementCategory != 'Non Ticketed') {
      //Blank Row 
      worksheet.addRow([]);

      //Add Revenue section header
      let headerRevenueRow = worksheet.addRow(headerRevenue);

      // Cell Style : Fill and Border
      headerRevenueRow.eachCell((cell, number) => {
        //cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E8E6E5' } };
        //cell.border = borderThick;
      });
      headerRevenueRow.font = { size: 16, bold: true };

      worksheet.mergeCells(`A${headerRevenueRow.number}:D${headerRevenueRow.number}`);

      //Add Header Row
      let headerRow = worksheet.addRow(header);

      // Cell Style : Fill and Border
      headerRow.eachCell((cell, number) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E8E6E5' }, bgColor: { argb: 'E8E6E5' } };
        //cell.border = borderThick;
      });
      headerRow.font = { bold: true };
      headerRevenueRow.getCell(4).numFmt = currencyFormat;
      worksheet.mergeCells(`A${headerRow.number}:B${headerRow.number}`);

      // Add Data and Conditional Formatting
      var dataDepartmentsRevenue = data.DepartmentsRevenueData;
      this.totalRevenue = 0;
      dataDepartmentsRevenue.forEach(d => {
        var amountValue = (d.PropertyAmount != 0 ? d.PropertyAmount : 0);
        if(amountValue != 0)
        {
                let rowData = [d.GLAccountName, "", d.PropertyDescription, d.PropertyAmount];
                let row = worksheet.addRow(rowData);
                this.totalRevenue += parseFloat(row.getCell(4));
                row.getCell(4).numFmt = currencyFormat;

                // row.eachCell((cell, number) => {
                //   cell.border = borderThin;
                // });

                worksheet.mergeCells(`A${row.number}:B${row.number}`);
        }
      });

      let totalRowDat: any = ["Total", "", "", this.totalRevenue];
      let totalRow = worksheet.addRow(totalRowDat);
      totalRow.eachCell((cell, number) => {
        //cell.border = borderThick;
        cell.border = {
          top: { style: 'thin' }
        };
      });
      totalRow.font = { bold: true };
      totalRow.getCell(4).numFmt = currencyFormat;
      worksheet.mergeCells(`A${totalRow.number}:C${totalRow.number}`);
    }

    //Expense Section
    worksheet.addRow([]);
    //Add Revenue section header
    let headerrExpenseRow = worksheet.addRow(headerExpense);

    // Cell Style : Fill and Border
    headerrExpenseRow.eachCell((cell, number) => {
     // cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E8E6E5' } };
      //cell.border = borderThick;
    });
    headerrExpenseRow.font = { size: 16, bold: true };
    worksheet.mergeCells(`A${headerrExpenseRow.number}:D${headerrExpenseRow.number}`);

    this.DepartmentExpenseExcelData = [];
    for (var i = 0; i < data.Departments.length; i++) {
      var departmentGUID = data.Departments[i].PropertyValue;
      var departmentData = data.DepartmentsExpensesData.filter(function (n) {
        return n.InputGroupGuid == departmentGUID;
      });

      var departmentSum = 0;
      var IsFirstrow = 0;
      for (var j = 0; j < departmentData.length; j++) {
        var amountValue = (departmentData[j].PropertyAmount != null ? departmentData[j].PropertyAmount : 0);
        if(amountValue == 0)
        continue;

        departmentSum += (departmentData[j].PropertyAmount != null ? departmentData[j].PropertyAmount : 0);
       // if (j == 0)
       if (IsFirstrow == 0) 
         {
          //this.DepartmentExpenseExcelData.push([{ "DepartmentName": data.Departments[i].PropertyName, "PropertyName": departmentData[j].GLAccountName, "Description": departmentData[j].PropertyDescription, "Amount": amountValue, "Header": 'Yes', "Total": 'No', "BlankRow": 'No', "TableHeader": 'Yes' }]);
          this.DepartmentExpenseExcelData.push([{ "DepartmentName": data.Departments[i].PropertyName, "PropertyName": departmentData[j].GLAccountName, "Description": departmentData[j].PropertyDescription, "Amount": amountValue, "Header": 'Yes', "Total": 'No', "BlankRow": 'No', "TableHeader": 'No' }]);
          IsFirstrow++;
        } else {
          this.DepartmentExpenseExcelData.push([{ "DepartmentName": data.Departments[i].PropertyName, "PropertyName": departmentData[j].GLAccountName, "Description": departmentData[j].PropertyDescription, "Amount": amountValue, "Header": 'No', "Total": 'No', "BlankRow": 'No', "TableHeader": 'No' }]);
        }

        // if (j == (departmentData.length - 1)) {
        //   this.DepartmentExpenseExcelData.push([{ "DepartmentName": data.Departments[i].PropertyName, "PropertyName": departmentData[j].GLAccountName, "Description": departmentData[j].PropertyDescription, "Amount": departmentSum, "Header": 'No', "Total": 'Yes', "BlankRow": 'No', "TableHeader": 'No' }]);
        // }
      }
      if(IsFirstrow > 0)
        this.DepartmentExpenseExcelData.push([{ "DepartmentName": data.Departments[i].PropertyName, "PropertyName": 'Total', "Description": 'Total', "Amount": departmentSum, "Header": 'No', "Total": 'Yes', "BlankRow": 'No', "TableHeader": 'No' }]);
    }


    const expenseheader = ["Department Name", "Account Name", "Description", "Amount"]
    let headerExpenseRow = worksheet.addRow(expenseheader);
    // Cell Style : Fill and Border
    headerExpenseRow.eachCell((cell, number) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E8E6E5' }, bgColor: { argb: 'E8E6E5' } };
      //cell.border = borderThick;
    });
    headerExpenseRow.font = { bold: true };

    var dataExpenses = this.DepartmentExpenseExcelData;
    let totalExpense: number = 0;
    dataExpenses.forEach(d => {
      let rowData;
      if (d[0].Total == 'Yes') {
        rowData = ["Total", "", "", d[0].Amount];
        let row = worksheet.addRow(rowData);
        totalExpense = parseFloat(row.getCell(4));
        row.eachCell((cell, number) => {
          cell.border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' }
          }
          cell.alignment = { horizontal: 'right' };
        });
        row.font = { bold: true };
        row.getCell(4).numFmt = currencyFormat;
        worksheet.mergeCells(`A${row.number}:C${row.number}`);
        //worksheet.addRow([]);
      }
      else {
        if (d[0].Header == 'Yes') {
          
          rowData = [d[0].DepartmentName, d[0].PropertyName, d[0].Description, d[0].Amount];
          let row = worksheet.addRow(rowData);
          totalExpense += parseFloat(row.getCell(4));
          row.getCell(4).numFmt = currencyFormat;

          //const expenseheader = [d[0].DepartmentName, "Account Name", "Description", "Amount"]
         /* const expenseheader = ["Department Name", "Account Name", "Description", "Amount"]
          let headerExpenseRow = worksheet.addRow(expenseheader);
          // Cell Style : Fill and Border
          headerExpenseRow.eachCell((cell, number) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e6e6ff' }, bgColor: { argb: 'e6e6ff' } };
            //cell.border = borderThick;
          });
          headerExpenseRow.font = { bold: true };*/
          //rowData = [d[0].DepartmentName, "", "", ""];
          // worksheet.addRow(rowData);
        } else {
          rowData = ["", d[0].PropertyName, d[0].Description, d[0].Amount];
          let row = worksheet.addRow(rowData);
          totalExpense += parseFloat(row.getCell(4));
          row.getCell(4).numFmt = currencyFormat;
          row.eachCell((cell, number) => {
            //cell.border = borderThin;
          });
        }
      }
    });

    this.totalExpenseAmount = 0;
    this.DepartmentExpenseExcelData.forEach(d => {
      if (d[0].Total == 'Yes')
        this.totalExpenseAmount += parseFloat(d[0].Amount);
    });

    let totalRowExpenseData: any = ["Total Expenses", "", "", this.totalExpenseAmount];
    let totalExpenseRow = worksheet.addRow(totalRowExpenseData);
    totalExpenseRow.eachCell((cell, number) => {
      //cell.border = borderThick;
      cell.border = {
        top: { style: 'thin' },
        // bottom: { style: 'thin' }
      }
    });
    totalExpenseRow.font = { bold: true };
    totalExpenseRow.getCell(4).numFmt = currencyFormat;
    worksheet.mergeCells(`A${totalExpenseRow.number}:C${totalExpenseRow.number}`);

    //Deposit Received
    //if (eventData.SettlementCategory != 'CB, LMJS, SDO') 
    {
      worksheet.addRow([]);
      //Add Revenue section header
      let headerDepositsReceivedRow = worksheet.addRow(headerDepositsReceived);

      // Cell Style : Fill and Border
      headerDepositsReceivedRow.eachCell((cell, number) => {
        //cell.fill = { type: 'pattern', pattern: 'solid' };
        //cell.border = borderThick;
      });
      headerDepositsReceivedRow.font = { size: 16, bold: true };
      worksheet.mergeCells(`A${headerDepositsReceivedRow.number}:D${headerDepositsReceivedRow.number}`);
      //Add Header Row
      let headerDepositReceivedRow = worksheet.addRow(header);

      // Cell Style : Fill and Border
      headerDepositReceivedRow.eachCell((cell, number) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E8E6E5' }, bgColor: { argb: 'E8E6E5' } };
        //cell.border = borderThick;
      });
      headerDepositReceivedRow.font = { bold: true };
      worksheet.mergeCells(`A${headerDepositReceivedRow.number}:B${headerDepositReceivedRow.number}`);

      var dataDepartmentsDeposits = data.DepartmentsDepositsReceivedData;
      this.totalDepositReceived = 0;
      dataDepartmentsDeposits.forEach(d => {
        var amountValue = (d.PropertyAmount != null ? d.PropertyAmount : 0);
        if (amountValue != 0) {
          let rowData = [d.GLAccountName, "", d.PropertyDescription, d.PropertyAmount];
          let row = worksheet.addRow(rowData);
          this.totalDepositReceived += parseFloat(row.getCell(4));
          row.getCell(4).numFmt = currencyFormat;
          row.eachCell((cell, number) => {
            //cell.border = borderThin;
          });
          worksheet.mergeCells(`A${row.number}:B${row.number}`);
        }
      });

      let totalRowDepositReceivedData: any = ["Total Deposits and Adjustments", "", "", this.totalDepositReceived];
      let totalDepositReceivedRow = worksheet.addRow(totalRowDepositReceivedData);
      totalDepositReceivedRow.eachCell((cell, number) => {        
        cell.border =  {top: { style: 'thin' } }     
      });
      totalDepositReceivedRow.font = { bold: true };
      totalDepositReceivedRow.getCell(4).numFmt = currencyFormat;
      worksheet.mergeCells(`A${totalDepositReceivedRow.number}:C${totalDepositReceivedRow.number}`);
    }

    //worksheet.addRow([]);
    //Bottom Summary
    if (eventData.SettlementCategory == "Ticketed" || eventData.SettlementCategory == 'BSD') {
      let AdjustedAmountTotal = ((this.totalRevenue - this.totalExpenseAmount) + this.totalDepositReceived);
      let totalRowAdjustedAmount: any = ["Adjusted Amount Due To/(From)", "", "", AdjustedAmountTotal];
      let totalRowdjusted = worksheet.addRow(totalRowAdjustedAmount);
      totalRowdjusted.eachCell((cell, number) => {
        //cell.border = borderThick;
        cell.border =  {top: { style: 'thin' } }     
      });
      totalRowdjusted.font = { bold: true };
      totalRowdjusted.getCell(4).numFmt = currencyFormat;
      worksheet.mergeCells(`A${totalRowdjusted.number}:C${totalRowdjusted.number}`);
    } else if (eventData.SettlementCategory == "Non Ticketed") {
      let AdjustedAmountTotal = ((this.totalDepositReceived - this.totalExpenseAmount));
      let totalRowAdjustedAmount: any = ["Adjusted Amount Due To/(From)", "", "", AdjustedAmountTotal];
      let totalRowdjusted = worksheet.addRow(totalRowAdjustedAmount);
      totalRowdjusted.eachCell((cell, number) => {
        //cell.border = borderThick;
        cell.border =  {top: { style: 'thin' } }     
      });
      totalRowdjusted.font = { bold: true };
      totalRowdjusted.getCell(4).numFmt = currencyFormat;
      worksheet.mergeCells(`A${totalRowdjusted.number}:C${totalRowdjusted.number}`);
    } else {
      let AdjustedAmountTotal = ((this.totalRevenue - this.totalExpenseAmount) + this.totalDepositReceived);
      let totalRowAdjustedAmount: any = ["Adjusted Amount Due To/(From)", "", "", AdjustedAmountTotal];
      let totalRowdjusted = worksheet.addRow(totalRowAdjustedAmount);
      totalRowdjusted.eachCell((cell, number) => {
        // cell.border = borderThick;
        cell.border =  {top: { style: 'thin' } }     
      });
      totalRowdjusted.font = { bold: true };
      totalRowdjusted.getCell(4).numFmt = currencyFormat;
      worksheet.mergeCells(`A${totalRowdjusted.number}:C${totalRowdjusted.number}`);
    }

    // Signature
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow([]);

    let signRow: any = ["for San Diego Theares, Inc.", "Date", "for " + eventData.Client, 'Date'];
    let new_row = worksheet.addRow(signRow);
    new_row.eachCell((cell, number) => {      
      cell.alignment = { horizontal: 'center' };
    });
    new_row.font = { bold: true };

    // Signature
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow([]);
    let empty_new_row = worksheet.addRow(["","","",""]);
    empty_new_row.eachCell((cell, number) => {            
      cell.border =  {bottom: { style: 'thin' } } 
    });

    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let settlementTReportName = reportTitle + ".xlsx";
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, settlementTReportName);
    })
  }
}