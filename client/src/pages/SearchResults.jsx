import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import "./SearchResults.css"; // ✅ Import CSS for styling

const SearchResults = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("query");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(`http://localhost:5000/api/v1/search?query=${query}`);

        // ✅ Fix image URL if it's missing "http"
        const formattedResults = data.map((item) => ({
          ...item,
          image: item.image?.startsWith("http")
            ? item.image
            : `http://localhost:5000/uploads/${item.image}`,
        }));

        console.log("🔍 Search Results:", formattedResults);
        setResults(formattedResults);
      } catch (err) {
        console.error("❌ Search Error:", err);
        setError("Failed to fetch search results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="search-results-page">
      <h2>Search Results for: <span className="query-text">{query}</span></h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="search-results-container">
        {results.length > 0 ? (
          results.map((result) => (
            <div key={result.id} className="search-result-card">
              <Link to={`/products/${result.id}`} className="search-result-link">
                <img className="search-result-image" src={result.image} alt={result.title} onError={(e) => (e.target.src = "/placeholder.jpg")} />
                <div className="search-result-info">
                  <h3 className="search-result-title">{result.title}</h3>
                  <button className="view-details-btn">View Details</button>
                </div>
              </Link>
            </div>
          ))
        ) : (
          !loading && <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
