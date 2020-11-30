const core = require("@actions/core");
const github = require("@actions/github");

const { JSDOM } = require("jsdom");

try {
  JSDOM.fromURL(
    "https://shop.pinkblossomsbrewing.com/collections/featured-beers",
    {}
  ).then((dom) => {
    const items = {};
    dom.window.document.querySelectorAll(".grid__item").forEach((item) => {
      const title = item.querySelector(".grid-view-item__title");
      const price = item.querySelector(".price-item");
      if (title != null && price != null) {
        console.log(title.innerHTML.trim());
        console.log(price.innerHTML.trim());
        items[title.innerHTML.trim()] = price.innerHTML.trim();
      }
    });
    const itemsString = JSON.parse(JSON.stringify(items));
    console.log(itemsString);
    core.setOutput("items", itemsString);
  });
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
