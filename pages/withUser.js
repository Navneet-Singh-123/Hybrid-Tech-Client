import axios from "axios";
import { API } from "../config";
import { getCookie } from "../helpers/auth";

const withUser = (Page) => {
  // Dummy component
  const WithAuthUser = (props) => <Page {...props} />;

  WithAuthUser.getInitialProps = async (context) => {
    const token = getCookie("token", context.req);

    let currentUser = null;
    let userLinks = [];

    if (token) {
      try {
        const response = await axios.get(`${API}/user`, {
          headers: {
            authorization: `Bearer ${token}`,
            contentType: "application/json",
          },
        });
        currentUser = response.data.user;
        userLinks = response.data.links;
      } catch (error) {
        if (error.response.status === 401) {
          currentUser = null;
        }
      }
    }

    // If no user exists node js can redirect out front end side using respose.writeHead()
    // Since this is running in the server side we can do this from next
    if (currentUser === null) {
      // Resource requested has been temporarily moved to the URL given by the Location header.
      // Temporary redirect
      context.res.writeHead(302, {
        Location: "/",
      });
      context.res.end();
    } else {
      // Page: Passed component
      return {
        ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
        currentUser,
        token,
        userLinks,
      };
    }
  };

  return WithAuthUser;
};

export default withUser;
