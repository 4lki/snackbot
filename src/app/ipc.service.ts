import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import { EventEmitter } from 'events';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable()
export class IpcService {
  private _ipc: IpcRenderer | any = void 0;

  constructor() {
    this._ipc = io(`${location.hostname}:${environment.wsPort}` )

    /*  if (window.require) {
      try {
        this._ipc = window.require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }
    } else {
      this._ipc = new EventEmitter();
      this._ipc.send = this._ipc.emit;
      console.log(this._ipc)
      console.warn('Electron\'s IPC was not loaded');
    } */
  }

  public on(channel: string, listener: any): void {
    if (!this._ipc) {
      return;
    }
    this._ipc.on(channel, listener);
  }

  public send(channel: string, ...args): void {
    if (!this._ipc) {
      return;
    }
    this._ipc.emit(channel, ...args);
  }

}