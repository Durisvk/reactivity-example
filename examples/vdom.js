// Virtual DOM:
import { JSDOM } from "jsdom";
import { Reactive, subscribe } from "../index.js";
import { h, diff, patch, create } from "virtual-dom";

const dom = new JSDOM(
  `<!DOCTYPE html><head><meta title="VDOM Example" /></head><body></body></html>`
);

// 1: Create a function that declares how the component renders
function render({ count }) {
  return h(
    "div",
    {
      style: {
        border: "1px solid red",
        width: 100 + count + "px",
        height: "40px",
      },
    },
    [String(count)]
  );
}

// 2: Initialise the document and reactive data
const data = Reactive({ count: 0 });
let tree = render(data);
let rootNode = create(tree, { document: dom.window.document });
dom.window.document.body.appendChild(rootNode);

// 3: Wire up the update logic
setInterval(function () {
  data.count++;
}, 1000);

// 4: Wire up the re-render logic
subscribe(data, (state) => {
  const newTree = render(state);
  const patches = diff(tree, newTree);
  rootNode = patch(rootNode, patches);
  tree = newTree;

  console.log(dom.window.document.documentElement.outerHTML);
});
