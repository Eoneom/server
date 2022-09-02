import { EventBus, EventCode, Payloads, Registry, Subscriber } from '../core/eventbus'

export class SimpleEventBus implements EventBus {
  private subscribers: Subscriber
  private static nextId = 0;

  constructor() {
    this.subscribers = {}
  }

  async emit<Code extends EventCode>(event: Code, arg: Payloads[Code]): Promise<void> {
    const subscriber = this.subscribers[event]

    if (subscriber === undefined) {
      return
    }

    await Promise.all(Object.keys(subscriber).map((key) => subscriber[key](arg)))
  }

  listen<Code extends EventCode>(
    event: Code,
    callback: (payload: Payloads[Code]) => void
  ): Registry {
    const id = this.getNextId()
    if (!this.subscribers[event]) this.subscribers[event] = {}

    this.subscribers[event][id] = callback

    return {
      unregister: () => {
        delete this.subscribers[event][id]
        if (Object.keys(this.subscribers[event]).length === 0)
          delete this.subscribers[event]
      },
    }
  }

  private getNextId(): number {
    return SimpleEventBus.nextId++
  }
}
