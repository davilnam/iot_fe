import React, { useState, useEffect } from "react";
import ModalAddDeviceGroup from "./ModalAddDeviceGroup";
import ModalEditDeviceGroup from "./ModalEditDeviceGroup";
import ModalDeleteDeviceGroup from "./ModalDeleteDeviceGroup";
import HeaderAdmin from "../Layout/HeaderAdmin";
import { FaTrash, FaPencilAlt, FaSearch } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { saveCurrentPath } from "../../../actions/actions";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeviceGroupManagement = () => {
  const [deviceGroups, setDeviceGroups] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deviceGroup, setDeviceGroup] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state to show a loader while fetching

  const dispatch = useDispatch();
  const app_api_url = process.env.REACT_APP_API_URL;

  // Fetch all device groups when the component mounts
  useEffect(() => {
    document.title = "Quản lý nhóm thiết bị";
    fetchDeviceGroups();
    dispatch(saveCurrentPath(window.location.pathname));
  }, [dispatch]);

  // Function to fetch device groups
  const fetchDeviceGroups = () => {
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    const url = `${app_api_url}/device-group`;

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDeviceGroups(data.result);
        console.log(data.result);
        setLoading(false); // Stop the loader when data is fetched
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false); // Stop the loader if error occurs
      });
  };

  // Handle adding a new device group
  const handleAddDeviceGroup = async (deviceGroup) => {
    console.log(deviceGroup);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const url = `${app_api_url}/device-group/create`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(deviceGroup),
      });

      if (!response.ok) {
        throw new Error("Failed to add category");
      }

      // Show success toast
      const result = await response.json();
      if (result.code === 1000) {
        toast.success("Thêm mới nhóm thiết bị thành công!");

        // Close modal and fetch updated device groups
        setShowAddModal(false);
        fetchDeviceGroups();
      } else {
        toast.error("Lỗi khi thêm mới nhóm thiết bị");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại");
    }
  };

  const handleUpdateDeviceGroup = async (deviceGroup) => {
    console.log(deviceGroup)
    try {
      const token = localStorage.getItem("accessToken");
      const url = `${app_api_url}/device-group/${deviceGroup.groudId}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({         
          groupName: deviceGroup.groupName,
          description: deviceGroup.description,
        }),
      });
  
      // Kiểm tra nếu API trả về thành công
      const data = await response.json();
      if (response.ok) {
        toast.success("Cập nhật nhóm thiết bị thành công!");  // Hiển thị thông báo thành công
        setShowEditModal(false);
        fetchDeviceGroups();  // Refresh lại danh sách nhóm thiết bị
      } else {
        toast.error(data.message || "Cập nhật nhóm thiết bị thất bại!");  // Hiển thị thông báo lỗi
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi cập nhật nhóm thiết bị.");  // Thông báo lỗi khi có lỗi kết nối
      console.error("Error updating device group:", error);
    }
  };

  // Handle delete device group
  const handleDeleteDeviceGroup = async (deviceGroup) => {
    console.log(deviceGroup);
    try {
      const token = localStorage.getItem("accessToken");
      const url = `${app_api_url}/device-group/${deviceGroup.groudId}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      // Show success toast
      const result = await response.json();
      if (result.code === 1000) {
        // Show success toast
        toast.success("Xóa nhóm thiết bị thành công!");

        // Close modal and refresh categories
        setShowDeleteModal(false);
        fetchDeviceGroups();
      } else {
        toast.error("Lỗi khi xóa nhóm thiết bị");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Đã xảy ra lỗi khi xóa nhóm thiết bị");
    }
  };

  const handleEditButtonClick = (deviceGroup) => {
    setShowEditModal(true);
    setDeviceGroup(deviceGroup);
  };

  const handleDeleteButtonClick = (deviceGroup) => {
    setShowDeleteModal(true);
    setDeviceGroup(deviceGroup);
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
          <h3>Quản lý nhóm thiết bị</h3>
          <div className="d-flex align-items-center justify-content-between">
            <ModalAddDeviceGroup
              isOpen={showAddModal}
              toggle={toggleAddModal}
              handleSave={handleAddDeviceGroup}
            />
            <button
              type="button"
              className="btn btn-primary"
              id="addModalBtn"
              onClick={handleAddButtonClick}
            >
              Thêm mới danh mục
            </button>
            <form
              id="searchForm"
              className="input-group justify-content-end"
              style={{ width: "40%" }}
            >
              <input
                type="text"
                id="searchInput"
                className="form-control"
                placeholder="Tìm theo tên danh mục"
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
          {loading ? ( // Loading state handling
            <div>Loading...</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Mã nhóm thiết bị</th>
                  <th>Tên nhóm thiết bị</th>
                  <th>Mô tả</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {deviceGroups.map((deviceGroup, index) => (
                  <tr key={index}>
                    <td>{deviceGroup.groupId}</td>
                    <td>{deviceGroup.groupName}</td>
                    <td>{deviceGroup.description}</td>
                    <td>
                      <button
                        className="btn btn-primary editModalBtn"
                        data-category-name={deviceGroup.name}
                        onClick={() =>
                          handleEditButtonClick({
                            groudId: deviceGroup.groupId,
                            groudName: deviceGroup.groupName,
                            description: deviceGroup.description,
                          })
                        }
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        className="btn btn-danger deleteModalBtn"
                        onClick={() =>
                          handleDeleteButtonClick({
                            groudId: deviceGroup.groupId,
                            groudName: deviceGroup.groupName,
                            description: deviceGroup.description,
                          })
                        }
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {showEditModal && (
        <ModalEditDeviceGroup
          isOpen={showEditModal}
          toggle={toggleEditModal}
          deviceGroup={deviceGroup}
          handleUpdate={handleUpdateDeviceGroup}
        />
      )}
      {showDeleteModal && (
        <ModalDeleteDeviceGroup
          isOpen={showDeleteModal}
          toggle={toggleDeleteModal}
          deviceGroup={deviceGroup}
          handleDelete={handleDeleteDeviceGroup}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default DeviceGroupManagement;
