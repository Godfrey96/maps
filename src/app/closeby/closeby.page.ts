import { Component, NgZone, ElementRef, ViewChild, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

import axios from 'axios';

import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';

import { } from 'googlemaps';


declare var google;

@Component({
  selector: 'app-closeby',
  templateUrl: './closeby.page.html',
  styleUrls: ['./closeby.page.scss'],
})
export class ClosebyPage implements OnInit {

  @ViewChild('map') mapElement: ElementRef;

  pois: any[];
  // map: any;
  latLng: any;
  markers: any;
  mapOptions: any;

  options: GeolocationOptions;
  currentPos: Geoposition;

  address: any;
  error: any;
  apiKey: any = 'AIzaSyDug8dO2sLm-xN-feiWEyVj5q7dm7sRgNM';
  lat: any;
  lng: any;
  type: any;
  radius: any;
  places: Array<any>;
  $refs: any;


  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    private geolocation: Geolocation,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.initMap();
  }

  autoComplete() {
    let autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      // this.$refs["autocomplete"],
      {
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(-24.666664, 30.3166654)
        )
      }
    );

    autocomplete.addListener("place_changed", () => {
      let place = autocomplete.getPlace();
      this.address = place.formatted_address;
      this.lat = place.geometry.location.lat();
      this.lng = place.geometry.location.lng();
      // console.log('PLACE: ', place);
      // console.log('ADDRESS: ', this.address);
      // console.log('LATITUDE: ', this.lat);
      // console.log('LONGITUDE: ', this.lng);
      this.showUserLocationOnTheMap(place.geometry.location.lat(), place.geometry.location.lng())
    })
  }

  initMap() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
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

  showUserLocationOnTheMap(latitude, longitude) {
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
    axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=" + this.apiKey).then(response => {
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

  findCloseByPlace() {

    // https://cors-anywhere.herokuapp.com/
    const URL = `https://corsanywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.lat},${this.lng}&type=${this.type}&radius=${this.radius * 1000}&key=${this.apiKey}`;
    axios.get(URL).then(response => {
      this.places = response.data.results;
      this.showPlacesOnMap();
      console.log('PLACES: ', this.places)
      console.log()
      console.log('Respondr: ', response)
    }).catch(error => {
      this.error = error.message;
    })
  }

  showPlacesOnMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: new google.maps.LatLng(this.lat, this.lng),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    const infoWindow = new google.maps.InfoWindow();

    for (let i = 0; i < this.places.length; i++) {
      const lat = this.places[i].geometry.location.lat;
      const lng = this.places[i].geometry.location.lng;
      const placeID = this.places[i].place_id;

      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map
      });

      google.maps.event.addListener(marker, "click", () => {
        const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?key=${this.apiKey}&place_id=${placeID}`;

        axios.get(URL).then(response => {
          if (response.data.error_message) {
            this.error = response.data.error_message
          } else {
            const place = response.data.result;
            console.log(place)

            infoWindow.setContent(
              `<div class="ui header">${place.name}</div>
              ${place.formatted_address} <br>
              ${place.formatted_phone_number} <br>
              <a href="${place.website}" target="_blank">${place.website}</a>
              `
            );
            infoWindow.open(map, marker);
          }
        }).catch(error => {
          this.error = error.message;
        });
      });
    }

  }

}
