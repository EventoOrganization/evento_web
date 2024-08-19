import axios from "axios";
import { baseURL } from "@/constants";
import { genQueryString } from "@/utils/ApiHelper";

interface API {
  rawValue: string;
  boundary: string;
}

enum methods {
  post = "POST",
  get = "GET",
  delete = "DELETE",
}

export async function ApiService<Model>(
  api: API,
  method: methods = methods.post,
  response: (model: Model, data: ArrayBuffer, any: any) => void,
  urlAppendId?: any,
  param?: any,
): Promise<void> {
  if (!navigator.onLine) {
    console.log("No internet connection");
    return;
  }

  let fullUrlString = baseURL + api.rawValue;

  if (urlAppendId !== undefined) {
    fullUrlString = baseURL + api.rawValue + `/${urlAppendId}`;
  }

  if (method === methods.get) {
    if (param !== undefined) {
      if (typeof param === "string") {
        fullUrlString += "?" + param;
      } else if (typeof param === "object") {
        fullUrlString += genQueryString(param);
      } else {
        console.assert(false, "Parameter must be object or string.");
      }
    }
  }

  const encodedString = encodeURI(fullUrlString);

  const headers: Record<string, string> = {
    Accept: "application/json",
    secretKey: process.env.API_TOKEN || "",
    "Content-Type": `multipart/form-data; boundary=${api.boundary}`,
  };

  const authKey = localStorage.getItem("authKey");
  if (authKey) {
    headers["authorization"] = `Bearer ${authKey}`;
    console.log(`authKey---Bearer ${authKey}`);
  }

  if (method === methods.delete) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
  }

  try {
    const axiosResponse = await axios({
      method: method,
      url: encodedString,
      headers: headers,
      data: param,
    });

    const model = axiosResponse.data as Model;
    response(model, axiosResponse.data, axiosResponse);
  } catch (error) {
    console.error("Error in network request:", error);
  }
}
