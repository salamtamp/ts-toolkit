import * as Excel from 'exceljs';

class ExcelWriter {
  constructor(
    public filename: string,
    public header: string[],
    public data: string[][]
  ) {}

  async save(): Promise<void> {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('sheet1');

    /** Add Header */
    worksheet.addRow(this.header);

    /** Add Data */
    worksheet.addRows(this.data);

    await workbook.xlsx.writeFile(this.filename);
  }
}

export default ExcelWriter;
