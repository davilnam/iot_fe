import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

const ModalEditDevice = ({ isOpen, toggle, device, handleUpdateDevice }) => {
  const [newDevice, setNewDevice] = useState(device);

  const [deviceGroups, setDeviceGroups] = useState([]);
  const app_api_url = process.env.REACT_APP_API_URL;

  // Fetch danh sách nhóm thiết bị
  const fetchDeviceGroups = () => {
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
        setDeviceGroups(data.result || []);
      })
      .catch((error) => {
        console.error("Error fetching device groups:", error);
      });
  };

  useEffect(() => {
    if (isOpen) {
      setNewDevice(device); // Đặt lại giá trị ban đầu khi modal mở
      fetchDeviceGroups(); // Gọi API lấy nhóm thiết bị
    }
  }, [isOpen, device]);

  const handleInputChange = (event, key) => {
    const { value } = event.target;
    setNewDevice((prevDevice) => ({
      ...prevDevice,
      [key]: value, // Cập nhật giá trị cho key đã chỉ định
    }));
  };

  const handleUpdateButtonClick = () => {
    // Xử lý cập nhật thông tin thiết bị
    handleUpdateDevice(newDevice);
    // Đóng modal sau khi cập nhật
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Sửa thông tin thiết bị</ModalHeader>
      <ModalBody>
        {/* Mã thiết bị */}
        <FormGroup>
          <Label for="deviceId">Mã thiết bị</Label>
          <Input
            type="text"
            name="deviceId"
            id="deviceId"
            readOnly
            value={newDevice.deviceId}
            onChange={(event) => handleInputChange(event, "deviceId")}
            required
          />
        </FormGroup>
        {/* Tên thiết bị */}
        <FormGroup>
          <Label for="deviceName">Tên thiết bị</Label>
          <Input
            type="text"
            name="deviceName"
            id="deviceName"
            value={newDevice.deviceName}
            onChange={(event) => handleInputChange(event, "deviceName")}
            required
          />
        </FormGroup>
        {/* Vị trí lắp đặt */}
        <FormGroup>
          <Label for="location">Vị trí lắp đặt</Label>
          <Input
            type="text"
            name="location"
            id="location"
            value={newDevice.location}
            onChange={(event) => handleInputChange(event, "location")}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="status">Trạng thái thiết bị</Label>
          <Input
            type="select"
            name="status"
            id="status"
            value={newDevice.status || "ONLINE"} // Cung cấp giá trị mặc định nếu không có giá trị
            onChange={(event) => handleInputChange(event, "status")}
            required
          >
            <option value="ONLINE">ONLINE</option>
            <option value="OFFLINE">OFFLINE</option>
          </Input>
        </FormGroup>

        <FormGroup>
          <Label for="groupId">Tên nhóm thiết bị</Label>
          <Input
            type="select"
            name="groupId"
            id="groupId"
            value={newDevice.groupId || ""} // Giá trị của nhóm thiết bị hiện tại
            onChange={(event) => handleInputChange(event, "groupId")}
            required
          >
            {deviceGroups.length === 0 && (
              <option value="" disabled>
                Đang tải nhóm thiết bị...
              </option>
            )}
            {deviceGroups.map((item) => (
              <option key={item.groupId} value={item.groupId}>
                {item.groupName}
              </option>
            ))}
          </Input>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={handleUpdateButtonClick}>
          Cập nhật
        </Button>
        <Button color="secondary" onClick={toggle}>
          Đóng
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalEditDevice;
