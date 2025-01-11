export class EventEmitter {
  private events: Record<string, ((data?: any) => void)[]> = {};

  on(event: string, listener: (data?: any) => void) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  emit(event: string, data?: any) {
    if (this.events[event]) {
      this.events[event].forEach((listener) => listener(data));
    }
  }

  off(event: string, listener: (data?: any) => void): void {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((l) => l !== listener);
    }
  }
}
