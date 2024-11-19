import React, { useState, useEffect  } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const ModalAddDeviceGroup = ({ isOpen, toggle, handleSave }) => {
    const [groupId, setGroupId] = useState('');
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');

    // Reset giá trị khi modal đóng
    useEffect(() => {
        if (!isOpen) {
            // Khi modal đóng, reset lại các giá trị
            setGroupId('');
            setGroupName('');
            setDescription('');
        }
    }, [isOpen]);

    // Hàm xử lý sự kiện khi người dùng thay đổi giá trị trong các input
    const handleOnChangeGroupId = (event) => {
        setGroupId(event.target.value);
    }

    const handleOnChangeGroupName = (event) => {
        setGroupName(event.target.value);
    }

    const handleOnChangeDescription = (event) => {
        setDescription(event.target.value);
    }

    // Hàm xử lý khi người dùng nhấn nút Save
    const handleSaveButtonClick = () => {
        // Tạo một đối tượng deviceGroup và gọi handleSave
        const newDeviceGroup = {
            groupId,
            groupName,
            description
        };        
        handleSave(newDeviceGroup); // Gửi đối tượng này lên handleSave để xử lý lưu
        toggle(); // Đóng modal sau khi lưu
    }

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Thêm mới nhóm thiết bị</ModalHeader>
            <ModalBody>
                <form id="createForm">
                    <div className="form-group">
                        <label htmlFor="groupId">Mã Nhóm thiết bị</label>
                        <input
                            type="text"
                            className="form-control"
                            value={groupId}
                            onChange={handleOnChangeGroupId}
                            id="groupId"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="groupName">Tên nhóm thiết bị</label>
                        <input
                            type="text"
                            className="form-control"
                            value={groupName}
                            onChange={handleOnChangeGroupName}
                            id="groupName"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Mô tả nhóm thiết bị</label>
                        <textarea
                            className="form-control"
                            value={description}
                            onChange={handleOnChangeDescription}
                            id="description"
                            required
                        />
                    </div>
                </form>
            </ModalBody>
            <ModalFooter>
                <Button className='btn btn-primary' onClick={handleSaveButtonClick}>Save</Button>
                <Button color="secondary" onClick={toggle}>Close</Button>
            </ModalFooter>
        </Modal>
    );
}

export default ModalAddDeviceGroup;
