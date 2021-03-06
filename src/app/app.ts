/*
 * Angular 2 decorators and services
 */
import {Component} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {FORM_PROVIDERS} from 'angular2/common';

import {RouterActive} from './directives/router-active';
import {Home} from './home/home';
import {About} from './about/about';

import {GoogleMapsApi} from './home/providers/google-maps-api';
/*
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'app',
    providers: [...FORM_PROVIDERS, GoogleMapsApi],
    directives: [...ROUTER_DIRECTIVES, RouterActive],
    pipes: [],
    styles: [require('./app.css')],
    template: require('./app.tpl.html')
})
@RouteConfig([
    {path: '/', component: Home, name: 'Home'},
    {path: '/about', component: About, name: 'About'},
    {path: '/**', redirectTo: ['Home']}
])
export class App {
    name = 'ng2-app2';

    constructor() {

    }
}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 * or via chat on Gitter at https://gitter.im/AngularClass/angular2-webpack-starter
 */
