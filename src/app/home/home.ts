import {Component, Renderer, NgZone} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';
import {Http} from 'angular2/http';
import {Router, RouteParams} from 'angular2/router';
import {Observable} from 'rxjs/Observable';

//import {Title} from './providers/title';
import {XLarge} from './directives/x-large';
import {PlaceCard} from '../place-card/place-card';

import {GoogleMapsApi} from './providers/google-maps-api';

class SearchModel {
    term:string;
    items:google.maps.places.PlaceResult[];

    constructor() {
        this.term = '';
        this.items = [];
    }
}

@Component({
    // The selector is what angular internally uses
    // for `document.querySelectorAll(selector)` in our index.html
    // where, in this case, selector is the string 'app'
    selector: 'home',  // <home></home>
    // We need to tell Angular's Dependency Injection which providers are in our app.
    providers: [
        //Title,
    ],
    // We need to tell Angular's compiler which directives are in our template.
    // Doing so will allow Angular to attach our behavior to an element
    directives: [
        ...FORM_DIRECTIVES,
        XLarge,
        PlaceCard
    ],
    // We need to tell Angular's compiler which custom pipes are in our template.
    pipes: [],
    // Our list of styles in our component. We may add more to compose many styles together
    styles: [require('./home.css'), require('../app.css')],
    // Every Angular template is first compiled by the browser before Angular runs it's compiler
    template: require('./home.html')
})
export class Home {
    static mapInstance;

    // TypeScript public modifiers
    searchModel:SearchModel;

    constructor(public http:Http,
                private _router:Router,
                private _routeParams:RouteParams,
                private _googleMapsApi:GoogleMapsApi,
                private _renderer:Renderer,
                private _ngZone:NgZone) {
        this.searchModel = new SearchModel();
        this.searchModel.term = this._routeParams.get('q') || '';
    }

    ngOnInit() {
        var self = this;
        console.log('on init Home component handler, searchModel: ', this.searchModel);


        if (this.searchModel.term) {
            this.getMapInstance()
                .then((map) => {
                    return self._googleMapsApi.getPlacesService(map);
                })
                .then((placeService)=> {
                    placeService.textSearch({query: this.searchModel.term}, (places, status) => {
                        this._ngZone.run(()=> {
                            return self.searchModel.items.splice(0, self.searchModel.items.length, ...places);
                        });
                    });
                    return placeService;
                })
                ['catch'](function (err) {
                console.warn('search exception: ', err);
            });
        }
    }

    onSubmit() {
        this._router.navigate([
            'Home',
            {q: this.searchModel.term}
        ]);
    }

    getMapInstance():Promise<google.maps.Map> {
        Home.mapInstance = Home.mapInstance || new Promise((resolve:Function, reject:Function)=> {
                var g = new GoogleMapsApi();
                g.createMap(document.getElementById('map-ct'))
                    .then((r)=> {
                        resolve(r);
                    }, (r)=> {
                        reject(r);
                    });
            });
        return Home.mapInstance;
    }
}
