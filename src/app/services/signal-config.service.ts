import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { OverrideRequest, Signal, SignalStatus } from '../interfaces/signal-config.interface';

@Injectable({
    providedIn: 'root'
})
export class SignalConfigService {
    private readonly API_URL = 'http://localhost:8080/api';

    constructor(private readonly http: HttpClient) { }

    getSignals(params?: Signal): Observable<Signal[]> {
        return this.http.get<Signal[]>(this.API_URL + '/traffic-signal-metadata/search', { params: params as Signal & HttpParams });
    }

    addSignalMetadata(signal: Signal): Observable<Signal> {
        return this.http.post<Signal>(this.API_URL + '/traffic-signal-metadata', signal);
    }

    updateSignalMetadata(id: number, signal: Signal): Observable<Signal> {
        return this.http.put<Signal>(`${this.API_URL}/traffic-signal-metadata/${id}`, signal);
    }

    // downloadSignals(signal: Signal): Observable<> {
    //     return this.http.post<Signal>(this.API_URL + '/traffic-signal-metadata/export/excel', signal);
    // }

    deleteSignal(id: number, params?: Signal): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/traffic-signal-metadata/${id}`, { params: new HttpParams().set('comments', params?.comments || '').set('modifiedBy', params?.modifiedBy || '') });
    }

    reactivateSignal(id: number, params?: Signal): Observable<void> {
        return this.http.put<void>(`${this.API_URL}/traffic-signal-metadata/${id}/reactivate?comments=${params?.comments || ''}&modifiedBy=${params?.modifiedBy || ''}`, {});
    }

    getSignalStatus() {
        return this.http.get<SignalStatus[]>(this.API_URL + '/signals/status');
    }

    loadTrafficData(region?: string): Observable<any> {
        return this.http.get<any>(`http://localhost:9091/launch/readAndPublishDelimitedFileParserJob/job/${region}`);
    }

    updateOverride(overrideRequest: OverrideRequest) {
        return this.http.put(`${this.API_URL}/manual-overrides/${overrideRequest.signalId}`, overrideRequest);
    }

    uploadFile(file: File, username: string): Observable<any> {
        const formData = new FormData();
        // The key 'file' must match the backend's expected parameter name.
        formData.append('file', file);

        const params = new HttpParams()
            .set('username', username);

        // Make the POST request
        return this.http.post(`${this.API_URL}/traffic-signal-metadata/bulk-upload`, formData, {
            params: params,
            responseType: 'text' as 'json',
        });
    }
}
