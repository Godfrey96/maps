import { Component, NgZone, ElementRef, ViewChild, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

import axios from 'axios';

import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';

import { } from 'googlemaps';


declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('map') mapElement: ElementRef;

  pois: any[];
  map: any;
  latLng: any;
  markers: any;
  mapOptions: any;

  options: GeolocationOptions;
  currentPos: Geoposition;
  places: Array<any>;
  address: any;
  error: any;
  $refs: any;
  // error: globalThis.PositionError;

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    private geolocation: Geolocation,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    // this.initAutocomplete();
    this.initMap();
    // this.autoComplete();
  }

  autoComplete(){
    let autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      {
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(-24.666664, 30.3166654)
        )
      }
    );

    autocomplete.addListener("place_changed", () => {
      let place = autocomplete.getPlace();
      console.log(place);
      this.showUserLocationOnTheMap(place.geometry.location.lat(), place.geometry.location.lng())
    })
  }

  // data(){
  //   return {
  //     address: "",
  //     error: ""
  //   }
  // }

  initMap() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.getAddressForm(position.coords.latitude, position.coords.longitude);
        this.autoComplete();

        this.showUserLocationOnTheMap(position.coords.latitude, position.coords.longitude);
      },
        error => {
          this.error = "Locator is unable to find your address. Please type your address manually."
          // console.log(this.error);
        }
      )
    } else {
      // this.error = this.error.message
      console.log('Your browser does not support geolocation API');
    }
  }

  showUserLocationOnTheMap(latitude, longitude){
    // Create map object
    let map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: new google.maps.LatLng(latitude, longitude),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // Add Marker
    new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      map: map
    })
  }

  getAddressForm(lat, long) {
    axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=AIzaSyDug8dO2sLm-xN-feiWEyVj5q7dm7sRgNM").then(response => {
      if (response.data.error_message) {
        this.error = response.data.error_message;
        console.log(response.data.error_message)
      } else {
        this.address = response.data.results[0].formatted_address
        console.log(response.data.results[0].formatted_address);
      }
    }).catch(error => {
      this.error = error.message;
      console.log(error.message)
    })
  }

}
