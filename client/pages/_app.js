//app.js is the main entry file of a react/nextjs application
//anything imported here is available globally and any component
// included here is available in all pages of the application
//difference is nextjs uses file-based routing, meaning we can create a file for each route
// nextjs maps the file structure to urls automatically
// using react, we need to provide routing solution explicitly






import TopNav from "../components/TopNav";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";
import "../public/css/styles.css";
import {ToastContainer} from 'react-toastify';//to show toast notifs
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from "../context";

function MyApp({ Component, pageProps }) {
  return (
    <Provider>
      <ToastContainer position="top-center"/>
      <TopNav />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
