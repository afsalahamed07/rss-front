import { Data, FeedItem } from "./types/Data";
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
    const lines = partialData.split("\n");

    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();
      if (!line) continue; // skip empty lines
      try {
        const parsed = JSON.parse(line);
        dataQueue.enqueue(parsed);
      } catch (err) {
        console.error("Failed to parse line:", err, line);
      }
    }

    // Keep the final (possibly partial) line for the next chunk
    // this is sort eh resetting the partialData, the last linte is empty
    // due the new line split or a partial item
    partialData = lines[lines.length - 1];
  }

  // If there's leftover after the loop ends, try parsing it
  // this should be empty ideally
  const leftover = partialData.trim();
  if (leftover) {
    try {
      const parsed = JSON.parse(leftover);
      dataQueue.enqueue(parsed);
    } catch (err) {
      console.error("Failed to parse leftover:", err, leftover);
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

      if (!data) {
        console.warn("No data available", data);
        return;
      }

      const entry: FeedItem = JSON.parse(data.item);
      const title = entry.title ?? "No title";
      const author = entry.creator ?? entry.author ?? "No author";
      const description = entry.content ?? "No description";

      const subject = entry.categories ?? entry.subject ?? ["No categories"];
      const dateString = entry.pubDate;
      const domain = entry.domain;
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
    } catch (error) {
      console.log("Error occured", error);
    }
  }
}
