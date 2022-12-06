import { Reactive, derive, subscribe } from "../index.js";

const data = Reactive({ items: [], person: { name: "John" } });
data.hasFood = derive(() => data.items.some((item) => item.type === "food"));

subscribe(data, (state) => console.log("state changed", state));

console.log(data.hasFood); // false

data.items.push({ type: "food", name: "Cheeseburger" });

console.log(data.hasFood); // TRUE!!

data.items[0].type = "drink";

console.log(data.hasFood); // false again
