export const reservedProps = [
  "constructor",
  "propertyIsEnumerable",
  "hasOwnProperty",
  "isPrototypeOf",
  "toString",
  "valueOf",
  "toLocaleString",
];

export const isReservedProp = (prop) => reservedProps.includes(prop);
