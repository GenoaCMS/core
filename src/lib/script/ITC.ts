type ITCCallback = (data: unknown) => void

interface ITCListener {
  eventName: string,
  cb: ITCCallback
}

class ITC { // Inter Tab Communication
  #broadcastChannel: BroadcastChannel
  #listeners: Array<ITCListener> = []
  constructor (channel: string) {
    this.#broadcastChannel = new BroadcastChannel(channel)
    this.#broadcastChannel.onmessage = event => {
      const eventName = event.data.eventName
      const eventData = event.data.data
      for (const listener of this.#listeners) {
        if (eventName !== listener.eventName) continue
        listener.cb(eventData)
      }
    }
  }

  async once (eventName: string) {
    let resolveEvent: ITCCallback
    const dataPromise = new Promise((resolve) => {
      resolveEvent = resolve
    })
    const listener = {
      eventName,
      cb: function (data) {
        resolveEvent(data)
      }
    } satisfies ITCListener
    this.#listeners.push(listener)
    const data = await dataPromise
    this.#removeListener(listener)
    return data
  }

  on (eventName: string, cb: ITCCallback) {
    const listener = {
      eventName,
      cb
    }
    this.#listeners.push(listener)
  }

  #removeListener (listener: ITCListener) {
    const index = this.#listeners.indexOf(listener)
    if (index === -1) return
    this.#listeners.splice(index, 1)
  }

  send (eventName: string, data?: unknown) {
    const message = {
      eventName,
      data
    }

    this.#broadcastChannel.postMessage(message)
  }

  close () {
    this.#listeners = []
    this.#broadcastChannel.close()
  }
}

export default ITC
