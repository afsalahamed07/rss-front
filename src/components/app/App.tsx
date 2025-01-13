import { useEffect, useState } from "react";
import Item from "../item/Item";
import { Item as ItemType } from "../../types/Item";
import {
  fetchRSSData,
  parsRawData,
  parsRawDataWithRssParser,
} from "../../script";
import { parseDescription } from "../../types/Item";
import { cleanHtml } from "../../util/parser";
import { EventEmitter } from "../../util/EventEmmiter";
import { Queue } from "../../types/Queue";
import { Data } from "../../types/Data";

const eventEmitter = new EventEmitter();
const rawDataQueue = new Queue<Data>(eventEmitter);

function App() {
  const [parsedData, setParsedData] = useState<ItemType[]>([]);

  function updateParsedData(item: ItemType) {
    setParsedData((prevData: ItemType[]) => [...prevData, item]);
  }

  useEffect(() => {
    const processQueue = async () => {
      // parsRawData(rawDataQueue, updateParsedData);
      parsRawDataWithRssParser(rawDataQueue, updateParsedData);
    };
    eventEmitter.on("queueUpdated", processQueue);

    fetchRSSData(rawDataQueue);

    return () => {
      eventEmitter.off("queueUpdated", processQueue);
    };
  }, []);

  return (
    <div className="container mx-auto">
      {parsedData.map((item: ItemType, index: number) => (
        // WARN: The key is utter bullshit
        <Item key={index} {...parseDescription(item, cleanHtml)} />
      ))}
    </div>
  );
}

export default App;
