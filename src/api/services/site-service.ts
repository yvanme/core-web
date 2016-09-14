import {Injectable} from '@angular/core';
import {ApiRoot} from '../persistence/ApiRoot';
import {CoreWebService} from './core-web-service';
import {Observable} from 'rxjs/Rx';
import {RequestMethod, Http} from '@angular/http';
import {Observer} from 'rxjs/Observer';
import {Subject} from 'rxjs/Subject';
import {LoginService} from './login-service';

@Injectable()
export class SiteService extends CoreWebService {

    private allSiteUrl: string;
    private switchSiteUrl: string;

    private site: Site;
    private sites: Site[];

    private _switchSite$: Subject<Site> = new Subject();
    private _sites$: Subject<Site[]> = new Subject();

    constructor(apiRoot: ApiRoot, http: Http, loginService: LoginService) {
        super(apiRoot, http);

        this.allSiteUrl = `${apiRoot.baseUrl}api/v1/site/currentSite`;
        this.switchSiteUrl = `${apiRoot.baseUrl}api/v1/site/switch`;

        if (loginService.loginUser) {
            this.loadSites();
        }

        loginService.loginUser$.subscribe(user => this.loadSites());
    }

    switchSite(siteId: String): Observable<any> {
        return this.requestView({
            method: RequestMethod.Put,
            url: `${this.switchSiteUrl}/${siteId}`,
        }).map(response => {
            this.setCurrentSiteIdentifier(siteId);
            return response;
        });
    }

    get switchSite$(): Observable<Site> {
        return this._switchSite$.asObservable();
    }

    get sites$(): Observable<Site[]> {
        return this._sites$.asObservable();
    }

    private setCurrentSiteIdentifier(siteIdentifier: string): void {
        this.site = Object.assign({}, this.sites.filter( site => site.identifier === siteIdentifier)[0]);
        this._switchSite$.next(this.site);
    }

    private loadSites(): void {

        this.requestView({
            method: RequestMethod.Get,
            url: this.allSiteUrl,
        }).subscribe(response => {
            this.setSites(response.entity.sites);
            this.setCurrentSiteIdentifier(response.entity.currentSite);
        });
    }

    private setSites(sites: Site[]): void {
        this.sites = sites;
        this._sites$.next(this.sites);
    }

    get currentSite(): Site{
        return this.site;
    }
}

export interface Site {
    hostName: string;
    type: string;
    identifier: string;
}