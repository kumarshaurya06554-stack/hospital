const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

export async function getMedicines() {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/medicines`);
  } catch (error) {
    throw new Error("Could not reach the medicine API. Check that the backend is running.", { cause: error });
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error("The medicine API returned an invalid response.", { cause: error });
  }

  if (!response.ok) {
    throw new Error(data.message || `Unable to load medicines (${response.status})`);
  }

  if (data.success === false) {
    throw new Error(data.message || "The medicine API could not load the catalogue.");
  }

  if (!Array.isArray(data.medicines)) {
    throw new Error("The medicine API response is missing the catalogue.");
  }

  return data;
}
