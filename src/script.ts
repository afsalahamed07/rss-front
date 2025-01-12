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

  if (!response.body) {
    return;
  }

  const reader = response.body.getReader();
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
      console.error("Errror occured whiel parsing data ", err);
    }
  }
}

// BUG: the date parsing not working as expected for some feeds
// due to different date approch, structuring of the feed
export async function parsRawData(
  dataQueue: Queue<Data>,
  updateParsedData: (item: Item) => void,
) {
  while (!dataQueue.isEmpty()) {
    try {
      const data = dataQueue.dequeue();

      if (!data) {
        console.warn("No data available", data);
        return;
      }

      const parser = new DOMParser(); // Built-in browser utility to parse XML
      const xmlDoc = parser.parseFromString(data.data, "application/xml");
      const items = xmlDoc.querySelectorAll("item");

      items.forEach((itemElement) => {
        const title =
          itemElement.querySelector("title")?.textContent ?? "No title";
        const author =
          itemElement.querySelector("author")?.textContent ?? "No Author";
        const description =
          itemElement.querySelector("description")?.textContent ??
          "No description";

        const subjectElements = itemElement.querySelectorAll("subject");
        const subject: string[] = Array.from(subjectElements)
          .map((element) => element.textContent?.trim())
          .filter((text): text is string => !!text); // Filter out null/undefined values

        const dateString = itemElement.querySelector("date")?.textContent;
        let date: Date;
        try {
          // Use a custom date parser or default to the current date
          date = dateString
            ? new Date(dateParser(dateString.trim()))
            : new Date();
        } catch {
          console.error(
            `Invalid date: ${dateString}, defaulting to current date`,
          );
          date = new Date();
        }
        const link =
          itemElement.querySelector("link")?.textContent ?? "No link";

        const item: Item = { title, author, description, subject, date, link };
        updateParsedData(item);
      });
    } catch (error) {
      console.log("Error occured", error);
    }
  }
}
