import Layout from "../../../components/Layout";
import withAdmin from "../../withAdmin";
import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../../config";
import { showErrorMessage, showSuccessMessage } from "../../../helpers/alerts";

const Create = ({ user, token }) => {
  const [state, setState] = useState({
    name: "",
    content: "",
    error: "",
    success: "",
    formData: process.browser && new FormData(),
    buttonText: "Create",
    imageUploadText: "Upload Image",
  });

  const {
    name,
    content,
    success,
    error,
    formData,
    buttonText,
    imageUploadText,
  } = state;

  const handleChange = (name) => (e) => {
    const value =
      name === "image" && e.target.files.length >= 1
        ? e.target.files[0]
        : e.target.value;
    const imageName =
      name === "image" && e.target.files.length >= 1
        ? e.target.files[0].name
        : "Upload Image";
    formData.set(name, value);
    setState({
      ...state,
      [name]: value,
      error: "",
      success: "",
      imageUploadText: imageName,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Creating" });
    try {
      const response = await axios.post(`${API}/category`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      setState({
        ...state,
        name: "",
        content: "",
        formData: process.browser && new FormData(),
        buttonText: "Created",
        imageUploadText: "Upload Image",
        success: `${response.data.name} is created`,
      });
    } catch (error) {
      console.log(error.response.data.error);
      setState({
        ...state,
        buttonText: "Create",
        error: error.response.data.error,
      });
    }
  };

  const createCategoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          className="form-control"
          onChange={handleChange("name")}
          value={name}
          required
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Content</label>
        <textarea
          className="form-control"
          onChange={handleChange("content")}
          value={content}
          required
        />
      </div>
      <div className="form-group">
        <label className="btn btn-outline-secondary">
          {imageUploadText}
          <input
            type="file"
            className="form-control"
            onChange={handleChange("image")}
            required
            hidden
            accept="image/*"
          />
        </label>
      </div>
      <div>
        <button className="btn btn-outline-warning">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Create Category</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {createCategoryForm()}
        </div>
      </div>
    </Layout>
  );
};
export default withAdmin(Create);
