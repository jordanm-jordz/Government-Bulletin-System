import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  debug(message: string)   {
    let logEntry = this.createLogStatement('debug', message)
    console.info(logEntry);
    return logEntry;
  }

  error(message: string) {
    let logEntry = this.createLogStatement('error', message)
    console.error(logEntry);
    return logEntry;
  }

  warn(message: string)  {
    let logEntry = this.createLogStatement('warning', message)
    console.warn(logEntry);
    return logEntry;
  }

  public info(message: string) {
    let logEntry = this.createLogStatement('User signed in', message)
    console.info(logEntry);
    return logEntry;
  }

  createLogStatement (level, message) {
    var temp = localStorage.getItem("logs");

    let SEPARATOR = " ";
    let date = this.getCurrentDate();
    temp += "[" + level + "]" + SEPARATOR + date + SEPARATOR + message;
    localStorage.setItem("logs", temp);
    return temp;
  }

  getCurrentDate () {
    let now = new Date();
    return "[" + now.toLocaleString() + "]";
  }


  constructor() { }

}
