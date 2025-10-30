import React, { useState, useEffect } from "react";
import "./App.css"; // importing CSS styling

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: "", author: "", availability: "Available" });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Load from localStorage
  useEffect(() => {
    const savedBooks = JSON.parse(localStorage.getItem("books") || "[]");
    setBooks(savedBooks);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  // Add / Update book
  const handleSubmit = () => {
    if (!form.title || !form.author) {
      alert("Please enter book title and author!");
      return;
    }

    if (editId) {
      const updated = books.map((b) =>
        b.id === editId ? { ...b, ...form } : b
      );
      setBooks(updated);
      setEditId(null);
    } else {
      const newBook = {
        id: Date.now(),
        ...form,
        dateIssued: form.availability === "Issued" ? new Date().toLocaleDateString() : "",
      };
      setBooks([...books, newBook]);
    }

    setForm({ title: "", author: "", availability: "Available" });
  };

  // Edit book
  const handleEdit = (book) => {
    setForm({ title: book.title, author: book.author, availability: book.availability });
    setEditId(book.id);
  };

  // Delete book
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      setBooks(books.filter((b) => b.id !== id));
    }
  };

  // Toggle availability
  const toggleAvailability = (id) => {
    const updated = books.map((b) => {
      if (b.id === id) {
        const newStatus = b.availability === "Available" ? "Issued" : "Available";
        return {
          ...b,
          availability: newStatus,
          dateIssued: newStatus === "Issued" ? new Date().toLocaleDateString() : "",
        };
      }
      return b;
    });
    setBooks(updated);
  };

  // Search filter
  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <h1>📚 Library Book Management System</h1>

      <input
        type="text"
        placeholder="🔍 Search by title or author..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-box"
      />

      <div className="form-container">
        <input
          placeholder="Book Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Author"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />
        <select
          value={form.availability}
          onChange={(e) => setForm({ ...form, availability: e.target.value })}
        >
          <option value="Available">Available</option>
          <option value="Issued">Issued</option>
        </select>
        <button onClick={handleSubmit} className="add-btn">
          {editId ? "Update Book" : "Add Book"}
        </button>
      </div>

      <table className="book-table">
        <thead>
          <tr>
            <th>📖 Title</th>
            <th>✍️ Author</th>
            <th>📦 Status</th>
            <th>📅 Date Issued</th>
            <th>⚙️ Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.length === 0 ? (
            <tr>
              <td colSpan="5">No books found</td>
            </tr>
          ) : (
            filteredBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>
                  <span className={book.availability === "Available" ? "available" : "issued"}>
                    {book.availability}
                  </span>
                </td>
                <td>{book.dateIssued || "-"}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(book)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(book.id)}>Delete</button>
                  <button className="toggle-btn" onClick={() => toggleAvailability(book.id)}>Toggle</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
