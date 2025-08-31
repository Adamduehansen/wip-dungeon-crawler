interface SocketManagerEvents {
  "status": boolean;
}

type EventHandlerMap = {
  [key in keyof SocketManagerEvents]:
    ((value: SocketManagerEvents[key]) => void)[];
};

export class SocketManager {
  #url: string;
  #webSocket?: WebSocket;

  #eventHandlerMap: EventHandlerMap = {
    status: [],
  };

  get connected(): boolean {
    return this.#webSocket?.readyState === WebSocket.OPEN;
  }

  static #instance: SocketManager | null = null;

  private constructor(url: string) {
    this.#url = url;
  }

  static getInstance(): SocketManager {
    if (this.#instance === null) {
      this.#instance = new SocketManager(import.meta.env.VITE_BACKEND_URL);
    }

    return this.#instance;
  }

  open() {
    const webSocketUrl = new URL("/ws", this.#url);
    this.#webSocket = new WebSocket(webSocketUrl);
    this.#webSocket.addEventListener("open", () => {
      this.#emit("status", true);
    });
    this.#webSocket.addEventListener("error", (event) => {
      console.log(event);
    });
    this.#webSocket.addEventListener("close", () => {
      this.#emit("status", false);
      // TODO: Create a re-connect function.
    });
  }

  #emit<T extends keyof SocketManagerEvents>(
    event: T,
    value: SocketManagerEvents[T],
  ) {
    for (const handler of this.#eventHandlerMap[event]) {
      handler(value);
    }
  }

  on<T extends keyof SocketManagerEvents>(
    event: T,
    handler: (value: SocketManagerEvents[T]) => void,
  ) {
    this.#eventHandlerMap[event].push(handler);
  }
}
