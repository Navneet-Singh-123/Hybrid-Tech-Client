import Layout from "../../components/Layout";
import Link from "next/link";
import Router from "next/router";
import axios from "axios";
import moment from "moment";
import { API } from "../../config";
import withUser from "../withUser";
import { useState } from "react";
import Head from "next/head";

const User = ({ userLinks, token }) => {
  const head = () => (
    <Head>
      <title>Dashboard | Hybrid Tech</title>
    </Head>
  );
  const [allLinks, setAllLinks] = useState(userLinks);

  const confirmDelete = (e, id) => {
    e.preventDefault();
    // console.log('delete > ', slug);
    let answer = window.confirm("Are you sure you want to delete?");
    if (answer) {
      handleDelete(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API}/link/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("LINK DELETE SUCCESS ", response);
      Router.replace("/user");
      loadUpdatedLinks();
    } catch (error) {
      console.log("LINK DELETE ", error);
    }
  };

  const loadUpdatedLinks = async () => {
    if (token) {
      try {
        const response = await axios.get(`${API}/user`, {
          headers: {
            authorization: `Bearer ${token}`,
            contentType: "application/json",
          },
        });
        console.log(response.data);
        setUser(response.data.user);
        setAllLinks(response.data.links);
      } catch (error) {
        console.log("Something went wrong...");
      }
    }
  };

  const listOfLinks = () =>
    allLinks.map((l, i) => (
      <div key={i} className="row alert alert-primary p-2">
        <div className="col-md-8 links-display">
          <a href={l.url} target="_blank" className="links-styling">
            <h5 className="pt-2">{l.title}</h5>
            <h6 className="pt-2 actual-link" style={{ fontSize: "12px" }}>
              {l.url}
            </h6>
          </a>
        </div>
        <div className="col-md-4 pt-2">
          <span className="float-right">{moment(l.createdAt).fromNow()}</span>
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

          <Link href={`/user/link/${l._id}`}>
            <span
              className="badge text-warning pull-right"
              style={{ cursor: "pointer" }}
            >
              Update
            </span>
          </Link>

          <span
            onClick={(e) => confirmDelete(e, l._id)}
            className="badge text-danger pull-right"
            style={{ cursor: "pointer" }}
          >
            Delete
          </span>
        </div>
      </div>
    ));

  return (
    <Layout>
      {head()}
      <h1 style={{ fontFamily: "Aclonica, cursive", fontWeight: "bold" }}>
        My dashboard
      </h1>
      <hr />

      <div className="row">
        <div className="col-md-4">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link href="/user/link/create">
                <a className="nav-link" style={{ display: "inline-block" }}>
                  Submit a link
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/user/profile/update">
                <a className="nav-link" style={{ display: "inline-block" }}>
                  Update profile
                </a>
              </Link>
            </li>
          </ul>
        </div>

        <div className="col-md-8">
          <h2 style={{ fontFamily: "Aclonica, cursive", fontWeight: "bold" }}>
            Your links
          </h2>
          <br />
          {listOfLinks()}
        </div>
      </div>
    </Layout>
  );
};

export default withUser(User);
