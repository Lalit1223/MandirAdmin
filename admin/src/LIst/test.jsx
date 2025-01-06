// src/api.js
import axios from "axios";

export const fetchBooks = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/books");
    return response.data; // Return the data directly
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error; // Re-throw the error to handle it in the calling code
  }
};
