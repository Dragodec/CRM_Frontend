export const BASE_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(endpoint, method = "GET", body = null) {
  async function doRequest() {
    const response = await fetch(BASE_URL + endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : null,
      credentials: "include", // include cookies
    });
    return response;
  }

  let response = await doRequest();

  // If access token expired → try refresh
  if (response.status === 401 || response.status === 403) {
    const refreshRes = await fetch(BASE_URL + "auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      // Retry original request after refresh
      response = await doRequest();
    } else {
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!response.ok) {
    let errorMsg = `Request failed with status ${response.status}`;
    try {
      const errData = await response.json();
      errorMsg = errData.error || errData.message || errorMsg;
    } catch {
      // none
    }
    throw new Error(errorMsg);
  }

  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
