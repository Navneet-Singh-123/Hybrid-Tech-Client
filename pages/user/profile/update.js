import { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import Router from "next/router";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import { updateUser } from "../../../helpers/auth";
import { API } from "../../../config";
import withUser from "../../withUser";
import Head from "next/head";

const Update = ({ currentUser, token }) => {
  const head = () => (
    <Head>
      <title>Profile Update | Hybrid Tech</title>
    </Head>
  );

  const [state, setState] = useState({
    name: currentUser.name,
    email: currentUser.email,
    error: "",
    success: "",
    buttonText: "Update",
    loadedCategories: [],
    categories: currentUser.categories,
  });

  const {
    name,
    email,
    error,
    success,
    buttonText,
    loadedCategories,
    categories,
  } = state;

  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setState({ ...state, loadedCategories: response.data });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleToggle = (c) => () => {
    // return the first index or -1
    const clickedCategory = categories.indexOf(c);
    const all = [...categories];

    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }
    console.log("all >> categories", all);
    setState({ ...state, categories: all, success: "", error: "" });
  };

  // show categories > checkbox
  const showCategories = () => {
    return (
      loadedCategories &&
      loadedCategories.map((c, i) => (
        <li className="list-unstyled" key={c._id}>
          <input
            type="checkbox"
            onChange={handleToggle(c._id)}
            className="mr-2"
            checked={categories.includes(c._id)}
          />
          <label className="form-check-label">{c.name}</label>
        </li>
      ))
    );
  };

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
      buttonText: "Update",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Updating" });
    try {
      const response = await axios.put(
        `${API}/user`,
        {
          name,
          categories,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      try {
        updateUser(response.data, () => {
          setState({
            ...state,
            buttonText: "Updated",
            name: response.data.name,
            categories: response.data.categories,
            success: "Profile updated successfully",
          });
        });
      } catch (error) {
        console.log("Something wrong");
        setState({
          ...state,
          buttonText: "Update",
          error:
            "Unable to update user locally. Please login again to view changes",
        });
      }
    } catch (error) {
      console.log(error);
      setState({
        ...state,
        buttonText: "Update",
        error: error.response.data.error,
      });
    }
  };

  const updateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          value={name}
          onChange={handleChange("name")}
          type="text"
          className="form-control"
          placeholder="Type your name"
          required
        />
      </div>
      <div className="form-group">
        <input
          value={email}
          onChange={handleChange("email")}
          type="email"
          className="form-control"
          placeholder="Type your email"
          disabled
        />
      </div>
      <div className="form-group">
        <label className="text-muted ml-4">Category</label>
        <ul style={{ maxHeight: "100px", overflowY: "scroll" }}>
          {showCategories()}
        </ul>
      </div>
      <div className="form-group">
        <button className="btn btn-outline-warning">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <Layout>
      {head()}
      <div className="col-md-6 offset-md-3">
        <h1 style={{ fontFamily: "Aclonica, cursive", fontWeight: "bold" }}>
          Update Profile
        </h1>
        <br />
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        {updateForm()}
      </div>
    </Layout>
  );
};

export default withUser(Update);
