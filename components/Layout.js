import { Fragment } from "react";
import Link from "next/link";
import Head from "next/head";
import NProgress from "nprogress";
import Router from "next/router";
import "nprogress/nprogress.css";
import { isAuth, logout } from "../helpers/auth";

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Layout = ({ children }) => {
  const head = () => (
    <Head>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
        crossOrigin="anonymous"
      />
      <link rel="stylesheet" href="/static/css/styles.css" />
    </Head>
  );

  const nav = () => (
    <ul className="nav nav-tabs bg-warning">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div>
          <li className="nav-item">
            <Link href="/">
              <a className="nav-link text-dark">Home</a>
            </Link>
          </li>
        </div>
        <div className="nav">
          {!isAuth() && (
            <>
              <li className="nav-item">
                <Link href="/login">
                  <a className="nav-link text-dark">Login</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/register">
                  <a className="nav-link text-dark">Register</a>
                </Link>
              </li>
            </>
          )}

          {isAuth() && isAuth().role === "admin" && (
            <li className="nav-item ml-auto">
              <Link href="/admin">
                <a className="nav-link text-dark">{isAuth().name}</a>
              </Link>
            </li>
          )}

          {isAuth() && isAuth().role === "subscriber" && (
            <li className="nav-item ml-auto">
              <Link href="/user">
                <a className="nav-link text-dark">{isAuth().name}</a>
              </Link>
            </li>
          )}

          {isAuth() && (
            <li className="nav-item ml-auto">
              <a
                onClick={logout}
                className="nav-link text-dark"
                style={{ cursor: "pointer" }}
              >
                Logout
              </a>
            </li>
          )}
        </div>
      </div>
    </ul>
  );

  return (
    <Fragment>
      {head()} {nav()} <div className="container pt-5 pb-5">{children}</div>
    </Fragment>
  );
};

export default Layout;
