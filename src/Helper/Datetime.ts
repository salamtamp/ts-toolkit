import moment, { Moment } from 'moment-timezone';

class Datetime {
  static toMoment(
    date: string | Moment,
    fromFormat: string = 'YYYY-MM-DDTHH:mm:ssZ'
  ): Moment {
    return typeof date === 'string' ? moment(date, fromFormat) : date;
  }

  static toDate(
    date: string | Moment,
    fromFormat: string = 'YYYY-MM-DDTHH:mm:ssZ'
  ): Date {
    return typeof date === 'string'
      ? moment(date, fromFormat).toDate()
      : date.toDate();
  }

  static isBefore(date1: string | Moment, date2: string | Moment): boolean {
    if (typeof date1 === 'string') {
      date1 = this.toMoment(date1);
    }

    if (typeof date2 === 'string') {
      date2 = this.toMoment(date2);
    }

    return date1.isBefore(date2);
  }

  static isBetween(
    date: string | Moment,
    start: string | Moment,
    end: string | Moment
  ): boolean {
    if (typeof date === 'string') {
      date = this.toMoment(date);
    }

    if (typeof start === 'string') {
      start = this.toMoment(start);
    }

    if (typeof end === 'string') {
      end = this.toMoment(end);
    }

    return date.isBetween(start, end);
  }
}

export default Datetime;
