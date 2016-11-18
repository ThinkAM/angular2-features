import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
//Grab everything with import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { ICms, IUser, ISchedule, IField, IScheduleDetails, Pagination, PaginatedResult } from '../interfaces';
import { ItemsService } from '../utils/items.service';
import { ConfigService } from '../utils/config.service';

@Injectable()
export class DataService {

    _baseUrl: string = '';

    constructor(private http: Http,
        private itemsService: ItemsService,
        private configService: ConfigService) {
        this._baseUrl = configService.getApiURI();
    }

    getUsers(): Observable<IUser[]> {
        return this.http.get(this._baseUrl + 'users')
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    getCmsies(): Observable<ICms[]>{
        return this.http.get(this._baseUrl + 'cmsies')
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    getUserSchedules(id: number): Observable<ISchedule[]> {
        return this.http.get(this._baseUrl + 'users/' + id + '/schedules')
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    getCmsFields(id: number): Observable<IField[]> {
        return this.http.get(this._baseUrl + 'cmsies/' + id + '/fields')
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    createUser(user: IUser): Observable<IUser> {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post(this._baseUrl + 'users/', JSON.stringify(user), {
            headers: headers
        })
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    createCms(cms: ICms): Observable<ICms> {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post(this._baseUrl + 'cmsies/', JSON.stringify(cms), {
            headers: headers
        })
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    updateUser(user: IUser): Observable<void> {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.put(this._baseUrl + 'users/' + user.id, JSON.stringify(user), {
            headers: headers
        })
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }

    updateCms(cms: ICms): Observable<void> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.put(this._baseUrl + 'cmsies/' + cms.id, JSON.stringify(cms), {
            headers: headers
        })
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }

    deleteUser(id: number): Observable<void> {
        return this.http.delete(this._baseUrl + 'users/' + id)
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }

    deleteCms(id: number): Observable<void> {
        return this.http.delete(this._baseUrl + 'cmsies/' + id)
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }
    /*
    getSchedules(page?: number, itemsPerPage?: number): Observable<ISchedule[]> {
        let headers = new Headers();
        if (page != null && itemsPerPage != null) {
            headers.append('Pagination', page + ',' + itemsPerPage);
        }

        return this.http.get(this._baseUrl + 'schedules', {
            headers: headers
        })
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }
    */

    getSchedules(page?: number, itemsPerPage?: number): Observable<PaginatedResult<ISchedule[]>> {
        var peginatedResult: PaginatedResult<ISchedule[]> = new PaginatedResult<ISchedule[]>();

        let headers = new Headers();
        if (page != null && itemsPerPage != null) {
            headers.append('Pagination', page + ',' + itemsPerPage);
        }

        return this.http.get(this._baseUrl + 'schedules', {
            headers: headers
        })
            .map((res: Response) => {
                console.log(res.headers.keys());
                peginatedResult.result = res.json();

                if (res.headers.get("Pagination") != null) {
                    //var pagination = JSON.parse(res.headers.get("Pagination"));
                    var paginationHeader: Pagination = this.itemsService.getSerialized<Pagination>(JSON.parse(res.headers.get("Pagination")));
                    console.log(paginationHeader);
                    peginatedResult.pagination = paginationHeader;
                }
                return peginatedResult;
            })
            .catch(this.handleError);
    }

    

    getFields(page?: number, itemsPerPage?: number): Observable<PaginatedResult<IField[]>> {
        var peginatedResult: PaginatedResult<IField[]> = new PaginatedResult<IField[]>();

        let headers = new Headers();
        if (page != null && itemsPerPage != null) {
            headers.append('Pagination', page + ',' + itemsPerPage);
        }

        return this.http.get(this._baseUrl + 'fields', {
            headers: headers
        })
            .map((res: Response) => {
                console.log(res.headers.keys());
                peginatedResult.result = res.json();

                if (res.headers.get("Pagination") != null) {
                    //var pagination = JSON.parse(res.headers.get("Pagination"));
                    var paginationHeader: Pagination = this.itemsService.getSerialized<Pagination>(JSON.parse(res.headers.get("Pagination")));
                    console.log(paginationHeader);
                    peginatedResult.pagination = paginationHeader;
                }
                return peginatedResult;
            })
    }

    getSchedule(id: number): Observable<ISchedule> {
        return this.http.get(this._baseUrl + 'schedules/' + id)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    getScheduleDetails(id: number): Observable<IScheduleDetails> {
        return this.http.get(this._baseUrl + 'schedules/' + id + '/details')
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    getFieldDetails(id: number): Observable<IScheduleDetails> {
        return this.http.get(this._baseUrl + 'schedules/' + id + '/details')
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    updateSchedule(schedule: ISchedule): Observable<void> {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.put(this._baseUrl + 'schedules/' + schedule.id, JSON.stringify(schedule), {
            headers: headers
        })
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }

    updateField(field: IField): Observable<void> {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.put(this._baseUrl + 'fields/' + field.id, JSON.stringify(field), {
            headers: headers
        })
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }

    deleteSchedule(id: number): Observable<void> {
        return this.http.delete(this._baseUrl + 'schedules/' + id)
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }

    deleteField(id: number): Observable<void> {
        return this.http.delete(this._baseUrl + 'fields/' + id)
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }

    deleteScheduleAttendee(id: number, attendee: number) {

        return this.http.delete(this._baseUrl + 'schedules/' + id + '/removeattendee/' + attendee)
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }

    private handleError(error: any) {
        var applicationError = error.headers.get('Application-Error');
        var serverError = error.json();
        var modelStateErrors: string = '';

        if (!serverError.type) {
            console.log(serverError);
            for (var key in serverError) {
                if (serverError[key])
                    modelStateErrors += serverError[key] + '\n';
            }
        }

        modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;

        return Observable.throw(applicationError || modelStateErrors || 'Server error');
    }
}