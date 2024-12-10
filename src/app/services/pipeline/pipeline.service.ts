import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import {
  AddPipeLine,
  IPipeline,
  IStage,
} from '../../interfaces/pipeline/pipeline';

@Injectable({
  providedIn: 'root',
})
export class PipelineService {
  private apiUrl = 'http://localhost:8080/api/v1/pipelines';

  constructor(private http: HttpClient) {}

  private httpOptions = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getPipelines(): Observable<IPipeline[]> {
    return this.http.get<IPipeline[]>(this.apiUrl, this.httpOptions);
  }

  getPipelineById(id: string): Observable<IPipeline> {
    return this.http.get<IPipeline>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  createPipeline(pipelineData: AddPipeLine): Observable<IPipeline> {
    return this.http.post<IPipeline>(
      `${this.apiUrl}/create`,
      pipelineData,
      this.httpOptions,
    );
  }

  updatePipelineById(
    id: string,
    pipelineData: IPipeline,
  ): Observable<IPipeline> {
    return this.http.put<IPipeline>(
      `${this.apiUrl}/${id}`,
      pipelineData,
      this.httpOptions,
    );
  }

  updatePipelineStage(pipelineId: string, stages: IStage[]): Observable<any> {
    console.log('from service', stages);
    const url = `${this.apiUrl}/${pipelineId}/stages`;
    return this.http.patch(url, stages, this.httpOptions);
  }

  deletePipeline(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  private buildPayload(stages: any[]): any {
    const newStage = stages.map((stage) => {
      const contacts = stage.contacts.map((contact: any) => ({
        _id: contact._id,
        email: contact.email,
        name: contact.name,
        notes: contact.notes,
        phone: contact.phone,
        user: contact.user,
      }));

      return {
        name: stage.name,
        contacts: contacts,
        _id: stage._id,
      };
    });

    return { newStage };
  }
}
