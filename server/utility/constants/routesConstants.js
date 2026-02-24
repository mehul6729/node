export const MAIN_ROUTES = {
  AUTH: "/api/auth",
  PRODUCT: "api/product",
  ADMIN: "api/admin",
  USER: "api/user",
};

export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  LOGOUT: "/logout",
  REFRESH: "/refresh-token",
};

export const USER_ROUTES = {
  PROFILE: "/profile",
  CART: "/cart",
  UPDATE_PROFILE: "/update-profile",
};

export const PRODUCT_ROUTES = {
  GET_ALL: "/",
  GET_ONE: "/:id",
  CREATE: "/create",
  UPDATE: "/:id",
  DELETE: "/:id",
};

export const ORDER_ROUTES = {
  PLACE_ORDER: "/place",
  GET_USER_ORDERS: "/my-orders",
  GET_ONE: "/:id",
  UPDATE_STATUS: "/:id/status",
};
