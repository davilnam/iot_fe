import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";
const LayoutUser = () => {
  return (
    <>
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css?family=Poppins:100,200,300,400,500,600,700,800,900"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Great+Vibes&display=swap"
          rel="stylesheet"
        />
      </Helmet>    
      <Outlet></Outlet>  
    </>
  );
};
export default LayoutUser;
