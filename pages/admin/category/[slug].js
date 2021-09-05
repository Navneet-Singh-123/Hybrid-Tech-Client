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

const Update = ({ token, oldCategory }) => {
  const [state, setState] = useState({
    name: oldCategory.name,
    error: "",
    success: "",
    buttonText: "Update",
    imagePreview: oldCategory.image.url,
    image: oldCategory.image.url,
  });

  const [content, setContent] = useState(oldCategory.content);
  const [imageUploadBtnName, setImageUploadBtnName] = useState("Update Image");

  const { name, success, error, image, buttonText, imagePreview } = state;

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
      buttonText: "Update",
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
    setState({ ...state, buttonText: "Updating" });
    try {
      const response = await axios.put(
        `${API}/category/${oldCategory.slug}`,
        { name, content, image },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setContent("");
      setImageUploadBtnName("Update Image");
      setState({
        ...state,
        name: "",
        buttonText: "Updated",
        success: `${response.data.name} is updated`,
        image: "",
      });
      console.log(state);
    } catch (error) {
      console.log(error.response.data.error);
      setState({
        ...state,
        buttonText: "Update",
        error: error.response.data.error,
      });
    }
  };

  const updateCategoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          className="form-control"
          onChange={handleChange("name")}
          value={name}
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
      <div>
        <button className="btn btn-outline-warning">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Update Category</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {updateCategoryForm()}
        </div>
      </div>
    </Layout>
  );
};

Update.getInitialProps = async ({ req, query, token }) => {
  const response = await axios.get(`${API}/category/${query.slug}`);
  return {
    oldCategory: response.data.category,
    token,
  };
};

export default withAdmin(Update);
