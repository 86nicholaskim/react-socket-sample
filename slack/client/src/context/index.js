import { createContext, useReducer } from 'react';
import {
  AUTH_INFO,
  CURRENT_CHAT,
  GROUP_LIST,
  GRUOP_CHAT,
  USER_LIST,
} from './action';

const initialState = {
  loginInfo: {
    userId: '',
    socketId: '',
  },
  userList: [],
  groupList: [],
  currentChat: {
    targetId: [],
    roomNumber: '',
    targetSocketId: '',
  },
  groupChat: {
    textBarStatus: false,
    groupChatNames: [],
  },
};

const Context = createContext({});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_INFO:
      return { ...state, loginInfo: action.payload };
    case USER_LIST:
      return { ...state, userList: action.payload };
    case GROUP_LIST:
      return { ...state, groupList: action.payload };
    case CURRENT_CHAT:
      return { ...state, currentChat: action.payload };
    case GRUOP_CHAT:
      return { ...state, groupChat: action.payload };
    default:
      return state;
  }
};

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Context.Provider value={value}>{children}</Context.Provider>;
};
export { Context, StoreProvider };
