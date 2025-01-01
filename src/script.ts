import { Item } from "./types/Item";

export async function fetchFeed() {
  try {
    const response = await fetch("http://localhost:3000/rss-feed", {
      method: "GET",
    });

    if (!response) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text(); // Retrieve the raw XML as a string
    const parser = new DOMParser(); // Built-in browser utility to parse XML
    const xmlDoc = parser.parseFromString(text, "application/xml");

    const items = xmlDoc.querySelectorAll("item");
    const itemsList: Item[] = [];
    items.forEach((item) => {
      const title = item.querySelector("title")?.textContent;
      const author = item.querySelector("author")?.textContent;
      const description = item.querySelector("description")?.textContent;
      const subject = item.querySelector("subject")?.textContent;
      const date = item.querySelector("date")?.textContent;
      const link = item.querySelector("link")?.textContent;

      itemsList.push({ title, author, description, subject, date, link });
    });

    return itemsList;
  } catch (error) {
    console.log("Error fetching or parsing the feed: ", error);
  }
}
