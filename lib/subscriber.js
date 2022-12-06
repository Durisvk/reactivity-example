export const SubscribeSymbol = Symbol("__subscribe__");
export const UnsubscribeSymbol = Symbol("__unsubscribe__");
export const UnsubscribeAllSymbol = Symbol("__unsubscribeAll__");

export const subscribe = (state, sub) => state[SubscribeSymbol](sub);
export const unsubscribe = (state, sub) => state[UnsubscribeSymbol](sub);
export const unsubscribeAll = (state) => state[UnsubscribeAllSymbol]();

const events = {
  subscribe: "subscribe",
  unsubscribe: "unsubscribe",
};

export const subscriber = () => {
  let subscribes = [];
  const eventListeners = {
    [events.subscribe]: [],
    [events.unsubscribe]: [],
  };

  const on = (event, listener) => {
    if (!(event in eventListeners))
      throw new Error(`Event ${event} is not supported`);
    eventListeners[event].push(listener);
  };

  const off = (event, listener) => {
    if (!(event in eventListeners))
      throw new Error(`Event ${event} is not supported`);
    eventListeners[event] = eventListeners[event].filter((l) => l !== listener);
  };

  const notify = (newState) => {
    subscribes.forEach((sub) => sub(newState));
  };
  const _subscribe = (sub) => {
    if (typeof sub !== "function")
      throw new Error(`Subscription must be a function. Got ${typeof sub}`);
    subscribes.push(sub);
  };
  const _unsubscribe = (sub) => {
    const index = subscribes.indexOf(sub);
    if (index > -1) {
      subscribes.splice(index, 1);
    }
  };

  const _unusbscribeAll = () => (subscribes = []);

  return {
    on,
    off,
    subscribe: _subscribe,
    unsubscribe: _unsubscribe,
    unsubscribeAll: _unusbscribeAll,
    notify,
  };
};
