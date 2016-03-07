import {Injectable} from 'angular2/core';
import {Jsonp, URLSearchParams} from 'angular2/http';

@Injectable()
export class GoogleMapsApi {

    static _promiseGoogleMapsLib:Promise<any> = new Promise((resolve:Function, reject:Function) => {
        const scriptElm = document.createElement('script');
        scriptElm.type = 'text/javascript';
        scriptElm.async = true;
        scriptElm.defer = true;

        const callbackName:string = `gmapsapireadycallback${new Date().getMilliseconds()}`;
        const apiKey = 'AIzaSyANnIuW5Xvh3WCEH4MLU0nZTMCJDh-gDLI';
        const scriptSrc:string = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${callbackName}&libraries=places`;
        const googlePropKey:string = 'google';
        scriptElm.src = scriptSrc;

        window[callbackName] = () => {
            delete window[callbackName];
            resolve(window[googlePropKey].maps);
        };

        scriptElm.onerror = (err:Event) => {
            reject(err);
        };

        document.body.appendChild(scriptElm);
    });


    createMap(element:HTMLElement, mapOptions:google.maps.MapOptions = {zoom: 17}):Promise<google.maps.Map> {
        return GoogleMapsApi._promiseGoogleMapsLib
            .then((lib) => {
                return new lib.Map(element, mapOptions);
            });
    }

    getPlacesService(mapInstance:google.maps.Map):Promise<google.maps.places.PlacesService> {
        return GoogleMapsApi._promiseGoogleMapsLib
            .then((lib) => {
                return new lib.places.PlacesService(mapInstance);
            });
    }

}
