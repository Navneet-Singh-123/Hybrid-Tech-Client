import dynamic from "next/dynamic";
import Layout from "../../../components/Layout";
import withAdmin from "../../withAdmin";
import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../../config";
import { showErrorMessage, showSuccessMessage } from "../../../helpers/alerts";
import Resizer from "react-image-file-resizer";
import "react-quill/dist/quill.bubble.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Create = ({ user, token }) => {
  const [state, setState] = useState({
    name: "",
    error: "",
    success: "",
    buttonText: "Create",
    image: "",
  });

  const [content, setContent] = useState("");
  const [imageUploadBtnName, setImageUploadBtnName] = useState("Upload Image");

  const { name, success, error, image, buttonText } = state;

  const handleContent = (e) => {
    setContent(e);
    setState({ ...state, success: "", error: "" });
  };

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
      buttonText: "Create",
    });
  };

  const handleImage = (event) => {
    var fileInput = false;
    if (event.target.files.length >= 1 && event.target.files[0]) {
      fileInput = true;
    }
    setImageUploadBtnName(event.target.files[0].name);
    if (fileInput) {
      try {
        Resizer.imageFileResizer(
          event.target.files[0],
          300,
          300,
          "JPEG",
          100,
          0,
          (uri) => {
            setState({ ...state, image: uri, success: "", error: "" });
          },
          "base64",
          200,
          200
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Creating" });
    try {
      const response = await axios.post(
        `${API}/category`,
        { name, content, image },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setState({
        ...state,
        name: "",
        content: "",
        buttonText: "Created",
        success: `${response.data.name} is created`,
        image: "",
      });
      setImageUploadBtnName("Upload Image");
      setContent("");
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
        <ReactQuill
          theme="bubble"
          value={content}
          onChange={handleContent}
          placeholder="Write something..."
          className="pb-5 mb-3"
          style={{ border: "1px solid #666" }}
        />
      </div>
      <div className="form-group">
        <label className="btn btn-outline-secondary">
          {imageUploadBtnName}
          <input
            type="file"
            className="form-control"
            onChange={handleImage}
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
