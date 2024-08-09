import { fetchAPI } from "@/lib/Api";

export async function getPageBySlug(slug: string) {
  const token = process.env.API_TOKEN;

  const path = `/pages`;
  const urlParamsObject = { filters: { slug } };
  const options = { headers: { Authorization: `Bearer ${token}` } };
  return await fetchAPI(path, urlParamsObject, options);
}
