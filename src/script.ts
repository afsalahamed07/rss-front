import { Data } from "./types/Data";
import { Item } from "./types/Item";
import { Queue } from "./types/Queue";
import Parser from "rss-parser";

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

export async function parsRawDataWithRssParser(
  dataQueue: Queue<Data>,
  updateParsedData: (item: Item) => void,
) {
  while (!dataQueue.isEmpty()) {
    try {
      const data = dataQueue.dequeue();

      console.info(data);

      if (!data) {
        console.warn("No data available", data);
        return;
      }

      const feed = data.feed;
      const domain = feed.title;
      feed.items.forEach((entry) => {
        const title = entry.title ?? "No title";
        const author = entry.creator ?? entry.author ?? "No author";
        const description = entry.content ?? "No description";

        const subject = entry.categories ?? entry.subject ?? ["No categories"];
        const dateString = entry.pubDate;
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
        const link = entry.link ?? "No link";

        const item: Item = {
          title,
          author,
          description,
          subject,
          date,
          link,
          domain,
        };
        updateParsedData(item);
      });
    } catch (error) {
      console.log("Error occured", error);
    }
  }
}
