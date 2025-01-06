import { useEffect, useState } from "react";
import "./rss.css";

type RSS = {
  id: number;
  title: string;
  link: string;
};

const Rss = () => {
  const [feedLink, setFeedLink] = useState("");
  const [errorStatus, setErrorStatus] = useState(false);
  const [rssList, setRssList] = useState<RSS[]>([]);

  async function postFeed() {
    const result = await fetch("http://localhost:3000/rss", {
      method: "POST",
      body: JSON.stringify({
        link: feedLink,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (result.status == 409) {
      setErrorStatus(true);
      return;
    }

    setErrorStatus(false);
    const response = await result.json();

    return response;
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
      const result = await getFeed();
      setRssList(result);
    };

    feed();
  }, []);

  return (
    <div className="rss">
      <div className="rss-input">
        <label>RSS Feed: </label>
        <input
          placeholder="ex: https://alistapart.com/main/feed/"
          value={feedLink}
          onChange={(event) => setFeedLink(event.target.value)}
        />
      </div>
      {errorStatus && (
        <div className="insert-status-error">Feed Already Exist</div>
      )}
      <div className="rss-btn">
        <button onClick={postFeed}>Enter Feed</button>
      </div>

      <div className="rss-info odd font-bold mt-6">
        <div className="rss-title">Domain</div>
        <div className="rss-link">URL</div>
      </div>

      {rssList.map((rss, index) => (
        <div
          key={rss.id}
          className={`rss-info ${index % 2 == 0 ? "even" : "odd"}`}
        >
          <div className="rss-title">{rss.title}</div>
          <div className="rss-link">{rss.link}</div>
        </div>
      ))}
    </div>
  );
};

export default Rss;
