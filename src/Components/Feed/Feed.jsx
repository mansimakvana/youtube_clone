import React, { useEffect, useState } from "react";
import "./feed.css";
import { Link } from "react-router-dom";
import moment from "moment";

const Feed = ({ category }) => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=IN&videoCategoryId=${category}&key=${
      import.meta.env.VITE_API_KEY
    }`;

    await fetch(videoList_url).then((response) =>
      response.json().then((data) => setData(data.items))
    );
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  const value_converter = (value) => {
    if (value >= 1000000) {
      return Math.floor(value / 1000000) + "M";
    } else if (value >= 1000) {
      return Math.floor(value / 1000) + "K";
    } else {
      return value;
    }
  };

  function limitTitleLength(title) {
    let words = title.split(" ");

    // Check if the number of words exceeds 40
    if (words.length > 10) {
      // Truncate the array to 40 words
      words = words.slice(0, 10);

      // Join the words back into a string
      return words.join(" ") + "..."; // Add ellipsis to indicate truncation
    } else {
      // If the title is already within the limit, return it as is
      return title;
    }
  }

  return (
    <div className="feed">
      {data.map((item, index) => {
        return (
          <Link
            to={`video/${item.snippet.categoryId}/${item.id}`}
            className="card"
          >
            <img src={item.snippet.thumbnails.medium.url} alt="" />
            <div className="card-subtitle">
              <img
                className="channel-img"
                src={item.snippet.thumbnails.medium.url}
                alt=""
              />
              <div className="overlay">
                <h2>{limitTitleLength(item.snippet.title)}</h2>
                <h3>{item.snippet.channelTitle}</h3>
                <p>
                  {value_converter(item.statistics.viewCount)} &bull;{" "}
                  {moment(item.snippet.publishedAt).fromNow()}{" "}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Feed;
