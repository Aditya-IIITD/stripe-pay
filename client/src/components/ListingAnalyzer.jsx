import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Navbar from "./Navbar";
import "../styles/listingAnalyzer.css";
import UrlAnalysis from "./UrlAnalysis";

import { handleCredits } from "../utils/handleCredits";
import { collection, query, where, getDocs, doc } from "firebase/firestore";
import { db } from "../firebase";

const ListingAnalyzer = () => {
  const backendURL = process.env.REACT_APP_BACKEND_URL;
  const [OriginalUrl, setOriginalUrl] = useState("");
  const [listingData, setListingData] = useState({});
  const [isOverviewLoading, setIsOverviewLoading] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [shortLink, setShortLink] = useState("");
  const [userShortenUrls, setUserShortnedUrls] = useState([]);
  const [analysis, setAnalysis] = useState();

  useEffect(() => {
    const url = {
      original: "https://google.com",
      short: "https://yahoo.com",
      date: "12 Aug 2024",
      id: "aklsdf",
    };
    setUserShortnedUrls([...userShortenUrls, url, url]);
  }, []);

  const handleAnalysis = (id) => {
    setAnalysis(userShortenUrls[0]);
  };

  const navigate = useNavigate();
  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/signin");
      } else setAuthUser(user);
    });

    return () => {
      listen();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      "http://localhost:4100/api/shortner/shortenlink",
      {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: OriginalUrl, uid: authUser.uid }),
      }
    );
    const res = await response.json();
    setShortLink(res.msg);
    console.log(res);
  };

  return (
    <div className="listing-analyzer body" style={{ height: "200vh" }}>
      {/* <img src="logo.png" alt="sellerkin logo" /> */}
      <Navbar page={3} />
      <main>
        <div className="top">
          <div
            className="search-container"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <form style={{ flex: "1" }} onSubmit={handleSubmit}>
              <input
                type="text"
                onChange={(e) => setOriginalUrl(e.target.value)}
                value={OriginalUrl}
                placeholder="Paste URL to shorten"
                id="primary-search-input"
              />
              <svg
                onClick={() => setOriginalUrl("")}
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="11" cy="11" r="11" fill="#8B8B8B" />
                <path
                  d="M8 8L13.6569 13.6569"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <path
                  d="M13.6567 8L7.99988 13.6569"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
        <div>
          <div className="content">
            {/* --------------- */}
            {analysis ? (
              <UrlAnalysis analysis={analysis} setAnalysis={setAnalysis} />
            ) : (
              <>
                <div className="row-1">
                  <div className="shortened">
                    <p className="originalurl">
                      <b>Shortened Link: </b>
                    </p>
                    {shortLink ? <p className="smallurl">{shortLink}</p> : null}
                    {/* <button>
                  <img src="https://cdn-icons-png.flaticon.com/128/1620/1620767.png" />
                </button> */}
                  </div>
                </div>
                <div className="listOfUrls">
                  <table>
                    <thead className="tablehead">
                      <th>S. No.</th>
                      <th>Link</th>
                      <th>Original Link</th>
                      <th>Created On</th>
                      <th>Action</th>
                    </thead>
                    <tbody>
                      {userShortenUrls.length ? (
                        userShortenUrls.map((item, index) => (
                          <tr>
                            <td>{index + 1}</td>
                            <td>{item.short}</td>
                            <td>{item.original}</td>
                            <td>{item.date}</td>
                            <td>
                              <button className="deletebtn">Delete</button>
                              <button
                                className="analysisbtn"
                                onClick={() => handleAnalysis(index)}
                              >
                                Analysis
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <p clas>No recent urls</p>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListingAnalyzer;
