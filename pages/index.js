import Layout from "../components/Layout";
import axios from "axios";
import Link from "next/link";
import { API } from "../config";
import { useEffect, useState } from "react";
import moment from "moment";

const Home = ({ categories }) => {
  const [popular, setPopular] = useState([]);
  useEffect(() => {
    loadPopular();
  }, []);

  const loadPopular = async () => {
    const response = await axios.get(`${API}/link/popular`);
    setPopular(response.data);
  };

  const handleClick = async (linkId) => {
    await axios.put(`${API}/click-count`, { linkId });
    loadPopular();
  };

  const listCategories = () =>
    categories.map((c, i) => (
      <Link key={i} href={`/links/${c.slug}`}>
        <a className="p-3 col-md-4 category-links-main">
          <div>
            <div className="row">
              <div className="col-md-4">
                <img
                  src={c.image && c.image.url}
                  alt={c.name}
                  className="pr-3 category-img-home"
                />
              </div>
              <div
                className="col-md-8"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyItems: "center",
                }}
              >
                <h3>{c.name}</h3>
              </div>
            </div>
          </div>
        </a>
      </Link>
    ));
  const listLinks = () =>
    popular.map((l, i) => (
      <div key={i} className="row alert alert-secondary p-2">
        <div
          className="col-md-8 links-display"
          onClick={() => handleClick(l._id)}
        >
          <a href={l.url} target="_blank" className="links-styling">
            <h5 className="pt-2">{l.title}</h5>
            <h6 className="pt-2 actual-link">{l.url}</h6>
          </a>
        </div>

        <div className="col-md-4 pt-2 ">
          <span className="float-right">
            {moment(l.createdAt).fromNow()} by {l.postedBy.name}
          </span>
        </div>

        <div className="col-md-12">
          <span className="badge text-dark">
            {l.type} {l.medium}
          </span>
          {l.categories.map((c, i) => (
            <span key={i} className="badge text-success">
              {c.name}
            </span>
          ))}
          <span className="badge text-secondary float-right">
            {l.clicks} {l.clicks == 0 || l.clicks == 1 ? "View" : "Views"}
          </span>
        </div>
      </div>
    ));

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12" style={{ padding: 0 }}>
          <h1 style={{ fontFamily: "Aclonica, cursive", fontWeight: "bold" }}>
            Browse Categories
          </h1>
          <br />
        </div>
      </div>

      <div className="row">{listCategories()}</div>
      <div className="row pt-5">
        <h2
          className="font-weight-bold pb-3"
          style={{ fontFamily: "Aclonica, cursive" }}
        >
          Trending
        </h2>
        <div className="col-md-12 overflow-hidden">{listLinks()}</div>
      </div>
    </Layout>
  );
};

Home.getInitialProps = async () => {
  const response = await axios.get(`${API}/categories`);
  return {
    categories: response.data,
  };
};

export default Home;
