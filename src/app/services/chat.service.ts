import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { chatmessage } from '../ChatMessage/chatmessage';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private connection: any = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:7254/chatsocket')
    .configureLogging(signalR.LogLevel.Information)
    .build();
  readonly POST_URL = 'http://localhost:7254/Chat/chatHub';

  private receivedMessageObject: chatmessage = new chatmessage();
  private sharedObj = new Subject<chatmessage>();

  constructor(private http: HttpClient) {
    this.connection.onclose(async () => {
      await this.start();
    });
    this.connection.on('ReceiveOne', (userName: string, msg: string) => {
      this.mapReceivedMessage(userName, msg);
    });
    this.start();
  }

  public async start() {
    try {
      await this.connection.start();
      console.log('connected');
    } catch (err) {
      console.log(err);
      setTimeout(() => this.start(), 5000);
    }
  }

  private mapReceivedMessage(userName: string, msg: string): void {
    this.receivedMessageObject.userName = userName;
    this.receivedMessageObject.msg = msg;
    this.sharedObj.next(this.receivedMessageObject);
  }

  public broadcastMessage(chatmsg: any) {
    this.http
      .post(this.POST_URL, chatmsg)
      .subscribe((data) => console.log(data));
  }

  public retrieveMappedObject(): Observable<chatmessage> {
    return this.sharedObj.asObservable();
  }
}
