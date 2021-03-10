import { Component, NgZone, ElementRef, ViewChild, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import axios from 'axios';

import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';

import { } from 'googlemaps';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { ActivatedRoute } from '@angular/router';


declare var google;

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.page.html',
  styleUrls: ['./autocomplete.page.scss'],
})
export class AutocompletePage implements OnInit {

  @ViewChild('map') mapElement: ElementRef;

  @ViewChild("search") searchElementRef: ElementRef;

  addressForm: FormGroup;

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
  // places: Array<any>;
  places: Array<any> = [];
  $refs: any;

  plcaes: any = {};
  showPlaces: any;
  showLat: any;
  showLng: any;
  leina: any;

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    private geolocation: Geolocation,
    private ngZone: NgZone,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.completeAddress();
    this.initMap();
  }

  completeAddress() {
    this.addressForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      completeAddress: ['', Validators.required]
    });
  }

  autoComplete() {
    const autocomplete = new google.maps.places.Autocomplete(
      this.searchElementRef.nativeElement,
      // document.getElementById("autocomplete"),
      {
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(-24.666664, 30.3166654)
        )
      });
    autocomplete.addListener("place_changed", () => {
      // console.log("Autocomplete ADDRESS: ", autocomplete.getPlace());
      const place = autocomplete.getPlace();
      this.plcaes = Object.assign({ 'address': place.name }, { 'vicinity': place.vicinity }, { 'lat': place.geometry.location.lat() }, { 'lng': place.geometry.location.lng() })
      console.log('ADDRESS: ', this.plcaes)

      this.showUserLocationOnTheMap(place.geometry.location.lat(), place.geometry.location.lng());
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

    firebase.firestore().collection('maps').onSnapshot(res => {
      res.forEach(doc => {
        this.places.push(Object.assign(doc.data(), { uid: doc.id }));

        // Create map object
        let map = new google.maps.Map(document.getElementById("map"), {
          zoom: 15,
          center: new google.maps.LatLng(latitude, longitude),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        for (let i = 0; i < this.places.length; i++) {
          const lat = this.places[i].completeAddress.lat;
          const lng = this.places[i].completeAddress.lng;
          console.log('lalll: ', this.lat)
          console.log('longgg: ', this.lng)
          console.log('diplekes', this.places[i].completeAddress)

          const infoTitle = `<div>
                            ${this.places[i].firstName}<br>
                            ${this.places[i].completeAddress.address}
                            </div>`

          const infoWindow = new google.maps.InfoWindow({
            content: infoTitle
          });

          const marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            title: this.places[i].firstName,
            map: map
          });

          google.maps.event.addListener(marker, "click", () => {

            infoWindow.open(map, marker);

          })

        }

      })
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

  submit() {
    firebase.firestore().collection('maps').add({
      firstName: this.addressForm.value.firstName,
      lastName: this.addressForm.value.lastName,
      completeAddress: this.plcaes
      // places: this.plcaes
    }).then((doc) => {
      doc.set({ addressId: doc.id }, { merge: true }).then(() => {
        console.log('Address added')
      })
      this.addressForm.reset();
    })

  }

}
