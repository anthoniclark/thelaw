import { Component, OnInit } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Router } from '@angular/router';
import { CommonService } from '../../../../shared/services/common.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html'
})
export class TimerComponent implements OnInit {
  started: boolean = false;
  seconds: number = 0;
  minutes: number = 0;
  hours: number = 0;
  running: boolean = false;
  interval: any;
  onehour: number = 3600000;
  onemin: number = 60000;
  onesec: number = 1000;
  totalElapsed;
  startTime;
  HoursSpend: string;

  constructor(public router: Router, private commonService: CommonService) { }

  ngOnInit() {
  }

  onCancelClick() {
    swal({
      title: 'Confirmation',
      text: "Are you sure want to cancel this timer?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: true,
      reverseButtons: false,
    }).then((result) => {
      if (result.value) {
        this.started = false;
        this.running = false;
        this.seconds = 0;
        this.minutes = 0;
        this.hours = 0;
        this.HoursSpend = '';
        clearInterval(this.interval);

      }
    }).catch(() => { });
  }

  SaveClick(e, op3: OverlayPanel) {
    this.started = false;
    this.running = false;
    this.seconds = 0;
    this.minutes = 0;
    this.hours = 0;
    op3.hide();
    clearInterval(this.interval);
    setTimeout(() => {
      this.commonService.hourSpend.next(this.HoursSpend);
      this.HoursSpend = '';
    }, 500);
    this.router.navigate(['/case/undefined/time-tracking/new']);
  }

  timerClick(e, op3: OverlayPanel) {
    debugger;
    if (this.started) {
      op3.toggle((e));
    } else {
      this.started = true;
      this.toggleTimer();
    }
  }

  toggleTimer() {
    this.running = !this.running;
    if (this.running) {
      this.startTime = (new Date).getTime();
      this.interval = setInterval(() => {
        this.updateTime();
      }, 1000);
    } else {
      clearInterval(this.interval);
    }
  }

  updateTime() {
    this.seconds++;
    if (this.seconds === 60) {
      this.seconds = 0;
      this.minutes++;
      if (this.minutes === 60) {
        this.minutes = 0;
        this.hours++;
      }
    }
    this.updateWatch();
  }

  updateWatch() {
    setTimeout(() => {
      const hours = ((this.hours * 60) + this.minutes + (this.seconds / 60)) / 60;
      this.HoursSpend = Math.round(hours * 100) / 100 + 'h';
    });
  }

  changeHourSpend(e) {
    debugger;
    const timeValue = this.convertTextToDecimal(this.HoursSpend);
    this.setElapsed(timeValue.hours, timeValue.minutes, 0);
    setTimeout(() => {
      let elapsed = this.getElapsed();
      this.hours = elapsed.hours;
      this.minutes = elapsed.minutes;
      this.seconds = elapsed.seconds;
      var hours = ((elapsed.hours * 60) + elapsed.minutes + (elapsed.seconds / 60)) / 60;
      this.HoursSpend = Math.round(hours * 100) / 100 + "h";
    }, 100);
  }

  convertTextToDecimal(text) {
    var whatsLeft = text;
    var hours = 0;
    var minutes = 0;
    if (whatsLeft.indexOf("h") > 0) {
      var arrHours = whatsLeft.split("h");
      hours = parseFloat(arrHours[0]);
      if (arrHours[1] != null) {
        whatsLeft = arrHours[1];
      }
      else {
        whatsLeft = "";
      }
    }
    if (whatsLeft.indexOf("m") > 0) {
      var arrMinutes = whatsLeft.split("m");
      minutes = parseFloat(arrMinutes[0]);
    }

    if (whatsLeft.indexOf(":") > 0) {
      var arrClock = whatsLeft.split(":");
      hours = parseFloat(arrClock[0]);
      minutes = parseFloat(arrClock[1]);
    }

    if (hours + minutes == 0 && parseFloat(whatsLeft) == NaN) {
      hours = parseFloat(whatsLeft);
    }

    if (hours + minutes == 0 && parseFloat(whatsLeft) != NaN) {
      hours = parseFloat(whatsLeft);
    }

    if (hours + minutes == 0) {
      // $("#TimeEntry_Hours_TimeString").addClass("input-validation-error");
      // $("#TimeEntry_Hours").val(null);
    }
    else {
      //$("#TimeEntry_Hours_TimeString").removeClass("input-validation-error");
    }

    var value = { hours: hours, minutes: minutes, decimal: (hours + (minutes / 60)) };

    return value;
  }

  setElapsed(n, t, i) {
    this.totalElapsed = 0;
    this.totalElapsed += n * this.onehour;
    this.totalElapsed += t * this.onemin;
    this.totalElapsed += i * this.onesec;
    this.totalElapsed = Math.max(this.totalElapsed, 0)
  }

  getElapsed() {
    var t: number = 0, i: number = 0, r: number = 0;
    let n: number = 0, u;
    return this.running && (n = (new Date).getTime() - this.startTime),
      n += this.totalElapsed,
      t = parseInt((n / this.onehour).toString()),
      n %= this.onehour,
      i = parseInt((n / this.onemin).toString()),
      n %= this.onemin,
      r = parseInt((n / this.onesec).toString()),
      u = n % this.onesec,
      { hours: t, minutes: i, seconds: r, milliseconds: u }
  }

}
