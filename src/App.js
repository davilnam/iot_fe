import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "./pages/Admin/Layout/Layout";
import DeviceGroupManagement from "./pages/Admin/device-group/DeviceGroupManagement";
import DeviceManagement from "./pages/Admin/device/DeviceManagement";
import DashBoard from "./pages/Admin/dashboard/DashBoard";
import EventLogManagement from "./pages/Admin/event-log/EventLogManagement";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./components/NotFound";
import LayoutUser from "./pages/LayoutUser";

const App = () => {
  // Lấy giá trị isLoggedIn và isAdmin từ reducer
  let { isLoggedIn, isAdmin } = useSelector((state) => state.app);

  return (
    <Routes>
      <Route path="/" element={<LayoutUser />}>                
        <Route path="" element={<Login />}></Route>        
        <Route path="register-page" element={<Register />}></Route>
        {/* Thêm một Route cuối cùng với path="*" để xử lý các trang không hợp lệ */}
        <Route path="*" element={<Navigate to="/not-found" />} />
      </Route>
      {isLoggedIn && isAdmin && (
        <Route path="/admin" element={<Layout />}>
          <Route path="dashboard" element={<DashBoard />}></Route>
          <Route path="manager-event-log" element={<EventLogManagement />}></Route>
          <Route path="manager-device-group" element={<DeviceGroupManagement />}></Route>
          <Route path="manager-device" element={<DeviceManagement />}></Route>
          {/* Thêm một Route cuối cùng với path="*" để xử lý các trang không hợp lệ */}
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Route>
      )}
     
      {/* Trang not found */}
      <Route path="not-found" element={<NotFound />} />
      {/* Chuyển hướng các đường dẫn không hợp lệ đến trang not found */}
      <Route path="*" element={<Navigate to="/not-found" />} />
    </Routes>
  );
};

export default App;
