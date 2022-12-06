export const DerivedSymbol = Symbol("__derived__");

export const isDerived = (obj) =>
  obj && obj[DerivedSymbol] && typeof obj[DerivedSymbol] === "function";
export const derive = (fun) => ({ [DerivedSymbol]: fun });

// Ugly part here to support code example shown in the challenge (I like lazy derive more):
let deriveEagerLock = false;

export const isDeriveEagerLockTurnedOn = () => deriveEagerLock;
export const deriveEager = (fun) => {
  if (deriveEagerLock) throw new Error("Cannot use deriveEager in deriveEager");

  deriveEagerLock = true;
  const derived = derive(fun);
  if (derived instanceof Promise) {
    derived.then(() => (deriveEagerLock = false));
  } else {
    deriveEagerLock = false;
  }

  return derived;
};
