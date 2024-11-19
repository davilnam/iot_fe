import React from "react";
import { useSelector } from "react-redux";
import default_avatar from "../../../assets/images/default_avatar.png";
import { MdDashboard, MdAccountBox } from "react-icons/md";
import { FaProductHunt } from "react-icons/fa";
import { RiBillFill } from "react-icons/ri";
import { BiSolidCategory } from "react-icons/bi";
import { NavLink } from "react-router-dom";

const SliderAdmin = () => {
  let user = useSelector((state) => state.app.user);      
  const isSidebarOpen = useSelector((state) => state.app.isSidebarOpen);
  const sliderClass = isSidebarOpen
    ? "sidebarAdmin pe-4 pb-3"
    : "sidebarAdmin pe-4 pb-3 hide";

  return (
    <div className={sliderClass}>
      <nav className="navbar navbar-light" style={{ padding: "10px 0px" }}>
        <div className="d-flex align-items-center ms-4 mb-4">
          <div className="position-relative">
            <img
              className="rounded-circle me-lg-2"
              src={default_avatar}
              alt=""
              style={{ width: "40px", height: "40px" }}
            />
            <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1"></div>
          </div>
          <div className="ms-3">
            <h6 className="mb-0">{user.title}</h6>            
          </div>
        </div>
        <div className="navbar-nav w-100" id="sidebar">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => {
              const activeClass = isActive ? "active" : "";
              return `nav-item nav-link ${activeClass}`;
            }}
          >
            <i>
              <MdDashboard />
            </i>{" "}
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/manager-event-log"
            className={({ isActive }) => {
              const activeClass = isActive ? "active" : "";
              return `nav-item nav-link ${activeClass}`;
            }}
          >
            <i>
              <RiBillFill />
            </i>
            Quản lý lịch sử sự kiện
          </NavLink>
          <NavLink
            to="/admin/manager-device"
            className={({ isActive }) => {
              const activeClass = isActive ? "active" : "";
              return `nav-item nav-link ${activeClass}`;
            }}
          >
            <i>
              <FaProductHunt />
            </i>
            Quản lý thiết bị
          </NavLink>
          <NavLink
            to="/admin/manager-device-group"
            className={({ isActive }) => {
              const activeClass = isActive ? "active" : "";
              return `nav-item nav-link ${activeClass}`;
            }}
          >
            <i>
              <BiSolidCategory />
            </i>
            Quản lý nhóm thiết bị
          </NavLink>
          {/* <a href="" className="nav-item nav-link"><i className="fa fa-chart-bar me-2"></i>Thống kê</a> */}
        </div>
      </nav>
    </div>
  );
};

export default SliderAdmin;
