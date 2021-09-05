import Layout from "../../components/Layout";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { API } from "../../config";
import renderHTML from "react-render-html";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroller";

const Links = ({
  query,
  category,
  links,
  totalLinks,
  linksLimit,
  linksSkip,
}) => {
  const [allLinks, setAllLinks] = useState(links);
  const [limit, setLimit] = useState(linksLimit);
  const [skip, setSkip] = useState(linksSkip);
  const [size, setSize] = useState(totalLinks);

  const handleClick = async (id) => {
    const response = await axios.put(`${API}/links/click-count`, { id });
    loadUpdatedLinks();
  };

  const loadUpdatedLinks = async () => {
    const response = await axios.get(`${API}/category/${query.slug}`);
    setAllLinks(response.data.links);
  };

  const listOfLinks = () =>
    allLinks.map((l, i) => (
      <div key={i} className="row alert alert-primary p-2 mr-1 ml-1">
        <div className="col-md-7" onClick={() => handleClick(l._id)}>
          <a href={l.url} target="_blank">
            <h5 className="pt-2">{l.title}</h5>
            <h6 className="pt-2 text-danger" style={{ fontSize: "12px" }}>
              {l.url}
            </h6>
          </a>
        </div>
        <div className="col-md-5 pt-2">
          <span className="pull-right float-right">
            {moment(l.createdAt).fromNow()} by {l.postedBy.name}
          </span>
          <br />
          <span className="badge text-secondary pull-right float-right pt-2">
            {l.views} {l.views === 1 || l.views === 0 ? "view" : "views"}
          </span>
        </div>
        <div className="col-md-12">
          <span className="badge text-dark">
            {l.type} / {l.medium}
          </span>
          {l.categories.map((c, i) => (
            <span className="badge text-success" key={i}>
              {c.name}
            </span>
          ))}
        </div>
      </div>
    ));

  const loadMore = async () => {
    let toSkip = skip + limit;
    const response = await axios.get(
      `${API}/category/${query.slug}?limit=${limit}&skip=${toSkip}`
    );
    setAllLinks([...allLinks, ...response.data.links]);
    setSize(response.data.links.length);
    setSkip(toSkip);
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-8">
          <h1 className="display-4 font-weight-bold">
            {category.name} - URL/Links
          </h1>
          <div className="lead alert alert-secondary pt-4">
            {renderHTML(category.content || "")}
          </div>
        </div>
        <div className="col-md-4">
          <img
            src={category.image.url}
            alt={category.name}
            style={{ width: "auto", maxHeight: "200px" }}
          />
        </div>
      </div>
      <br />

      <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={size > 0 && size >= limit}
        loader={
          <img src="/static/images/loading.gif" alt="Loading..." key={0} />
        }
      >
        <div className="row">
          <div className="col-md-8"> {listOfLinks()}</div>
          <div className="col-md-4">
            <h2 className="lead">Most popular in {category.name}</h2>
            <p>Show popular links</p>
          </div>
        </div>
      </InfiniteScroll>
    </Layout>
  );
};

Links.getInitialProps = async ({ query, req }) => {
  let skip = 0;
  let limit = 3;
  const response = await axios.get(
    `${API}/category/${query.slug}?limit=${limit}&skip=${skip}`
  );
  return {
    query,
    category: response.data.category,
    links: response.data.links,
    totalLinks: response.data.links.length,
    linksLimit: limit,
    linksSkip: skip,
  };
};

export default Links;
