import { DOCUMENT } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable, Subscribable, catchError, firstValueFrom, lastValueFrom, map } from "rxjs";

@Injectable()
export class ApiService {

    private api: string;

    constructor(
        private http: HttpClient,
        @Inject(DOCUMENT) private injectedDocument: any
    ) {
        if(this.injectedDocument.location.hostname == "localhost") {
            this.api = "http://localhost:"+window.location.port+"/php/connection.php";
        } else {
            this.api = "https://silberfeier-behrens.site/php/connection.php";
        }
    }

    getApiUrl() {
        return this.api;
    }

    async checkPassword(password: string): Promise<boolean> {
        return await firstValueFrom(
            this.http.post<any>(this.api, {
                'type': 'sw_password_check',
                'data': {
                  password: password
                }
            }).pipe(
                catchError((error: object) => {
                    console.log(error);
                    return null;
                }),
                map((data: object) => {
                    if(data['login']) {
                        return true;
                    }
                    return false;
                }
            ))
        );
    }

    async grabData(): Promise<any> {
        return await lastValueFrom(this.http.post<any>(this.api, {
            'type': 'sw_data_grab'
        }).pipe(
            catchError((error: object) => {
                console.log(error);
                return null;
            }),
            map((data: object) => {
                return data;
            })
        ));
    }

    async grabImages(): Promise<any> {
        return await lastValueFrom(this.http.post<any>(this.api, {
            'type': 'sw_gallery_grab'
        }).pipe(
            catchError((error: object) => {
                console.log(error);
                return null;
            }),
            map((images: object) => {
                return images;
            })
        ));
    }

    initUploadProcess(form_data: FormData): Observable<any> {
        return this.http.post(this.api, form_data, {
            reportProgress: true,
            observe: 'events'
        });
    }
}

