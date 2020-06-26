import { Component, ViewChild, ElementRef } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';

const allgtwys = [
  { id: 1, gtwy: 'ANC', offset: 240 },
  { id: 2, gtwy: 'BDL', offset: 320 },
  { id: 3, gtwy: 'CAE', offset: 420 },
  { id: 4, gtwy: 'DFW', offset: 180 },
  { id: 5, gtwy: 'EWR', offset: 120 },
];
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private decimalPipe: DecimalPipe, private datePipe: DatePipe) {}
  title = 'CVV Replay';


  @ViewChild('dateInput') dateInput: ElementRef;
  @ViewChild('timeInput') timeInput: ElementRef;
  @ViewChild('hoursInput') hoursInput: ElementRef;
  @ViewChild('gtwyInput') gtwyInput: ElementRef;
  @ViewChild('dateInput1') dateInput1: ElementRef;
  @ViewChild('timeInput1') timeInput1: ElementRef;
  @ViewChild('hoursInput1') hoursInput1: ElementRef;
  @ViewChild('gtwyInput1') gtwyInput1: ElementRef;
  hoursValue = '00';
  minsValue = '00';
  hoursValue1 = '00';
  minsValue1 = '00';
  todayDate = new FormControl(new Date());
  todayDate1 = new FormControl(new Date());
  gtwyControl = new FormControl();
  gtwyControl1 = new FormControl();
  isoString: string;
  localString: string;
  localMilString: string;
  gtwyInfo: any;
  validationMsg = '';
  isoString1: string;
  localString1: string;
  localMilString1: string;
  gtwyInfo1: any;
  validationMsg1 = '';

  private fixLeadingZero(sliderValue) {
    return this.decimalPipe.transform(sliderValue, '2.0');
  }

  public fix(): void {
    let h = this.hoursInput.nativeElement.value;
    let t = this.timeInput.nativeElement.value;
    if (h === '' || isNaN(h) || h > 23 || h < 0) {
      h = '00';
    }
    if (t === '' || isNaN(t) || t > 59 || t < 0) {
      t = '00';
    }
    this.hoursValue = this.fixLeadingZero(h);
    this.minsValue = this.fixLeadingZero(t);
  }

  private isValidDate(date: Date): boolean {
    if (date instanceof Date && !isNaN(date.valueOf())) {
      return true;
    }
    return false;
  }

  private isValidGateway(gtwy: string): boolean {
    if (!gtwy || gtwy.length !== 3) {
      this.validationMsg = 'Invalid Gateway';
      return false;
    }
    this.validationMsg = '';
    return true;
  }



  private isValidDateInput(event): boolean {
    const key = event.keyCode;
    return (
      key === 111 ||
      key === 191 ||
      key === 8 ||
      key === 46 ||
      key === 9 ||
      (key > 47 && key < 58) ||
      (key > 95 && key < 106) ||
      (key > 32 && key < 46)
    );
  }

  validateDate(): boolean {
    /*  regex - ?M/?D/YYYY, with a year between 1900 and 2099 */
    const DATE_REGEX = /^(0?[1-9]|1[0-2])\/(0?[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
    if (!DATE_REGEX.test(this.dateInput.nativeElement.value)) {
      this.validationMsg = 'Invalid Date';
      return false;
    }
    this.validationMsg = '';
    return true;
  }
  validateDate2(): boolean {
    /*  regex - ?M/?D/YYYY, with a year between 1900 and 2099 */
    const DATE_REGEX = /^(0?[1-9]|1[0-2])\/(0?[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
    if (!DATE_REGEX.test(this.dateInput1.nativeElement.value)) {
      this.validationMsg = 'Invalid Date';
      return false;
    }
    this.validationMsg = '';
    return true;
  }

  public alphaOnly(event): boolean {
    console.log(event.keyCode);
    const key = event.keyCode;
    return (
      (key >= 65 && key <= 90) ||
      key === 8 ||
      key === 9 ||
      key === 37 ||
      key === 39 ||
      key === 46
    );
  }

  public numberOnly(event): boolean {
    const key = event.keyCode;
    return (
      (key > 95 && key < 106) ||
      (key > 45 && key < 58) ||
      key === 8 ||
      key === 9 ||
      key === 37 ||
      key === 39
    );
  }

  hoursSliderChanged(e) {
    this.hoursValue = this.fixLeadingZero(e);
  }

  minsSliderChanged(e) {
    this.minsValue = this.fixLeadingZero(e);
  }
  hoursSliderChanged1(e) {
    this.hoursValue1 = this.fixLeadingZero(e);
  }

  minsSliderChanged1(e) {
    this.minsValue1 = this.fixLeadingZero(e);
  }

  private getGatewayInfo(gtwy: string): any {
    if (!this.isValidGateway(gtwy)) {
      return;
    }
    return allgtwys.filter(
      (x) => x.gtwy.toUpperCase() === gtwy.toUpperCase()
    )[0];
  }

  public convertToGtwyTime(): void {
    this.validationMsg = '';
    this.makeDateFromInputs();
    this.gtwyInfo = this.getGatewayInfo(this.gtwyInput.nativeElement.value);
    console.log(this.gtwyInfo);
    // TODO pass offsets from gtwyInfo to function that will return time at gtwy
    // Display time at gtwy
  }
  public convertToGtwyTime1(): void {
    this.validationMsg1 = '';
    this.makeDateFromInputs1();
    this.gtwyInfo1 = this.getGatewayInfo(this.gtwyInput1.nativeElement.value);
    console.log(this.gtwyInfo1);
    // TODO pass offsets from gtwyInfo to function that will return time at gtwy
    // Display time at gtwy
  }

  private makeDateFromInputs(): void {
    const inputDate = this.dateInput.nativeElement.value.split('/');
    const date = new Date(inputDate[2], inputDate[0] - 1, inputDate[1]);
    if (
      this.isValidDate(date) &&
      this.isValidGateway(this.gtwyInput.nativeElement.value)
    ) {
      date.setHours(
        this.hoursInput.nativeElement.value,
        this.timeInput.nativeElement.value
      );
      this.isoString = date.toISOString();
      this.localString = date.toLocaleString();
      this.localMilString = date.toString();
    } else {
      console.log('input validation error');
    }
  }
  private makeDateFromInputs1(): void {
    const inputDate = this.dateInput1.nativeElement.value.split('/');
    const date = new Date(inputDate[2], inputDate[0] - 1, inputDate[1]);
    if (
      this.isValidDate(date) &&
      this.isValidGateway(this.gtwyInput1.nativeElement.value)
    ) {
      date.setHours(
        this.hoursInput1.nativeElement.value,
        this.timeInput1.nativeElement.value
      );
      this.isoString1 = date.toISOString();
      this.localString1 = date.toLocaleString();
      this.localMilString1 = date.toString();
    } else {
      console.log('input validation error');
    }
  }
}
