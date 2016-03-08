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
    term:string = null;
    items:google.maps.places.PlaceResult[] = [];
    pagination:google.maps.places.PlaceSearchPagination = null;
    waitForResponse:boolean = false;
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
    static s_promiseMapInstance:Promise<google.maps.Map>;
    static s_searchModel:SearchModel = new SearchModel();

    searchModel:SearchModel;
    searchTermInput:string;

    constructor(public http:Http,
                private _router:Router,
                private _routeParams:RouteParams,
                private _googleMapsApi:GoogleMapsApi,
                private _renderer:Renderer,
                private _ngZone:NgZone) {
        this.searchModel = Home.s_searchModel;
    }

    ngOnInit() {
        var self = this;
        this.searchTermInput = this._routeParams.get('q');

        if (this.searchTermInput !== this.searchModel.term) {
            this.searchModel.term = this.searchTermInput;
            this.searchModel.items.length = 0;
            this.searchModel.pagination = null;
            this.doNewSearch();
        }
    }

    onSubmit() {
        this._router.navigate([
            'Home',
            {q: this.searchTermInput}
        ]);
    }

    onClickMoreButton() {
        if (!(this.searchModel.pagination && this.searchModel.pagination.hasNextPage && !this.searchModel.waitForResponse)) {
            return;
        }
        this.searchModel.waitForResponse = true;
        this.searchModel.pagination.nextPage();
    }

    getMapInstance():Promise<google.maps.Map> {
        Home.s_promiseMapInstance = Home.s_promiseMapInstance || new Promise((resolve:Function, reject:Function)=> {
                var g = new GoogleMapsApi();
                g.createMap(document.getElementById('map-ct'))
                    .then((r)=> {
                        resolve(r);
                    }, (r)=> {
                        reject(r);
                    });
            });
        return Home.s_promiseMapInstance;
    }

    private doNewSearch() {
        var self = this;

        if (this.searchModel.waitForResponse) {
            return;
        }

        if (!this.searchModel.term) {
            this.searchModel.items.length = 0;
            this.searchModel.pagination = null;
            return;
        }

        this.searchModel.waitForResponse = true;
        this.getMapInstance()
            .then((map) => {
                return self._googleMapsApi.getPlacesService(map);
            })
            .then((placeService)=> {
                placeService.textSearch({query: self.searchModel.term}, this.onSearchResponse.bind(self));
                return placeService;
            })
            ['catch'](function (err) {
            console.warn('search exception: ', err);
        });
    }

    private onSearchResponse(places:google.maps.places.PlaceResult[], status:string, pagination:google.maps.places.PlaceSearchPagination = null) {
        var self = this;
        console.log('Search response args: ', places, status, pagination);
        this._ngZone.run(()=> {
            this.searchModel.waitForResponse = false;
            this.searchModel.pagination = pagination;
            return Array.prototype.push.apply(this.searchModel.items, places);
        });
    }
}
