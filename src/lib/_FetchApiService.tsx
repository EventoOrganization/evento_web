//import qs from "qs";
import { getApiUrl } from "../utils/ApiHelper";

export async function fetchAPI(
  method: string,
  path: string,
  urlParamsObject = {},
  options = {},
) {
  try {
    // Merge default and user options
    const mergedOptions = {
      next: { revalidate: 60 },
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    };

    // Build request URL
    //const queryString = qs.stringify(urlParamsObject);
    const queryString = encodeURIComponent(urlParamsObject.toString());
    const requestUrl = `${getApiUrl(
      `/api${path}${queryString ? `?${queryString}` : ""}`,
    )}`;

    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(
      `Please check if your server is running and you set all the required tokens.`,
    );
  }
}
