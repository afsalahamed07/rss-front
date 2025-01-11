import { Data } from "./types/Data";
import { Item } from "./types/Item";
import { Queue } from "./types/Queue";

function dateParser(dateString: string) {
  const date = new Date(dateString);

  const formattedDate = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  return formattedDate;
}

export async function fetchRSSData(dataQueue: Queue<Data>) {
  const response = await fetch("http://localhost:3000/rss-feed");

  if (!response.ok) {
    console.log("Failed to fetch RSS data", response.statusText);
    return;
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let partialData = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    partialData += decoder.decode(value, { stream: true });

    try {
      const data = JSON.parse(partialData);
      dataQueue.enqueue(data);
      partialData = "";
    } catch (err) {
      console.log("Error occured during the parsing of data", err);
    }
  }
}

export async function parsRawData(
  dataQueue: Queue<Data>,
  updateParsedData: (item: Item) => void,
) {
  while (!dataQueue.isEmpty()) {
    try {
      const data = dataQueue.dequeue();
      const parser = new DOMParser(); // Built-in browser utility to parse XML
      const xmlDoc = parser.parseFromString(data?.data, "application/xml");
      const items = xmlDoc.querySelectorAll("item");

      items.forEach((itemElement) => {
        const title = itemElement.querySelector("title")?.textContent;
        const author = itemElement.querySelector("author")?.textContent;
        const description =
          itemElement.querySelector("description")?.textContent;
        const subject = itemElement.querySelector("subject")?.textContent;
        const dateString = itemElement.querySelector("date")?.textContent;
        // BUG: the date parsing not working as expected for some feeds
        // due to different date approch
        const date = dateString ? dateParser(dateString.trim()) : Date.now();
        const link = itemElement.querySelector("link")?.textContent;

        // TODO: fix this type non-sense
        const item: Item = { title, author, description, subject, date, link };
        updateParsedData(item);
      });
    } catch (error) {
      console.log("Error occured", error);
    }
  }
}
