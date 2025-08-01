import instance from "../utils/axios";

export const getAdminDashboard = () => {
  return instance.get("/api/v1/admin/dashboard");
};
