import React, { useState, useEffect, Fragment } from "react";
import Layout from "../../../components/Layout";
import axios from "axios";
import { API } from "../../../config";
import { showErrorMessage, showSuccessMessage } from "../../../helpers/alerts";
import { getCookie, isAuth } from "../../../helpers/auth";

const Create = ({ token }) => {
  const [state, setState] = useState({
    title: "",
    url: "",
    categories: [],
    loadedCategories: [],
    success: "",
    error: "",
    type: "",
    medium: "",
    buttonText: isAuth() || token ? "Post" : "Login to post",
  });

  const {
    title,
    url,
    categories,
    loadedCategories,
    success,
    error,
    type,
    medium,
    buttonText,
  } = state;

  useEffect(() => {
    loadCategories();
  }, [success]);

  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setState({ ...state, loadedCategories: response.data });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Posting" });
    try {
      const response = await axios.post(
        `${API}/link`,
        { title, url, categories, type, medium },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setState({
        ...state,
        title: "",
        url: "",
        success: "Link is created",
        error: "",
        loadedCategories: [],
        categories: [],
        type: "",
        medium: "",
        buttonText: "Posted",
      });
    } catch (error) {
      console.log("Link submit error: ", error);
      setState({
        ...state,
        error: error.response.data.error,
        buttonText: "Post",
      });
    }
  };

  const handleTitleChange = (e) => {
    setState({
      ...state,
      title: e.target.value,
      error: "",
      success: "",
      buttonText: isAuth() || token ? "Post" : "Login to post",
    });
  };

  const handleURLChange = (e) => {
    setState({
      ...state,
      url: e.target.value,
      error: "",
      success: "",
      buttonText: isAuth() || token ? "Post" : "Login to post",
    });
  };

  const submitLinkForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Title</label>
        <input
          type="text"
          className="form-control"
          onChange={handleTitleChange}
          value={title}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">URL</label>
        <input
          type="url"
          className="form-control"
          onChange={handleURLChange}
          value={url}
        />
      </div>
      <div>
        <button
          className="btn btn-outline-warning"
          type="submit"
          disabled={!token}
        >
          {buttonText}
        </button>
      </div>
    </form>
  );

  const handleToggle = (c) => () => {
    const clickedCategory = categories.indexOf(c);
    const all = [...categories];
    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }
    setState({
      ...state,
      categories: all,
      success: "",
      error: "",
      buttonText: isAuth() || token ? "Post" : "Login to post",
    });
  };

  const showCategories = () => {
    return (
      loadedCategories &&
      loadedCategories.map((c, i) => (
        <li className="list-unstyled" key={i}>
          <input
            type="checkbox"
            onChange={handleToggle(c._id)}
            className="mr-2"
          />
          <label className="form-check-label">{c.name}</label>
        </li>
      ))
    );
  };

  const handleTypeClick = (e) => {
    setState({
      ...state,
      type: e.target.value,
      success: "",
      error: "",
      buttonText: isAuth() || token ? "Post" : "Login to post",
    });
  };

  const showTypes = () => (
    <Fragment>
      <div className="form-check ml-3">
        <label className="form-check-label">
          <input
            type="radio"
            onClick={handleTypeClick}
            checked={type === "free"}
            value="free"
            className="from-check-input"
            name="type"
          />{" "}
          Free
        </label>
      </div>

      <div className="form-check ml-3">
        <label className="form-check-label">
          <input
            type="radio"
            onClick={handleTypeClick}
            checked={type === "paid"}
            value="paid"
            className="from-check-input"
            name="type"
          />{" "}
          Paid
        </label>
      </div>
    </Fragment>
  );

  const handleMediumClick = (e) => {
    setState({
      ...state,
      medium: e.target.value,
      success: "",
      error: "",
      buttonText: isAuth() || token ? "Post" : "Login to post",
    });
  };

  const showMedium = () => (
    <Fragment>
      <div className="form-check ml-3">
        <label className="form-check-label">
          <input
            type="radio"
            onClick={handleMediumClick}
            checked={medium === "video"}
            value="video"
            className="from-check-input"
            name="medium"
          />{" "}
          Video
        </label>
      </div>

      <div className="form-check ml-3">
        <label className="form-check-label">
          <input
            type="radio"
            onClick={handleMediumClick}
            checked={medium === "article"}
            value="article"
            className="from-check-input"
            name="medium"
          />{" "}
          Article
        </label>
      </div>
    </Fragment>
  );

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12">
          <h1>Submit a link/URL</h1>
          <br />
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <div className="form-group">
            <label className="text-muted ml-4">Category</label>
            <ul style={{ maxHeight: "100px", overflowY: "scroll" }}>
              {showCategories()}
            </ul>
          </div>
          <div className="form-group">
            <label className="text-muted ml-4">Type</label>
            {showTypes()}
          </div>
          <div className="form-group">
            <label className="text-muted ml-4">Medium</label>
            {showMedium()}
          </div>
        </div>
        <div className="col-md-8">
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {submitLinkForm()}
        </div>
      </div>
    </Layout>
  );
};

Create.getInitialProps = ({ req }) => {
  const token = getCookie("token", req);
  return { token };
};

export default Create;
