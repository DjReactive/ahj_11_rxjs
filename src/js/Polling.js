import { ajax } from 'rxjs/ajax';
import { map, interval, catchError } from 'rxjs';
import AppFunc from './AppFunc';

export default class Polling {
  constructor() {
    this.serverURL = 'http://localhost:7070';
    this.messages = null;
    this.loader = null;
    this.feed = document.getElementById('feed');
    this.divLoader = this.feed.querySelector('.feed__loader');
    this.msgFeed = this.feed.querySelector('.feed__messages');
  }

  init() {
    const updater$ = interval(2000);
    updater$.pipe(
      map(() => {
        this.addLoader();
        ajax.getJSON(this.serverURL + '/messages/unread')
        .pipe(map(value => value.messages))
        .subscribe(value => this.update(value), err => this.update([]));
      })
    ).subscribe();
  }

  update(messages) {
    this.removeLoader();
    if (JSON.stringify(messages) === JSON.stringify(this.messages)) return;
    messages.forEach(m => {
      this.msgFeed.insertAdjacentElement('afterbegin', this.addMsgElement(m));
    });
    this.messages = messages;
  }

  addMsgElement(message) {
    const msg = document.createElement('div');
    msg.innerHTML =
    `<div class="feed__message" id="${message.id}">
      <div class="message__author">${this.replacer(message.from, 24)}</div>
      <div class="message__title">${this.replacer(message.subject)}</div>
      <div class="message__created">${AppFunc.getFormatedDate(message.received)}</div>
    </div>`;
    return msg;
  }

  replacer(title, count = 15) {
    if (title.length > count) return title.substr(0, count) + '...';
    return title;
  }

  addLoader() {
    this.removeLoader();
    this.divLoader.classList.add('active');
    const img = document.createElement('img');
    img.classList.add('loader');
    img.setAttribute('src', 'images/tail-spin.svg');
    this.loader = img;
    this.divLoader.appendChild(img);
  }

  isLoader() {
    return !!(this.loader);
  }

  removeLoader() {
    if (this.isLoader()) {
      this.divLoader.classList.remove('active');
      this.loader.remove(); this.loader = null;
    }
  }
}
