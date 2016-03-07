import {Directive, Input, ElementRef} from 'angular2/core';
import {GoogleMapsApi} from '../home/providers/google-maps-api';

@Directive({
    selector: 'place-map'
})
export class PlaceMap {

    @Input()
    place:google.maps.places.PlaceResult;

    placeMap:google.maps.Map;

    constructor(private element:ElementRef, private _googleMapsApi:GoogleMapsApi) {

    }

    ngOnInit() {
        var self = this;
        console.log('on init place map component: ', this.place);

        this._googleMapsApi.createMap(this.element.nativeElement, {
            center: this.place.geometry.location,
            zoom: 17
        })
        .then((localMap)=> {
            this.placeMap = localMap;
            if(this.place.geometry.viewport) {
                localMap.fitBounds(this.place.geometry.viewport);
            }
        });
    }

}
