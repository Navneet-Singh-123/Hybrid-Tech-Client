import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Head from "next/head";
import axios from "axios";
import renderHTML from "react-render-html";
import moment from "moment";
import { API, APP_NAME } from "../../config";
import InfiniteScroll from "react-infinite-scroller";

const Links = ({
  query,
  category,
  links,
  totalLinks,
  linksLimit,
  linkSkip,
}) => {
  const [allLinks, setAllLinks] = useState(links);
  const [limit, setLimit] = useState(linksLimit);
  const [skip, setSkip] = useState(linkSkip);
  const [size, setSize] = useState(totalLinks);
  const [popular, setPopular] = useState([]);

  const head = () => (
    <Head>
      <title>
        {category.name} | {APP_NAME}
      </title>
    </Head>
  );

  useEffect(() => {
    loadPopular();
    console.log("Popular Link:", popular);
  }, []);

  const loadPopular = async () => {
    const response = await axios.get(`${API}/link/popular/${category.slug}`);
    setPopular(response.data);
    console.log(popular);
  };

  const handleClick = async (linkId) => {
    await axios.put(`${API}/click-count`, { linkId });
    loadUpdatedLinks();
    loadPopular();
  };

  const listOfPopularLinks = () =>
    popular.map((l, i) => (
      <div key={i} className="row alert alert-secondary p-2">
        <div
          className="col-md-8 links-display"
          onClick={() => handleClick(l._id)}
        >
          <a href={l.url} target="_blank" className="links-styling">
            <h5 className="pt-2">{l.title}</h5>
            <h6 className="pt-2 actual-link" style={{ fontSize: "12px" }}>
              {l.url}
            </h6>
          </a>
        </div>

        <div className="col-md-4 pt-2">
          <span className="float-right">By - {l.postedBy.name}</span>
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
            {l.clicks} Views
          </span>
        </div>
      </div>
    ));

  const loadUpdatedLinks = async () => {
    const response = await axios.get(`${API}/category/${query.slug}`);
    setAllLinks(response.data.links);
  };

  const listOfLinks = () =>
    allLinks.map((l, i) => (
      <div key={i} className="row alert alert-primary p-2">
        <div
          className="col-md-8 links-display"
          onClick={(e) => handleClick(l._id)}
        >
          <a href={l.url} target="_blank" className="links-styling">
            <h5 className="pt-2">{l.title}</h5>
            <h6 className="pt-2 actual-link" style={{ fontSize: "12px" }}>
              {l.url}
            </h6>
          </a>
        </div>
        <div className="col-md-4 pt-2">
          <span className="float-right">
            {moment(l.createdAt).fromNow()} by {l.postedBy.name}
          </span>
        </div>

        <div className="col-md-12">
          <span className="badge text-dark">
            {l.type} / {l.medium}
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

  const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
  };

  const loadMore = async () => {
    let toSkip = skip + limit;
    const response = await axios.get(
      `${API}/category/${query.slug}?skip=${toSkip}&limit=${limit}`
    );
    response.data.links = response.data.links.filter(onlyUnique);
    setAllLinks([...allLinks, ...response.data.links]);
    console.log("allLinks", allLinks);
    console.log("response.data.links.length", response.data.links.length);
    setSize(response.data.links.length);
    setSkip(toSkip);
  };

  return (
    <>
      {head()}
      <Layout>
        <div className="row">
          <div className="col-md-8">
            <h1
              className="display-4 font-weight-bold"
              style={{ fontFamily: "Aclonica, cursive", fontWeight: "bold" }}
            >
              {category.name}
            </h1>
            <div className="lead alert alert-secondary pt-4">
              {renderHTML(category.content || "")}
            </div>
          </div>
          <div className="col-md-4" style={{ textAlign: "center" }}>
            <img
              src={category.image.url}
              alt={category.name}
              style={{ width: "auto", maxHeight: "200px", borderRadius: "50%" }}
            />
          </div>
        </div>
        <br />

        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore={size > 0 && size >= limit}
          loader={
            <img key={0} src="/static/images/loading.gif" alt="loading" />
          }
        >
          <div className="row">
            <div className="col-md-8">{listOfLinks()}</div>
            <div className="col-md-4">
              <h2 className="lead">Most popular in {category.name}</h2>
              <div className="p-3">{listOfPopularLinks()}</div>
            </div>
          </div>
        </InfiniteScroll>
      </Layout>
    </>
  );
};

Links.getInitialProps = async ({ query, req }) => {
  let skip = 0;
  let limit = 2;
  const response = await axios.get(
    `${API}/category/${query.slug}?skip=${skip}&limit=${limit}`
  );
  return {
    query,
    category: response.data.category,
    links: response.data.links,
    totalLinks: response.data.links.length,
    linksLimit: limit,
    linkSkip: skip,
  };
};

export default Links;
