import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CongestionLevel } from '../interfaces/congestion-levels.interface';
import { HttpClient } from '@angular/common/http';
import { Signal } from '../interfaces/signal-config.interface';

@Injectable({
    providedIn: 'root'
})
export class CongestionLevelsService {
    private readonly API_URL = 'http://localhost:8080/api';
    private readonly mockData: CongestionLevel[] = [
        {
            id: 1,
            signalId: 'S-101',
            description: 'Congestion detection for TC Raman Nagar',
            enabled: true,
            ruleExpression: {
                conditions: [
                    { field: 'lmvCount', operator: '>=', value: 150 },
                    { field: 'hmvCount', operator: '>', value: 50 }
                ],
                logic: 'AND'
            }
        },
        {
            id: 2,
            signalId: 'S-102',
            description: 'Congestion detection for CV Raman Nagar',
            enabled: true,
            ruleExpression: {
                conditions: [
                    { field: 'lmvCount', operator: '>=', value: 150 },
                    { field: 'hmvCount', operator: '>', value: 50 }
                ],
                logic: 'OR'
            }
        }
    ];

    // private readonly signals: Signal[] = [
    //     {
    //         signalId: 'S-101', signalLocation: 'TC Palya, KR Puram',
    //         status: '',
    //         createdBy: '',
    //         createdTime: '',
    //         modifiedBy: '',
    //         modifiedTime: '',
    //         signalMetadataId: 0,
    //         rtoCode: '',
    //         rtoLocation: '',
    //         comments: '',
    //         description: ''
    //     },
    //     {
    //         signalId: 'S-102', signalLocation: 'CV Raman Nagar',
    //         status: '',
    //         createdBy: '',
    //         createdTime: '',
    //         modifiedBy: '',
    //         modifiedTime: '',
    //         signalMetadataId: 0,
    //         rtoCode: '',
    //         rtoLocation: '',
    //         comments: '',
    //         description: ''
    //     },
    //     {
    //         signalId: 'S-103', signalLocation: 'Hoskote Road',
    //         status: '',
    //         createdBy: '',
    //         createdTime: '',
    //         modifiedBy: '',
    //         modifiedTime: '',
    //         signalMetadataId: 0,
    //         rtoCode: '',
    //         rtoLocation: '',
    //         comments: '',
    //         description: ''
    //     }
    // ];

    fields = ['hourOfDay', 'lmvCount', 'hmvCount', 'htvCount', 'mcwgCount', 'mgvCount'];
    operators = ['>=', '<=', '>'];
    logicOptions = ['AND', 'OR', 'NONE'];

    constructor(private readonly http: HttpClient) {}

    getCongestionLevels(): Observable<CongestionLevel[]> {
        return this.http.get<CongestionLevel[]>(this.API_URL + '/congestion-rules');
    }

    getFields(): string[] {
        return this.fields;
    }

    getOperators(): string[] {
        return this.operators;
    }

    getLogicOptions(): string[] {
        return this.logicOptions;
    }
    
    setCongestionLevel(congestionLevel: CongestionLevel) {
        return this.http.post<CongestionLevel>(this.API_URL + '/congestion-rules', congestionLevel);
    }

    updateCongestionLevel(congestionLevel: CongestionLevel, id: number) {
        return this.http.put<CongestionLevel>(this.API_URL + '/congestion-rules/' + id, congestionLevel);
    }

    deleteCongestionLevel(id: number) {
        return this.http.delete<CongestionLevel>(this.API_URL + '/congestion-rules/' + id);
    }
}
