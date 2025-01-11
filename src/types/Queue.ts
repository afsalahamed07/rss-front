import { RefObject } from "react";
import { EventEmitter } from "../util/EventEmmiter";
import { Data } from "./Data";

export class Queue<T> {
  private items: T[] = [];
  private eventEmeitter: EventEmitter;

  constructor(eventEmeitter: EventEmitter) {
    this.eventEmeitter = eventEmeitter;
  }

  enqueue(item: T) {
    this.items.push(item);
    this.eventEmeitter.emit("queueUpdated");
  }

  dequeue() {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}
