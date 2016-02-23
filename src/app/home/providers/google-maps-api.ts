import {Injectable} from 'angular2/core';
import {Jsonp, URLSearchParams} from 'angular2/http';

@Injectable()
export class GoogleMapsApi {
    private _promiseApi:Promise<any>;

    constructor(private jsonp:Jsonp) {

        //let elm = _renderer.createElement('body', 'script');
        //let drm = new Promise(function(resolve, reject){
        //    resolve(10);
        //});


    }

    search(term:string, pageToken = null) {
        return this._getGMaps()
            .then(function (gMapAPi:any) {
                console.log('then of load promise....');

                let service = new gMapAPi.api.places.PlacesService(gMapAPi.map);
                service.textSearch({
                    query: term
                }, (searchResult:any, status:any) => {
                    console.log('text search response: ', searchResult, status);
                });
            });
    }

    private _getGMaps():Promise<any> {
        if (this._promiseApi) {
            return this._promiseApi;
        }

        const scriptElm = document.createElement('script');
        scriptElm.type = 'text/javascript';
        scriptElm.async = true;
        scriptElm.defer = true;

        const callbackName:string = `gmapsapireadycallback${new Date().getMilliseconds()}`;
        const apiKey = 'AIzaSyANnIuW5Xvh3WCEH4MLU0nZTMCJDh-gDLI';
        const scriptSrc:string = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${callbackName}&libraries=places`;
        scriptElm.src = scriptSrc;

        this._promiseApi = new Promise<any>((resolve:Function, reject:Function) => {
            window[callbackName] = function () {
                delete window[callbackName];

                var map:any = new window.google.maps.Map(document.getElementById('map-ct'), {
                    center: {lat: -33.866, lng: 151.196},
                    zoom: 17
                });

                resolve({api: window.google.maps, map: map});
            };
            scriptElm.onerror = (err:Event) => {
                reject(err);
            };
        });

        document.body.appendChild(scriptElm);

        return this._promiseApi;
    }
}
