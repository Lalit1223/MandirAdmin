import React from "react";

export default function BookList() {
  const bookList = [
    { id: 1, title: "Bhagavad Gita", author: "Vyasa", pages: 700 },
    { id: 2, title: "Ramayana", author: "Valmiki", pages: 2400 },
    { id: 3, title: "Mahabharata", author: "Vyasa", pages: 7500 },
  ];
  return (
    <div>
      <h3>Book List</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Author</th>
            <th>Pages</th>
          </tr>
        </thead>
        <tbody>
          {bookList.map((book) => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.pages}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
