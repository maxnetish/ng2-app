import {Component, Input, NgZone} from 'angular2/core';
import {PlaceMap} from './place-map';
import {GoogleMapsApi} from '../home/providers/google-maps-api';

@Component({
    selector: 'place-card',
    template: require('./place-card.tpl.html'),
    styles: [require('./place-card.css')],
    directives: [
        PlaceMap
    ],
})
export class PlaceCard {
    @Input()
    place:google.maps.places.PlaceResult;

    photoUrlsCacheBig:string[] = [];
    photoUrlsCacheMini:string[] = [];
    mapVisible:boolean = false;
    detailsLoaded:boolean = false;

    private photoMiniHeight:number = 180;
    private photoMiniWidth:number = 360;
    private photoBigHeight:number = 800;
    private photoBigWidth:number = 1600;

    constructor(private _googleMapsApi:GoogleMapsApi, private _ngZone:NgZone) {
    }

    onLoadDetailsButtonClick() {
        var self = this;
        this._googleMapsApi.getPlacesService()
            .then((service)=> {
                service.getDetails({placeId: this.place.place_id}, (details, status)=> {
                    this._ngZone.run(()=> {
                        console.log('details repsonse: ', details, status);
                        self.place = details;
                        self.updatePhotoUrls.bind(self)();
                        self.detailsLoaded = true;
                    });
                });
            });
    }

    ngOnInit() {
        this.updatePhotoUrls();
    }

    private updatePhotoUrls() {
        this.photoUrlsCacheMini.length = 0;
        this.photoUrlsCacheBig.length = 0;
        this.place.photos = this.place.photos || [];
        for (var photoInd = 0, photoLen = this.place.photos.length; photoInd < photoLen; photoInd++) {
            this.photoUrlsCacheMini.push(this.place.photos[photoInd].getUrl({
                maxHeight: this.photoMiniHeight,
                maxWidth: this.photoMiniWidth
            }));
            this.photoUrlsCacheBig.push(this.place.photos[photoInd].getUrl({
                maxHeight: this.photoBigHeight,
                maxWidth: this.photoBigWidth
            }));
        }
    }
}
