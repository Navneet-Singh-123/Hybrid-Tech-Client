import Layout from "../../../components/Layout";
import withAdmin from "../../withAdmin";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { API } from "../../../config";
import { showErrorMessage, showSuccessMessage } from "../../../helpers/alerts";

const Read = ({ user, token }) => {
  const [state, setState] = useState({
    error: "",
    success: "",
    categories: "",
  });
  const { error, success, categories } = state;

  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    console.log(response);
    setState({ ...state, categories: response.data });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (slug) => {
    try {
      const response = await axios.delete(`${API}/category/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Category delete success: ", response);
      loadCategories();
    } catch (error) {
      console.log("Category delete error");
    }
  };

  const confirmDelete = (e, slug) => {
    e.preventDefault();
    let answer = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (answer) {
      handleDelete(slug);
    }
  };

  const listCategories = () =>
    categories &&
    categories.map((c, i) => (
      <Link href={`/links/${c.slug}`} key={i}>
        <a
          style={{ border: "1px solid red" }}
          className="bg-light p-3 col-md-6"
        >
          <div>
            <div className="row">
              <div className="col-md-3">
                <img
                  src={c.image && c.image.url}
                  alt={c.name}
                  style={{ width: "100px", height: "auto" }}
                  className="pr-3"
                />
              </div>
              <div className="col-md-6">
                <h3>{c.name}</h3>
              </div>
              <div className="col-md-3">
                <Link href={`/admin/category/${c.slug}`}>
                  <button className="btn btn-sm btn-outline-success btn-block mb-1">
                    Update
                  </button>
                </Link>
                <button
                  className="btn btn-sm btn-outline-danger btn-black"
                  style={{ width: "100%" }}
                  onClick={(e) => confirmDelete(e, c.slug)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </a>
      </Link>
    ));

  return (
    <Layout>
      <div className="row">
        <div className="col">
          <h1>List of categories</h1>
          <br />
        </div>
      </div>
      <div className="row">{listCategories()}</div>
    </Layout>
  );
};

export default withAdmin(Read);
