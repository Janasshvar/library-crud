import React, { useState, useEffect } from 'react';
import './App.css';

//waste of time

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('Available');
  const [search, setSearch] = useState('');

  // Load data from localStorage
  useEffect(() => {
    const storedBooks = JSON.parse(localStorage.getItem('books'));
    if (storedBooks) setBooks(storedBooks);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  // Add a new book
  const addBook = (e) => {
    e.preventDefault();
    if (title.trim() === '' || author.trim() === '') return;
    const newBook = {
      id: Date.now(),
      title,
      author,
      status
    };
    setBooks([...books, newBook]);
    setTitle('');
    setAuthor('');
    setStatus('Available');
  };

  // Delete a book
  const deleteBook = (id) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  // Toggle status
  const toggleStatus = (id) => {
    setBooks(
      books.map((book) =>
        book.id === id
          ? { ...book, status: book.status === 'Available' ? 'Issued' : 'Available' }
          : book
      )
    );
  };

  // Search filter
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="App">
      <h1>📚 Library Management System — Webhook Test v2 ✅</h1>
      <p>Automated CI/CD with Jenkins + GitHub Integration</p>

      <form onSubmit={addBook}>
        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Available">Available</option>
          <option value="Issued">Issued</option>
        </select>
        <button type="submit">Add Book</button>
      </form>

      <input
        type="text"
        placeholder="🔍 Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginTop: '10px', padding: '5px', width: '60%' }}
      />

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredBooks.map((book) => (
          <li key={book.id} style={{ margin: '10px 0' }}>
            <strong>{book.title}</strong> by {book.author} —{' '}
            <em>{book.status}</em>
            <button onClick={() => toggleStatus(book.id)} style={{ marginLeft: '10px' }}>
              Toggle Status
            </button>
            <button onClick={() => deleteBook(book.id)} style={{ marginLeft: '10px' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <footer style={{ marginTop: '20px', fontSize: '14px', color: 'gray' }}>
        Build triggered via GitHub Webhook 🚀
      </footer>
    </div>
  );
}

export default App;
