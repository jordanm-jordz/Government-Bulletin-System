import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UserPostData } from '../dashboard/user';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';
import { config, Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database/database';
import * as CryptoJS from "crypto-js";
import { logging } from 'protractor';
import { LoggingService } from 'src/app/logging.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public  myData = [];
  private iCount = 0;
  public p;

  constructor(private log: LoggingService) {
    // Initialize Firebase
    firebase.initializeApp(environment.firebaseConfig);

    console.log("Firebase config done");

    // Data from Firebase
    const rootDebRef = firebase.database().ref();

    rootDebRef.child('Data').once('value', snap => this.ShowData(snap));


  }

  ShowData(snapshot){

    this.p = [snapshot.val()];

    console.log(this.p[0]);

    this.myData = [];
    this.iCount = 0;

    var sxsp = 0;


    for (let i = 1; i <= 9999; i++) {
      if(snapshot.child(i.toString()).val() != null){
        sxsp++;
        this.iCount++;
        var first = snapshot.child(i.toString()).val().FirstName;
        var Sur = snapshot.child(i.toString()).val().Surname;
        var Com = snapshot.child(i.toString()).val().Description;
        this.myData.push(new UserPostData(first,Sur,Com,sxsp.toString()));
      }
      if(sxsp >=this.p[0].length){
        break;
      }
    }
  }

EncryptFile(message: string){
  var encrypted = CryptoJS.AES.encrypt(message, 'Admin44').toString();
  let SaveEncrypted = document.createElement('a');
  SaveEncrypted.download = 'EncryptFile.secure';
  SaveEncrypted.href = 'data:application/json;charset=UNICODE,' + encrypted;
  SaveEncrypted.click();
}
// Save Crypto file
/*
Call myData to save.
*/
SaveCryptoJS(id){
  console.log(id);
  this.iCount--;
  this.SaveCryptoJS(JSON.stringify(this.myData[id]));
}

SaveLogs(message: string){
/*
Download Encrypted file.
*/
  let download = document.createElement('a');
  download.download = 'EncryptFile.secure';
  download.href = 'data:application/json;charset=UNICODE,' + message;
  download.click();
  // this.SaveLogs(JSON.stringify(this.log));
}

  ngAfterViewInit() {

  }


  ngOnInit(): void {

    this.log.info("Successful Logons");
    this.log.info("Access to posts");
  }

  uploadData():void{
    console.log("Works");
  }

  submitted = false;
  model = new UserPostData('','','','');



  btnDeleteClick(id){
    console.log(id);
    this.iCount--;
    firebase.database().ref('/Data/' + id).remove();

    //reload the screen
    const rootDebRef = firebase.database().ref();
    rootDebRef.child('Data').once('value', snap => this.ShowData(snap));
  }

  onSubmit() {
    this.submitted = true;

    this.iCount++;
    var FirstName = this.model.FirstName;
    var LastName = this.model.Surname;
    var Description = this.model.Description;


      let Cnt = 1;

      while (this.p[0][Cnt] != null) {
        Cnt++;
      }


      firebase.database().ref('Data/' + Cnt).set({
        FirstName: FirstName,
        Surname: LastName,
        Description : Description
      });
      console.log("New record added");

      //Refresh the page
      const rootDebRef = firebase.database().ref();
      rootDebRef.child('Data').once('value', snap => this.ShowData(snap));

  }

  SaveFile(){
    let LogFile = document.createElement('a');
      LogFile.download = 'Log.txt';
      LogFile.href = 'data:application/json;charset=UNICODE,' + localStorage.getItem('bullet');
      LogFile.click();
  }

  dowPosts(id){
    console.log(id);
    this.iCount--;
    this.EncryptFile(JSON.stringify(this.myData[id]));
  }

  dowEncryptedLogs(){
    this.SaveLogs(JSON.stringify(this.SaveLogs));
  }
  logout(){
    this.log.info("User has Logged Out");
  }
}
