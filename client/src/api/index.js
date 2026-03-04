import axios from "axios";

const api = axios.create({
  baseURL: "",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Auth
export const register = (data) => api.post("/api/auth/register", data);
export const login = (data) => api.post("/api/auth/login", data);
export const logout = () => api.post("/api/auth/logout");

// Products (public)
export const getProducts = (params) => api.get("/product/get/list", { params });
export const getProductDetails = (id) => api.get(`/product/get/details/${id}`);

// Products (admin)
export const addProduct = (data) => api.post("/product/add", data);
export const updateProduct = (data) => api.post("/product/update", data);
export const deleteProduct = (id) => api.delete(`/product/${id}`);
export const uploadProductImage = (formData) =>
  api.post("/product/img/save", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteProductImage = (fileName) =>
  api.post("/product/img/delete", { fileName });

// User (auth required)
export const getUserDetails = () => api.get("/user/get/details");
export const updateProfile = (data) => api.put("/user/profile", data);
export const addToCart = (cart) => api.post("/user/cart", { cart });
export const setCart = (cart) => api.put("/user/cart", { cart });
export const createOrder = (data) => api.post("/user/create/order", data);
export const getMyOrders = () => api.get("/user/orders");

// Admin
export const getAdminOrders = () => api.get("/admin/get/orders");
export const updateOrderStatus = (data) =>
  api.post("/admin/update/order/status", data);

export default api;
