import {Component, Input} from 'angular2/core';

@Component({
    selector: 'place-card',
    template: require('./place-card.tpl.html')
})
export class PlaceCard {
    @Input()
    place: google.maps.places.PlaceResult;


}
