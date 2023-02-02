import { EventBus, EventCode, Payloads, Registry, Subscriber } from '../core/eventbus'

export class SimpleEventBus implements EventBus {
  private subscribers: Subscriber
  private static nextId = 0;

  constructor() {
    this.subscribers = {}
  }

  async emit<Code extends EventCode>(code: Code, arg: Payloads[Code]): Promise<void> {
    const subscriber = this.subscribers[code]
    if (subscriber === undefined) {
      return
    }

    await Promise.all(Object.keys(subscriber).map((key) => subscriber[key](arg)))
  }

  listen<Code extends EventCode>(
    code: Code,
    callback: (payload: Payloads[Code]) => void
  ): Registry {
    const id = this.getNextId()
    if (!this.subscribers[code]) {
      this.subscribers[code] = {}
    }

    this.subscribers[code][id] = callback

    return {
      unregister: () => {
        delete this.subscribers[code][id]
        if (Object.keys(this.subscribers[code]).length === 0)
          delete this.subscribers[code]
      },
    }
  }

  private getNextId(): number {
    return SimpleEventBus.nextId++
  }
}
