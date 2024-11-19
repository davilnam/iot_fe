import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const ModalEditDeviceGroup = ({ isOpen, toggle, deviceGroup, handleUpdate }) => {  
    
    const [newDeviceGroup, setNewDeviceGroup] = useState(deviceGroup);
    
    // Sử dụng useEffect để cập nhật khi deviceGroup thay đổi từ cha
    useEffect(() => {
        setNewDeviceGroup(deviceGroup);
    }, [deviceGroup]);  // Cập nhật khi props deviceGroup thay đổi

    // Hàm thay đổi giá trị các input và cập nhật đối tượng newDeviceGroup
    const handleOnChangeInput = (event) => {
        const { id, value } = event.target;
        setNewDeviceGroup(prevState => ({
            ...prevState,
            [id]: value
        }));
    }

    // Khi nhấn nút "Update", gọi hàm handleUpdate với đối tượng newDeviceGroup đã thay đổi
    const handleUpdateButtonClick = () => {
        handleUpdate(newDeviceGroup);  // Gửi đối tượng deviceGroup đã được chỉnh sửa
        toggle();
    }

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Sửa nhóm thiết bị</ModalHeader>
            <ModalBody>
                <form id="editForm">
                    <div className="form-group">
                        <label htmlFor="groupId">Mã Nhóm thiết bị</label>
                        <input
                            type="text"
                            className="form-control"
                            id="groupId"
                            readOnly
                            value={newDeviceGroup.groudId}  // Hiển thị groupId
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="groupName">Tên nhóm thiết bị</label>
                        <input
                            type="text"
                            className="form-control"
                            id="groupName"
                            value={newDeviceGroup.groudName}  // Hiển thị tên nhóm thiết bị
                            onChange={handleOnChangeInput}  // Cập nhật giá trị khi thay đổi
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Mô tả nhóm thiết bị</label>
                        <textarea
                            className="form-control"
                            id="description"
                            value={newDeviceGroup.description}  // Hiển thị mô tả nhóm thiết bị
                            onChange={handleOnChangeInput}  // Cập nhật mô tả khi thay đổi
                            required
                        />
                    </div>
                </form>
            </ModalBody>
            <ModalFooter>
                <Button className="btn btn-primary" onClick={handleUpdateButtonClick}>Cập nhật</Button>
                <Button color="secondary" onClick={toggle}>Đóng</Button>
            </ModalFooter>
        </Modal>
    );
}

export default ModalEditDeviceGroup;
