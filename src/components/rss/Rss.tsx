import { useEffect, useState } from "react";
import "./rss.css";
import { aw } from "vitest/dist/chunks/reporters.D7Jzd9GS.js";
const Rss = () => {
  const [feed, setFeed] = useState("");

  function postFeed() {
    fetch("http://localhost:3000/rss", {
      method: "POST",
      body: JSON.stringify({
        link: feed,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  }

  async function getFeed() {
    const result = await fetch("http://localhost:3000/rss", {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const data = await result.json();

    return data;
  }

  useEffect(() => {
    const feed = async () => {
      console.log(await getFeed());
    };

    feed();
  }, []);

  return (
    <div className="rss">
      <div className="rss-input">
        <label>RSS Feed: </label>
        <input
          placeholder="ex: https://alistapart.com/main/feed/"
          value={feed}
          onChange={(event) => setFeed(event.target.value)}
        />
      </div>

      <div className="rss-btn">
        <button onClick={postFeed}>Enter Feed</button>
      </div>
    </div>
  );
};

export default Rss;
