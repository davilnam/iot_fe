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

const ModalAddDevice = ({ isOpen, toggle, handleSaveDevice }) => {
  const [deviceGroups, setDeviceGroups] = useState([]);
  const [device, setDevice] = useState({
    deviceId: "",
    deviceName: "",
    location: "",
    status: "ONLINE",
    groupId: "",
  });

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
      fetchDeviceGroups(); // Gọi API lấy nhóm thiết bị khi modal mở
    }
  }, [isOpen]);

  useEffect(() => {
    if (deviceGroups.length > 0 && !device.groupId) {
      // Đặt giá trị mặc định cho groupId là groupId của phần tử đầu tiên
      setDevice((prevDevice) => ({
        ...prevDevice,
        groupId: deviceGroups[0].groupId,
      }));
    }
  }, [deviceGroups]);

  const handleOnChangeInput = (event, key) => {
    const { value } = event.target;
    setDevice((prevDevice) => ({
      ...prevDevice,
      [key]: value,
    }));
  };

  const handleSaveButtonClick = () => {
    if (device.deviceId && device.deviceName && device.groupId) {
      handleSaveDevice(device); // Gửi dữ liệu về backend qua prop handleSaveFood
      toggle(); // Đóng modal
      // Reset state device về mặc định
      setDevice({
        deviceId: "",
        deviceName: "",
        location: "",
        status: "",
        groupId: deviceGroups.length > 0 ? deviceGroups[0].groupId : "",
      });
    } else {
      alert("Vui lòng nhập đầy đủ thông tin cần thiết!");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Thêm mới thông tin thiết bị</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="deviceId">Mã thiết bị</Label>
          <Input
            type="text"
            name="deviceId"
            id="deviceId"
            value={device.deviceId}
            onChange={(event) => handleOnChangeInput(event, "deviceId")}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="deviceName">Tên thiết bị</Label>
          <Input
            type="text"
            name="deviceName"
            id="deviceName"
            value={device.deviceName}
            onChange={(event) => handleOnChangeInput(event, "deviceName")}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="location">Vị trí lắp đặt</Label>
          <Input
            type="text"
            name="location"
            id="location"
            value={device.location}
            onChange={(event) => handleOnChangeInput(event, "location")}
          />
        </FormGroup>
        <FormGroup>
          <Label for="status">Trạng thái thiết bị</Label>
          <Input
            type="select"
            name="status"
            id="status"
            value={device.status}
            onChange={(event) => handleOnChangeInput(event, "status")}
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
            value={device.groupId}
            onChange={(event) => handleOnChangeInput(event, "groupId")}
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
        <Button color="success" onClick={handleSaveButtonClick}>
          Lưu
        </Button>
        <Button color="secondary" onClick={toggle}>
          Đóng
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalAddDevice;
