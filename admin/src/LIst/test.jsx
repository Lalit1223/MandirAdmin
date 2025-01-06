import React, { useEffect, useState } from "react";
import axios from "axios";

const BookCount = () => {
  const [bookCount, setBookCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/books/count"
        );
        setBookCount(response.data.count);
      } catch (error) {
        console.error("Error fetching book count:", error);
        alert("Failed to fetch the count of books.");
      }
    };

    fetchCount();
  }, []);

  return (
    <div className="container">
      <h1>Total Books</h1>
      <p>There are {bookCount} books in the database.</p>
    </div>
  );
};

export default BookCount;
