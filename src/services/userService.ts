// src/services/userService.ts
import apiClient from "@/api";

export const fetchUserData = async () => {
  try {
    const response = await apiClient.get("/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
