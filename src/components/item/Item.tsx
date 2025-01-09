import React from "react";
import { Item as ItemType } from "../types/Item";
import "./item.css";

const Item: React.FC<ItemType> = ({
  title,
  author,
  description,
  subject,
  date,
  link,
}) => {
  // TODO: Move this to different module
  // possibley the parer module

  // :descriptionParsing
  const parser = new DOMParser();
  const doc = parser.parseFromString(description, "text/html");
  const firstParagraph: HTMLElement | null = doc.querySelector("p");
  const paragraphContent: string = firstParagraph?.textContent ?? description;

  return (
    <div className="item">
      <h2 className="title">{title}</h2> <p className="author">{author}</p>
      <div className="description">{paragraphContent}</div>
      <div className="subject">{subject}</div>
      <div className="date">Published on: {date.toString()}</div>
      <a className="link" href={link} target="_blank">
        Read more..
      </a>
    </div>
  );
};

export default Item;
