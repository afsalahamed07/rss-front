import { Item } from "./Item";

type FeedItem = {
  title: string;
  link: string;
  pubDate: string;
  creator?: string;
  content: string;
  contentSnippet: string;
  guid: string;
  categories: string[];
  isoDate: string;
  subject?: string[];
  author?: string;
};

type Feed = {
  feedUrl: string;
  title: string;
  description: string;
  link: string;
  items: FeedItem[];
};

export type Data = {
  link: string;
  Item: Item;
};
