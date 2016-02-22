import {Injectable} from 'angular2/core';
import {Jsonp, URLSearchParams} from 'angular2/http';

@Injectable()
export class GoogleMapsApi {
    constructor(private jsonp: Jsonp) {

        //let elm = _renderer.createElement('body', 'script');
        //let drm = new Promise(function(resolve, reject){
        //    resolve(10);
        //});


    }



    search(term: string, pageToken = null) {
        let appKey = 'AIzaSyANnIuW5Xvh3WCEH4MLU0nZTMCJDh-gDLI';
        //let url = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
        let url = 'https://en.wikipedia.org/w/api.php';
        var params = new URLSearchParams();
        params.set('search', term); // the user's search value
        params.set('action', 'opensearch');
        params.set('format', 'json');
        //params.set('key', appKey);
        //params.set('language', 'ru');
        //if (pageToken) {
        //    params.set('pagetoken', pageToken);
        //}
        params.set('callback', 'JSONP_CALLBACK');
        return this.jsonp
            .get(url, {search: params})
            .map(response => response.json());
    }
}
