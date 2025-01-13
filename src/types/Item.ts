export type Item = {
  title: string;
  author: string;
  description: string;
  subject: string[];
  date: Date;
  link: string;
  domain: string;
};

export function parseDescription(
  item: Item,
  parser: (html: string) => string,
): Item {
  const sanitisedDescription = parser(item.description);
  return { ...item, description: sanitisedDescription };
}
