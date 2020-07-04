import { Injectable } from '@angular/core';
import { s3Creds } from './../../../environments/environment';
import * as S3 from 'aws-sdk/clients/s3'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private bucket: S3;
  constructor() { 
    this.bucket = new S3({
      accessKeyId: s3Creds.accessKeyId,
      secretAccessKey: s3Creds.secretAccessKey,
      region: s3Creds.region
    })
  }

  upload(folder, file: File): Observable<any>{
    return Observable.create(observer => {
      const params = {
        Bucket: s3Creds.bucket,
        Key: `${folder}/${file.name}`,
        Body: file,
        ACL: 'public-read',
        ContentType: file.type // contentType
    };
      
      return this.bucket.upload(params, (err, data) => {
        if (err) {
          // this.logger.debug('There was an error uploading your file: ', err);
          observer.error(err);
        }
        // this.logger.debug('Successfully uploaded file.', data);
        observer.next(data);
        observer.complete();
      })
    })
    
  }
}
