import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { saveCurrentPath } from "../../../actions/actions";
import HeaderAdmin from "../Layout/HeaderAdmin";
import { FaSearch } from "react-icons/fa";

const EventLogManagement = () => {
  const dispatch = useDispatch();
  const [eventLogs, setEventLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10); // Số lượng đơn hàng trên mỗi trang

  const app_api_url = process.env.REACT_APP_API_URL;

  useEffect(() => {
    dispatch(saveCurrentPath(window.location.pathname));
    document.title = "Quản lý lịch sử sự kiện";
    fetchEventLogs(); // Gọi hàm fetchEventLogs khi component được tải
  }, [dispatch]);

  const fetchEventLogs = () => {
    const accessToken = localStorage.getItem("accessToken");
    const url = `${app_api_url}/event-log`;

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setEventLogs(data.result);
        console.log(data.result);  
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // Tính chỉ mục bắt đầu và chỉ mục kết thúc của danh sách đơn hàng trên trang hiện tại
  const indexOfLastOrder = currentPage * itemPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemPerPage;
  const currentList = eventLogs.slice(indexOfFirstOrder, indexOfLastOrder);

  // Hàm để chuyển đến trang mới
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="content">
      <HeaderAdmin></HeaderAdmin>
      <div className="container-fluid pt-4 px-4">
        <div>
          <h3>Quản lý đơn hàng</h3>
          <div className="d-flex align-items-center justify-content-between">
            <form
              id="searchForm"
              className="input-group justify-content-end"
              style={{ width: "40%" }}
            >
              <input
                type="text"
                id="searchInput"
                className="form-control"
                placeholder="Tìm theo tên mã đơn"
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
          <table className="table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Event ID</th>
                <th>TG phát hiện</th>
                <th>Tên thiết bị</th>
                <th>Vị trí lắp đặt</th>
                <th>Thông tin chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {currentList.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.eventId}</td>
                  <td>{item.timestamp}</td>
                  <td>{item.deviceResponse.deviceName}</td>
                  <td>{item.deviceResponse.location}</td>
                  <td>{item.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Phân trang */}
          <ul className="pagination">
            {Array.from(
              { length: Math.ceil(eventLogs.length / itemPerPage) },
              (_, i) => i + 1
            ).map((number) => (
              <li key={number} className="page-item">
                <button onClick={() => paginate(number)} className="page-link">
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EventLogManagement;
