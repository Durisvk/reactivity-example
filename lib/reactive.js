import {
  isDerived,
  DerivedSymbol,
  isDeriveEagerLockTurnedOn,
} from "./derive.js";
import { isReservedProp } from "./reservedProps.js";
import {
  subscriber,
  SubscribeSymbol,
  UnsubscribeSymbol,
  UnsubscribeAllSymbol,
} from "./subscriber.js";

const ReactiveSymbol = Symbol("__reactive__");

export const isReactive = (obj) => {
  return obj[ReactiveSymbol];
};

export const Reactive = (obj) => {
  const derived = {};
  const nested = {};
  const { on, subscribe, unsubscribe, unsubscribeAll, notify } = subscriber();
  obj[ReactiveSymbol] = true;
  const statics = {
    [SubscribeSymbol]: subscribe,
    [UnsubscribeSymbol]: unsubscribe,
    [UnsubscribeAllSymbol]: unsubscribeAll,
  };

  const proxy = new Proxy(obj, {
    get(target, key) {
      if (key in derived && !isReservedProp(key)) {
        // Recalculate derived on demand:
        return derived[key](proxy);
      }

      // Allow nested reacitivity in objects:
      if (typeof target[key] === "object" && target[key] !== null) {
        // cache nested reactive objects:
        if (!(key in nested)) {
          nested[key] = Reactive(target[key]);
          // Subscribe to nested changes:
          nested[key][SubscribeSymbol](nestedSubscribe);
          on("unsubscribe", () =>
            // When unsubscribing from parent, unsubscribe from nested:
            nested[key][UnsubscribeSymbol](nestedSubscribe)
          );
        }

        return nested[key];
      }

      // Statics for subscribe, unsubscribe, unsubscribeAll:
      if (key in statics) return statics[key];

      return target[key];
    },

    // Set trap needs to return truthish value:
    set(target, key, value) {
      // Prevent reserved property names from being overwritten:
      if (isReservedProp(key))
        throw new Error(`Cannot use reserved property name ${key}`);

      // Treat derived properties differently:
      if (isDerived(value)) {
        // Either eagerly calculate the value in the beginning and on every change:
        if (isDeriveEagerLockTurnedOn()) {
          target[key] = value(proxy);
          subscribe(() => (target[key] = value(proxy)));

          return true;
        }

        // or lazily store a callback to calculate the value on demand:
        return (derived[key] = value[DerivedSymbol]) || true;
      }

      target[key] = value;
      return notify(proxy) || true;
    },
  });

  // Used for subscribing to nested changes:
  const nestedSubscribe = () => notify(proxy);

  return proxy;
};
