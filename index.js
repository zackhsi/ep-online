const core = require("@actions/core");
const github = require("@actions/github");

const { JSDOM } = require("jsdom");

const payload = JSON.stringify(github.context.payload, undefined, 2);
console.log(`The event payload: ${payload}`);

JSDOM.fromURL(
  "https://shop.pinkblossomsbrewing.com/collections/featured-beers",
  {}
)
  .then((dom) => {
    const items = {};
    dom.window.document.querySelectorAll(".grid__item").forEach((item) => {
      const title = item.querySelector(".grid-view-item__title");
      const price = item.querySelector(".price-item");
      if (title != null && price != null) {
        const key = title.innerHTML.trim();
        const value = price.innerHTML.trim().replace("$", "");
        items[key] = value;
      }
    });
    console.log({ items });
    const itemsString = JSON.parse(JSON.stringify(items));
    console.log({ itemsString });
    core.setOutput("items", itemsString);
  })
  .catch((error) => {
    console.log({ error });
    console.log(`Setting step as failed: ${error.message}`);
    core.setFailed(error.message);
  });
