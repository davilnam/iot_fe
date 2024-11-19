import {
  TOGGLE_SIDEBAR,
  LOGIN_SUCCESS,
  LOGOUT,
  TOGGLE_SYSTEM_STATUS
} from "./actionTypes";

export const toggleSidebar = () => ({
  type: TOGGLE_SIDEBAR,
});

export const loginSuccess = (userData) => ({
  type: LOGIN_SUCCESS,
  payload: userData,
});

export const logout = () => ({
  type: LOGOUT,
});


export const saveCurrentPath = (path) => ({
  type: "SAVE_CURRENT_PATH",
  payload: path,
});

export const updateCnt = (newCnt) => {
  return {
    type: "UPDATE_CNT",
    payload: newCnt,
  };
};

export const toggleSystemStatus = (status) => {
  return {
    type: TOGGLE_SYSTEM_STATUS,
    payload: status,
  };
};

