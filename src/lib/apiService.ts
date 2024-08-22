import { getApiUrl } from "@/utils/ApiHelper";
const apiUrl = getApiUrl();
const token = "your_jwt_bearer_token_here";

const apiService = {
  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    console.log(`${apiUrl}${endpoint}`);
    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async put<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default apiService;
