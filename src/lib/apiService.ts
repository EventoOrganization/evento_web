import { getApiUrl } from "@/utils/ApiHelper";
const apiUrl = getApiUrl();

const apiService = {
  async getToken() {
    try {
      const response = await fetch("/api/auth/session");
      if (!response.ok) {
        throw new Error("Failed to fetch token");
      }
      const data = (await response.json()) || "";
      return data.token;
    } catch (error) {
      console.error("Error fetching token:", error);
      return null;
    }
  },
  async get<T>(endpoint: string): Promise<T> {
    const token = await this.getToken();
    console.log("Token retrieved for GET:", token);

    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("GET request error:", error);
      throw error;
    }
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    const token = (await this.getToken()) || "";
    console.log("Token retrieved for POST:", token);
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
      console.error("POST request error:", error);
      throw error;
    }
  },

  async put<T>(endpoint: string, data: any): Promise<T> {
    const token = await this.getToken();
    console.log("Token retrieved for PUT:", token);

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
      console.error("PUT request error:", error);
      throw error;
    }
  },

  async delete<T>(endpoint: string): Promise<T> {
    const token = await this.getToken();
    console.log("Token retrieved for DELETE:", token);

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
      console.error("DELETE request error:", error);
      throw error;
    }
  },
};

export default apiService;
