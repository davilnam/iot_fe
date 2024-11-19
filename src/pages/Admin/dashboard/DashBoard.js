import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveCurrentPath, toggleSystemStatus, updateCnt } from "../../../actions/actions";
import HeaderAdmin from "../Layout/HeaderAdmin";
import { Card, CardBody, CardTitle, Button, Input, Label, Col, Row } from "reactstrap";
import { IoIosPower, IoIosAlarm, IoIosSpeedometer } from "react-icons/io";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const DashBoard = () => {
  const dispatch = useDispatch();
  const [motionDetected, setMotionDetected] = useState(false);
  const [motionDetails, setMotionDetails] = useState(null); // Details of motion detection
  const systemStatus = useSelector((state) => state.app.systemStatus);
  const [alarmDelay, setAlarmDelay] = useState(5); // Default 5s

  const cnt = useSelector((state) => state.app.cnt);
  const [newCnt, setNewCnt] = useState(cnt);

  const [stompClient, setStompClient] = useState(null); // WebSocket client

  useEffect(() => {
    document.title = "Dashboard";
    dispatch(saveCurrentPath(window.location.pathname));
  }, [dispatch]);

  // WebSocket connection
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/iot/ws"); // Replace with your WebSocket server URL
    const client = Stomp.over(socket);

    client.connect({}, () => {
      // console.log("WebSocket connected");
      setStompClient(client);

      // Subscribe to the topic for motion detection
      client.subscribe("/topic/motion-detected", (message) => {
        const data = JSON.parse(message.body);
        // console.log(data);

        // Update motion details and set detection to true
        setMotionDetails(data);
        setMotionDetected(true);
        
        setNewCnt(data.cnt);
        // Tăng giá trị cnt và cập nhật vào Redux
        dispatch(updateCnt(data.cnt));

        // Automatically hide the alert after the specified delay
        setTimeout(() => {
          setMotionDetected(false);
          setMotionDetails(null);
        }, alarmDelay * 1000);
      });
    });

    // return () => {
    //   client.disconnect(() => {
    //     console.log("WebSocket disconnected");
    //   });
    // };
  }, [alarmDelay, cnt, dispatch]);

  // Toggle system status using WebSocket
  const toggleSystem = () => {
    const newStatus = !systemStatus;
    dispatch(toggleSystemStatus(newStatus)); // Toggle trạng thái

    if (stompClient) {
      stompClient.send(
        "/app/system-toggle", // Destination topic on the server
        {},
        JSON.stringify({ status: newStatus ? "ON" : "OFF" })
      );
    }
  };

  // Update alarm delay using WebSocket
  const handleAlarmTriggerTimeChange = (event) => {
    const newDelay = event.target.value;
    setAlarmDelay(newDelay);

    if (stompClient) {
      stompClient.send(
        "/app/set-alarm-time", // Destination topic on the server
        {},
        JSON.stringify({ delay: newDelay })
      );
    }
  };

  return (
    <div className="content" style={{ backgroundColor: "#f4f4f4", color: "#333", minHeight: "100vh" }}>
      <HeaderAdmin />
      <div className="container-fluid pt-4 px-4">
        <h2 className="text-center text-dark mb-5">Hệ Thống Cảnh Báo Trộm</h2>

        <Row>
          {/* Motion Detection Notification */}
          <Col lg="12" className="mb-4">
            <Card className={`shadow-lg ${motionDetected ? "bg-danger" : "bg-info"}`} style={{ borderRadius: "15px" }}>
              <CardBody className="text-center">
                <IoIosAlarm size={50} className="mb-3" />
                <CardTitle tag="h5" className="text-light">
                  {motionDetected
                    ? `Cảnh Báo: Phát Hiện Chuyển Động tại ${motionDetails?.timestamp || "không xác định"}!`
                    : "Chưa Phát Hiện Chuyển Động"}
                </CardTitle>
                {motionDetails && motionDetected && (
                  <p className="text-light">
                    Thiết bị: {motionDetails.deviceName} - lắp đặt tại ví trí: {motionDetails.location} phát hiện chuyển động bất thường vui lòng kiểm tra
                  </p>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="d-flex">
          {/* System Control */}
          <Col lg="4" className="mb-4 d-flex">
            <Card className="shadow-lg w-100" style={{ borderRadius: "15px", backgroundColor: "#ffffff" }}>
              <CardBody>
                <h5 className="text-center text-dark">Điều Khiển Hệ Thống</h5>
                <div className="text-center">
                  <Button
                    color={systemStatus ? "success" : "danger"}
                    onClick={toggleSystem}
                    size="lg"
                    style={{
                      width: "200px",
                      borderRadius: "30px",
                      fontSize: "18px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <IoIosPower size={25} className="mr-2" />
                    {systemStatus ? "Tắt Hệ Thống" : "Bật Hệ Thống"}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* Settings Panel */}
          <Col lg="4" className="mb-4 d-flex">
            <Card className="shadow-lg w-100" style={{ borderRadius: "15px", backgroundColor: "#ffffff" }}>
              <CardBody>
                <h5 className="text-center text-dark">Cài Đặt Hệ Thống</h5>
                {/* Alarm Delay */}
                <div className="mb-3">
                  <Label className="text-dark">Thời Gian Kích Hoạt Cảnh Báo (giây)</Label>
                  <Input
                    type="number"
                    value={alarmDelay}
                    onChange={handleAlarmTriggerTimeChange}
                    min="1"
                    max="5"
                    step="1"
                    className="form-control"
                    style={{ borderRadius: "10px" }}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* System Stats */}
          <Col lg="4" className="mb-4 d-flex">
            <Card className="shadow-lg w-100" style={{ borderRadius: "15px", backgroundColor: "#ffffff" }}>
              <CardBody>
                <h5 className="text-center text-dark">Thống Kê Hệ Thống</h5>
                <div className="text-center">
                  <IoIosSpeedometer size={50} className="mb-3" />
                  <CardTitle tag="h5" className="text-dark">
                    Số lần phát hiện chuyển động: {newCnt}
                  </CardTitle>
                  <Button
                    color="primary"
                    size="sm"
                    style={{
                      width: "150px",
                      borderRadius: "20px",
                      fontSize: "14px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Xem Chi Tiết
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DashBoard;
