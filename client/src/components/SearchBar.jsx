import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, FormControl, ListGroup, Spinner } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      if (!query.trim()) return; // Prevent empty queries

      setLoading(true);
      try {
        console.log("🚀 Sending API request with query:", query);
        const { data } = await axios.get(
          `http://localhost:5000/api/v1/search`,
          {
            params: { q: query }, // ✅ Use `params` to properly send query
          }
        );

        console.log("🔍 API Response:", data);
        setResults(data);
      } catch (error) {
        console.error("❌ Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSearchClick = (result) => {
    console.log("🧐 Search Result Object:", result);

    if (!result || !result._id) {
      console.error("❌ Invalid search result:", result);
      return;
    }

    // Navigate to the correct product or content page
    navigate(`/products/${result._id}`);
    setQuery("");
    setResults([]);
  };

  return (
    <div className="search-container position-relative">
      <Form className="d-flex">
        <FormControl
          type="search"
          placeholder="Search for products, blogs, categories..."
          className="me-2"
          aria-label="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <FaSearch size={20} color="white" className="search-icon" />
      </Form>

      {/* 🔹 Search Results Dropdown */}
      {query && (
        <ListGroup className="search-dropdown position-absolute w-100 bg-white shadow">
          {loading && <Spinner animation="border" className="m-2" />}

          {results.length > 0
            ? results.map((result) => (
                <ListGroup.Item
                  key={result._id}
                  onClick={() => handleSearchClick(result)}
                  action
                  className="search-item"
                >
                  <strong>{result.title || result.name}</strong>
                  <br />
                  <small className="text-muted">{result.type}</small>
                </ListGroup.Item>
              ))
            : !loading && (
                <ListGroup.Item className="text-muted">
                  No results found
                </ListGroup.Item>
              )}
        </ListGroup>
      )}
    </div>
  );
};

export default SearchBar;
