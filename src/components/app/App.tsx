import { useEffect, useState } from "react";
import Item from "../item/Item";
import { Item as ItemType } from "../../types/Item";
import { fetchFeed } from "../../script";
import { parseDescription } from "../../types/Item";
import { cleanHtml } from "../../util/parser";

function App() {
  const [data, setData] = useState<ItemType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchFeed();
        setData(result);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto">
      {data.map((item, index) => (
        // WARN: The key is utter bullshit
        <Item key={index} {...parseDescription(item, cleanHtml)} />
      ))}
    </div>
  );
}

export default App;
