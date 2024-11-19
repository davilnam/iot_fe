// reducer.js
import { TOGGLE_SIDEBAR, LOGIN_SUCCESS, LOGOUT, TOGGLE_SYSTEM_STATUS } from "../actions/actionTypes";

const initialState = {
  isSidebarOpen: false,
  isLoggedIn: false,
  isAdmin: false,
  user: null,
  currentPath: "/",
  cnt: 0,
  systemStatus: true, // Default active
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        isSidebarOpen: !state.isSidebarOpen,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload.user,
        isAdmin: action.payload.isAdmin,
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        isAdmin: false,
        user: null,
      };
    case "SAVE_CURRENT_PATH":
      return {
        ...state,
        currentPath: action.payload,
      };

    case TOGGLE_SYSTEM_STATUS:
      return {
        ...state,
        systemStatus: action.payload, // Cập nhật trạng thái system
      };
    case "UPDATE_CNT":
      console.log(action.payload);
      return {
        ...state,
        cnt: action.payload, // Cập nhật giá trị cnt
      };
    default:
      return state;
  }
};

export default reducer;
