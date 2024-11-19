import React, { useState, useEffect } from "react";
import ModalAddDevice from "./ModalAddDevice";
import ModalEditDevice from "./ModalEditDevice";
import ModalDeleteDevice from "./ModalDeleteDevice";
import HeaderAdmin from "../Layout/HeaderAdmin";
import { FaTrash, FaPencilAlt, FaSearch } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { saveCurrentPath } from "../../../actions/actions";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeviceManagement = () => {  

  const [devices, setDevices] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [device, setDevice] = useState(null);

  const dispatch = useDispatch();
  const app_api_url = process.env.REACT_APP_API_URL;
  useEffect(() => {
    fetchDevices();
    dispatch(saveCurrentPath(window.location.pathname));
    document.title = "Quản lý thiết bị";
  }, [dispatch]);

  const fetchDevices = () => {
    const accessToken = localStorage.getItem("accessToken");
    const url = `${app_api_url}/device`;

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDevices(data.result);
        console.log(data.result);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleSaveDevice = async (device) => {
    console.log(device);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const url = `${app_api_url}/device/create`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(device),
      });

      if (!response.ok) {
        throw new Error("Lỗi thêm mới thông tin thiết bị");
      }

      // Show success toast
      const result = await response.json();
      if (result.code === 1000) {
        toast.success("Thêm mới thông thiết bị thành công!");

        // Close modal and fetch updated device groups
        setShowAddModal(false);
        fetchDevices();
      } else {
        toast.error("Lỗi khi thêm mới thông tin thiết bị");
      }
    } catch (error) {
      console.error("lỗi thêm mới thông tin thiết bị:", error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại");
    }
  };

  const handleUpdateDevice = async (device) => {
    console.log(device)
    try {
      const token = localStorage.getItem("accessToken");
      const url = `${app_api_url}/device/${device.deviceId}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({         
          deviceName: device.deviceName,
          location: device.location,
          status: device.status,
          groupId: device.deviceGroupResponse.groupId
        }),
      });
  
      // Kiểm tra nếu API trả về thành công
      const data = await response.json();
      if (response.ok) {
        toast.success("Cập nhật thông tin thiết bị thành công!");  // Hiển thị thông báo thành công
        setShowEditModal(false);
        fetchDevices();  // Refresh lại danh sách nhóm thiết bị
      } else {
        toast.error(data.message || "Cập nhật thông tin thiết bị thất bại!");  // Hiển thị thông báo lỗi
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi cập nhật thông tin thiết bị.");  // Thông báo lỗi khi có lỗi kết nối
      console.error("Error updating device:", error);
    }
  };

  const handleDeleteDevice = async (device) => {
    console.log(device);
    try {
      const token = localStorage.getItem("accessToken");
      const url = `${app_api_url}/device/${device.deviceId}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete device");
      }

      // Show success toast
      const result = await response.json();
      if (result.code === 1000) {
        // Show success toast
        toast.success("Xóa thông tin thiết bị thành công!");

        // Close modal and refresh categories
        setShowDeleteModal(false);
        fetchDevices();
      } else {
        toast.error("Lỗi khi xóa thông tin thiết bị");
      }
    } catch (error) {
      console.error("Error deleting device:", error);
      toast.error("Đã xảy ra lỗi khi xóa thông tin thiết bị");
    }
  };

  const handleEditButtonClick = (device) => {
    setShowEditModal(true);
    setDevice(device);
  };

  const handleDeleteButtonClick = (device) => {
    setShowDeleteModal(true);
    setDevice(device);
  };

  const handleAddButtonClick = () => {
    setShowAddModal(true);
  };

  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };

  const toggleEditModal = () => {
    setShowEditModal(!showEditModal);
  };

  const toggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };  

  return (
    <div className="content">
      <HeaderAdmin />
      <div className="container-fluid pt-4 px-4">
        <div>
          <h3>Quản lý sản phẩm</h3>
          <div className="d-flex align-items-center justify-content-between">
            {/* Add modal */}
            <ModalAddDevice
              isOpen={showAddModal}
              toggle={toggleAddModal}
              listCategory={devices}
              handleSaveDevice={handleSaveDevice}
            />
            <button
              type="button"
              className="btn btn-primary"
              id="addModalBtn"
              onClick={handleAddButtonClick}
            >
              Thêm mới sản phẩm
            </button>
            {/* Search form */}
            <form
              id="searchForm"
              className="input-group justify-content-end"
              style={{ width: "40%" }}
            >
              <input
                type="text"
                id="searchInput"
                className="form-control"
                placeholder="Tìm theo tên sản phẩm"
              />
              <div className="input-group-append">
                <button
                  type="button"
                  id="searchBtn"
                  className="btn btn-primary"
                >
                  <FaSearch />
                </button>
              </div>
            </form>
          </div>
          <hr />
          {/* Table of foods */}
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên thiết bị</th>
                <th>Vị trí lắp đặt</th>
                <th>Trạng thái</th>
                <th>ID nhóm thiết bị</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device, index) => (
                <tr key={index}>
                  <td>{device.deviceId}</td>
                  <td>{device.deviceName}</td>
                  <td>{device.location}</td>
                  <td>{device.status}</td>
                  <td>{device.deviceGroupResponse.groupId}</td>
                  <td>
                    {/* Edit button */}
                    <button
                      className="btn btn-primary editModalBtn"
                      onClick={() =>
                        handleEditButtonClick(device)
                      }
                    >
                      <FaPencilAlt />
                    </button>
                    {/* Delete button */}
                    <button
                      className="btn btn-danger deleteModalBtn"
                      onClick={() =>
                        handleDeleteButtonClick(device)
                      }
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          {/* <nav>
            <ul className="pagination">
              {[...Array(totalPage)].map((_, pageNumber) => (
                <li key={pageNumber} className="page-item">
                  <button
                    onClick={() => paginate(pageNumber + 1)}
                    className="page-link"
                  >
                    {pageNumber + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav> */}
        </div>
      </div>
      {/* Modals */}
      {showEditModal && (
        <ModalEditDevice
          isOpen={showEditModal}
          toggle={toggleEditModal}
          device={device}          
          handleUpdateDevice={handleUpdateDevice}
        />
      )}
      {showDeleteModal && (
        <ModalDeleteDevice
          isOpen={showDeleteModal}
          toggle={toggleDeleteModal}
          device={device}
          handleDeleteDevice={handleDeleteDevice}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default DeviceManagement;
