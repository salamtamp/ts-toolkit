import fs from 'fs';

class CsvReader {
  data: string[] = [];
  option: object = { encoding: 'utf-8' };

  constructor(public filename: string) {}

  read() {
    this.data = fs
      .readFileSync(this.filename, this.option)
      .toString()
      .split('\n');
  }
}

export default CsvReader;
