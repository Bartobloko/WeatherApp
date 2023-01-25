import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.scss']
})
export class WeatherDisplayComponent implements OnInit {

  constructor(private httpClient:HttpClient) { }

  ngOnInit(): void {
    this.getLocation(1);
  }

  backgroundClass = "default";
  date = new Date;
  weatherData:any;
  showWeather=false;
  time = [];
  repeat =0;
  currentDay=0;
  element ="";
  showElements = {
    inputForGeoCord:false,
    current: false,
    last:false,
    history:false,
    errorPopup:false,
  };
  currentTime = {
    hour: 0,
    day: 0,
    month: 0,
  };

 
  
  getLocation(a:number) {
      if (a==1) {
        navigator.geolocation.getCurrentPosition(this.showPosition); 
      } else {  
        navigator.geolocation.getCurrentPosition(this.showPosition,this.getLocationError); 
      }
      
  }; 

  showPosition = (position:any) => {
    let g = position.coords.latitude;
    let lon = position.coords.longitude;
    this.showElements.errorPopup=false;
    this.getData(g,lon);
    //@ts-ignore
  };

  getLocationError = () => {
    this.showElements.errorPopup=true;
    this.showElements.inputForGeoCord=false;
    this.showWeather = false;
  }

  submitForm(lat:any , lng:any) {
    this.getData(lat.value,lng.value);
  };

  getData(lat:any , lng:any) {
    this.showWeather = true;
    this.showElements["inputForGeoCord"] = false;
    console.log(lat);
    this.httpClient.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`)
    .subscribe((res:any) => {
      this.weatherData = res;
      this.findTodayDate();
    });
  };

  findTodayDate () {
    this.repeat=0;
    this.time =this.weatherData.hourly.time;
    this.time.forEach((el) => {
      this.element = el;
      this.currentTime.day = parseInt(this.element.slice(8,10));
      this.currentTime.month = parseInt(this.element.slice(5,7));
      this.currentTime.hour = parseInt(this.element.slice(11,13));
      if(this.currentTime.day==this.date.getDate() && this.currentTime.month==(this.date.getMonth()+1) && this.currentTime.hour == this.date.getHours()){
        this.currentDay = this.repeat;
        this.showProperBackground(this.currentDay);
      }else {
        this.repeat++;
      };
    });
  };

  showElement(keyName:any ) {
    if(keyName == "inputForGeoCord"){
      this.showWeather = false;
      this.showElements.errorPopup=false;
    }
    //@ts-ignore
    this.showElements[keyName] = !this.showElements[keyName];
  };

  showProperBackground(data:any) {
    if(this.weatherData.hourly.temperature_2m[data] >20) {
      this.backgroundClass="sunny"
    } else if(this.weatherData.hourly.temperature_2m[data]>13){
      this.backgroundClass="normal"
    } else if (this.weatherData.hourly.temperature_2m[data]>1) {
      this.backgroundClass="cold"
    } else {
      this.backgroundClass="freezing"
    }
  }

   


}
