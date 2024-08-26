import { getApiUrl } from "@/utils/ApiHelper";

const apiUrl = getApiUrl();

const apiService = {
  async fetchToken(): Promise<string | null> {
    try {
      const response = await fetch(`/api/auth`, { credentials: "include" });
      if (!response.ok) {
        throw new Error("Failed to fetch token");
      }
      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error("Error fetching token:", error);
      return null;
    }
  },
  async get<T>(endpoint: string): Promise<T> {
    try {
      const token = await this.fetchToken();
      // const user = useAuthStore.getState().user;
      // const token = user?.token;
      console.log("Token:", token);

      const response = await fetch(`${apiUrl}${endpoint}`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log(apiUrl + endpoint, status, response);
      const result = (await response.json()) as T;
      // console.log("result", result);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const token = await this.fetchToken();
      if (!token) {
        throw new Error("Token is not available");
      }
      const response = await fetch(`${apiUrl}${endpoint}`, {
        credentials: "include",
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
      console.log(apiUrl + endpoint, status, response);
      const result = (await response.json()) as T;
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async put<T>(endpoint: string, data: any): Promise<T> {
    try {
      const token = await this.fetchToken();
      if (!token) {
        throw new Error("Token is not available");
      }
      const response = await fetch(`${apiUrl}${endpoint}`, {
        credentials: "include",
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
      console.log(apiUrl + endpoint, status, response);
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const token = await this.fetchToken();
      if (!token) {
        throw new Error("Token is not available");
      }
      const response = await fetch(`${apiUrl}${endpoint}`, {
        credentials: "include",
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log(apiUrl + endpoint, status, response);
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default apiService;
