import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { loginSuccess, saveCurrentPath } from "../actions/actions";
import "../styles/css/login.css";
import { scrollToElement } from "../scrollUtils";
const Login = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(saveCurrentPath(window.location.pathname));
    dispatch(saveCurrentPath(window.location.pathname));
    document.title = "Đăng nhập hệ thống";
    setTimeout(() => {
      scrollToElement("scrollTarget");
    });
  }, [dispatch]);

  const navigate = useNavigate(); // Sửa đổi tại đây
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");
    console.log({ username, password });

    const app_api_url = process.env.REACT_APP_API_URL;
    try {
      const url = app_api_url + "/auth/token";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      // Kiểm tra nếu mã trạng thái là 404 và có code là 1005
      if (response.status === 404 && data.code === 1005) {
        toast.error(data.message || "Người dùng không tồn tại");
        return;
      }

      // Kiểm tra nếu mã trạng thái là 404 và có code là 1005
      if (response.status === 401 && data.code === 1006) {
        toast.error(data.message || "Không được xác thực");
        return;
      }

      if (!response.ok) {
        toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
        return;
      }

      // thanh cong het thi lay thong tin tu payload cua token
      const tokenData = parseJWT(data.result.token);
      console.log(data);
      console.log(tokenData);

      // kiem tra xem role nó
      let isAdmin = tokenData.scope.includes("ADMIN");     

      // Cập nhật reducer và localStorage
      const user = { title: tokenData.sub };
      dispatch(loginSuccess({ user: user, isAdmin: isAdmin })); // Cập nhật thông tin người dùng
      localStorage.setItem("accessToken", data.result.token); // Lưu accessToken vào localStorage

      // Điều hướng người dùng đến trang phù hợp dựa vào desc
      if (tokenData.scope.includes("ADMIN")) {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error(
        "Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin."
      );
    }
  };

  // parse token de lay role
  function parseJWT(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  }

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="row w-100">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5 mx-auto">
          <div
            className="card shadow-2-strong"
            style={{ borderRadius: "1rem" }}
          >
            <form onSubmit={handleSubmit}>
              <div id="scrollTarget" className="card-body p-5 text-center">
                <h3 className="mb-5">Đăng nhập</h3>

                <div className="form-outline mb-4">
                  <input
                    type="text"
                    name="username"
                    required
                    placeholder="Username"
                    className="form-control form-control-lg"
                  />
                </div>

                <div className="form-outline mb-4" id="show_hide_password">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Password"
                    className="form-control form-control-lg"
                  />
                  <div className="input-group-addon">
                    <span onClick={togglePasswordVisibility}>
                      {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>

                <div className="form-check d-flex justify-content-start mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="remember"
                    id="form1Example3"
                  />
                  <label
                    className="form-check-label ms-2"
                    htmlFor="form1Example3"
                  >
                    Nhớ mật khẩu
                  </label>
                </div>

                <button className="btn btn-success btn-lg w-100" type="submit">
                  Đăng nhập
                </button>

                <div className="mt-4">
                  <span>Chưa có tài khoản? </span>
                  <NavLink to="/register-page" className="ms-1">
                    Đăng ký
                  </NavLink>
                </div>
                <div className="mt-2">
                  <span>Quên mật khẩu? </span>
                  <NavLink to="/forgotPassword" className="ms-1">
                    Lấy lại mật khẩu
                  </NavLink>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;
