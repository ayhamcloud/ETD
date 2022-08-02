import Cookies from "js-cookie";
import { createContext, useReducer } from "react";

const userName = Cookies.get("uname");

export const Store = createContext<any>({});
const initialState = {
  userInfo: userName ? userName : null,
};

function reducer(state, action) {
  switch (action.type) {
  case "USER_LOGIN":
    return { ...state, userInfo: action.payload };
  case "USER_LOGOUT":
    return {
      ...state,
      userInfo: null,
    };

  default:
    return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
