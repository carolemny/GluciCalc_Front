import Cookies from "js-cookie";
import { AUTH_TOKEN, USER_ID } from "config";
import store from "store/store";
import {
  registrationRequest,
  registrationFailed,
  registrationSuccess,
  logoutRequest,
  logoutFailed,
  logoutSuccess,
  loginRequest,
  loginSuccess,
  loginFailed,
} from "store";
import API from "../api";

export default class UserManager {
  static async registerUser(email, password) {
    store.dispatch(registrationRequest());
    try {
      const response = await API.post("/users", { user: { email, password } });
      store.dispatch(
        registrationSuccess({
          id: response.data.id,
          firstName: response.data.first_name,
        }),
      );
      Cookies.set(AUTH_TOKEN, response.headers.authorization, { expires: 7 });
      Cookies.set(USER_ID, response.data.id, { expires: 7 });
    } catch (error) {
      store.dispatch(registrationFailed(error.message));
    }
  }

  static async logoutUser() {
    store.dispatch(logoutRequest());
    try {
      await API.delete("/users/sign_out");
      store.dispatch(logoutSuccess());
      Cookies.remove(AUTH_TOKEN);
      Cookies.remove(USER_ID);
    } catch (error) {
      store.dispatch(logoutFailed(error.message));
    }
  }

  static async loginUser(email, password) {
    store.dispatch(loginRequest());
    try {
      const response = await API.post("/users/sign_in", { user: { email, password } });
      store.dispatch(
        loginSuccess({
          id: response.data.id,
          firstName: response.data.first_name,
        }),
      );
      Cookies.set(AUTH_TOKEN, response.headers.authorization, { expires: 7 });
      Cookies.set(USER_ID, response.data.id, { expires: 7 });
    } catch (error) {
      store.dispatch(loginFailed(error.message));
    }
  }
}