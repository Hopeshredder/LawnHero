import Accordion from "../components/MUIAccordion";
import { useState } from "react";

export default function SuperTips() {
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async () => { // How are we handling search?
    setError("");
    try {
      const searchResult = await searchSuperTips(search);
      setSearch("");
      console.log("Searched ", search);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          JSON.stringify(err.response?.data) ||
          "Search failed"
      );
    } finally {
      console.log("Search sucessful", searchResult);
    }
  };

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24">
      <h1>
        SUPER TIPS PAGE A stack of accordions that collapse and expand with info
      </h1>
      <br></br>
      <div>
        <input
          type="search"
          id="search"
          placeholder="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded border border-var(--color-medium) bg-var(--color-light) text-var(--color-darkest) focus:outline-none focus:ring-2 focus:ring-var(--color-medium)"
        />
        <button
          onClick={handleSearch}
          className="w-full py-3 mt-2 rounded font-semibold transition duration-200"
          style={{
            backgroundColor: "var(--color-medium)",
            color: "var(--color-lightest)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--color-dark)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--color-medium)")
          }
        >
          Search
        </button>
      </div>
      <br></br>
      {/* need to render accordion with .map? and filter by search, pass in title and content */}
      <Accordion /> 
    </div>
  );
}
