import { useEffect, useState } from "react";
import Item from "../item/Item";
import { Item as ItemType } from "../../types/Item";
import { fetchRSSData, parsRawDataWithRssParser } from "../../script";
import { parseDescription } from "../../types/Item";
import { cleanHtml } from "../../util/parser";
import { EventEmitter } from "../../util/EventEmmiter";
import { Queue } from "../../types/Queue";
import { Data } from "../../types/Data";
import "./App.css";

const eventEmitter = new EventEmitter();
const rawDataQueue = new Queue<Data>(eventEmitter);

function App() {
  const [parsedData, setParsedData] = useState<ItemType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(1);

  function updateParsedData(item: ItemType) {
    setParsedData((prevData: ItemType[]) => [...prevData, item]);
  }

  function handlePaging(direction: number) {
    if (direction == 0) setPage(page - 1);
    else setPage(page + 1);

    setParsedData([]);
  }

  useEffect(() => {
    const processQueue = async () => {
      // parsRawData(rawDataQueue, updateParsedData);
      parsRawDataWithRssParser(rawDataQueue, updateParsedData);
    };
    eventEmitter.on("queueUpdated", processQueue);

    fetchRSSData(rawDataQueue, page);

    // this has to be transferred to higher componetn and passed down as a
    // porp. and the an update handler for the size taht to be triggerd when
    // rss is added. or no need. here this loads every time the page gets
    // updated. not the best move
    fetch("http://localhost:3000/rss-feed/size", {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((result) => {
        console.log("make request to size");
        return result.json();
      })
      .then((result) => setSize(result.size));

    return () => {
      eventEmitter.off("queueUpdated", processQueue);
    };
  }, [page]);

  return (
    <div className="container mx-auto mb-4">
      {parsedData.map((item: ItemType, index: number) => (
        <Item key={index} {...parseDescription(item, cleanHtml)} />
      ))}
      <div className="paging">
        <button
          className="left"
          disabled={page <= 1}
          onClick={() => handlePaging(0)}
        >
          &lt;
        </button>
        <p className="page">
          {page} of {Math.ceil(size / 20)}
        </p>
        <button
          className="right"
          disabled={Math.ceil(size / 20) < page + 1}
          onClick={() => handlePaging(1)}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}

export default App;
