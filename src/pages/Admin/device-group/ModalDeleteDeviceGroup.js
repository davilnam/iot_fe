import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const ModalDeleteDeviceGroup = ({ isOpen, toggle, deviceGroup, handleDelete }) => {    
    // khi ấn vào nút Ok sẽ gọi lại hàm handleDelete của cha để xóa 
    const handleDeleteButtonClick = () => {
        handleDelete(deviceGroup);
        toggle();
    }

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Xác nhận xóa</ModalHeader>
            <ModalBody>
                Bạn có chắc chắn muốn xóa?
            </ModalBody>
            <ModalFooter>
                <Button color="danger" onClick={handleDeleteButtonClick}>OK</Button>
                <Button color="secondary" onClick={toggle}>Close</Button>
            </ModalFooter>
        </Modal>
    );
}

export default ModalDeleteDeviceGroup;
