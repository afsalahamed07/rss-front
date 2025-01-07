import { Item } from "./types/Item";

export async function fetchFeed() {
  try {
    const response = await fetch("http://localhost:3000/rss-feed", {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const itemsList: Item[] = [];

    result.data.forEach(({ link, data }) => {
      console.log("Link: ", link);
      try {
        const parser = new DOMParser(); // Built-in browser utility to parse XML
        const xmlDoc = parser.parseFromString(data, "application/xml");

        const items = xmlDoc.querySelectorAll("item");
        items.forEach((item) => {
          const title = item.querySelector("title")?.textContent;
          const author = item.querySelector("author")?.textContent;
          const description = item.querySelector("description")?.textContent;
          const subject = item.querySelector("subject")?.textContent;
          const dateString = item.querySelector("date")?.textContent;
          const date = dateString ? dateParser(dateString.trim()) : Date.now();
          const link = item.querySelector("link")?.textContent;

          itemsList.push({ title, author, description, subject, date, link });
        });
      } catch (error) {
        console.log("Error occured", error);
      }
    });

    console.log(itemsList);

    return itemsList;
  } catch (error) {
    console.log("Error fetching or parsing the feed: ", error);
  }
}

function dateParser(dateString: string) {
  const date = new Date(dateString);

  const formattedDate = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  return formattedDate;
}
