import { useState } from "react";
import Layout from "../components/Layout";

const Register = () => {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    buttonText: "Register",
    success: "",
  });

  const { buttonText, name, email, password, error, success } = state;

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
      buttonText: "Register",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.table({ name, email, password });
  };

  const registerForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          value={name}
          type="text"
          className="form-control"
          placeholder="Username"
          onChange={handleChange("name")}
        />
      </div>
      <div className="form-group">
        <input
          value={email}
          type="email"
          className="form-control"
          placeholder="Email"
          onChange={handleChange("email")}
        />
      </div>
      <div className="form-group">
        <input
          value={password}
          type="password"
          className="form-control"
          placeholder="Password"
          onChange={handleChange("password")}
        />
      </div>
      <div className="form-group">
        <button className="btn btn-outline-warning">{buttonText}</button>
      </div>
    </form>
  );
  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <h1>Register</h1>
        <br />
        {registerForm()}
        {JSON.stringify(state)}
      </div>
    </Layout>
  );
};

export default Register;
