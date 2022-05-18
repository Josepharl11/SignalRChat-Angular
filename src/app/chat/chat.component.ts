import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as signalR from '@microsoft/signalr';
import { NameDialogComponent } from '../shared/name-dialog/name-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ChatService } from '../services/chat.service';
import { chatmessage } from '../ChatMessage/chatmessage';

interface Message {
  userName: string;
  text: string;
}
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
@Injectable()
export class ChatComponent implements OnInit {
  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService
      .retrieveMappedObject()
      .subscribe((receivedObj: chatmessage) => {
        this.addToInbox(receivedObj);
      });
  }

  chatmsg: chatmessage = new chatmessage();
  msgInboxArray: chatmessage[] = [];

  send(): void {
    if (this.chatmsg) {
      if (
        this.chatmsg.userName.length == 0 ||
        this.chatmsg.userName.length == 0
      ) {
        window.alert('Both fields are required.');
        return;
      } else {
        this.chatService.broadcastMessage(this.chatmsg);
      }
    }
  }

  addToInbox(obj: chatmessage) {
    let newObj = new chatmessage();
    newObj.userName = obj.userName;
    newObj.msg = obj.msg;
    this.msgInboxArray.push(newObj);
  }
}
