import CustomAccordion from "../components/MUIAccordion";
import { useState } from "react";

export default function SuperTips() {
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const accordions = [
    {
      title: "Super Tip 1: Water Optimization Techniques",
      content:
        "Water less often for longer. Water in AM when coolest. Use low flow rate irrigation especially on slopes to avoid runoff.",
    },
    {
      title: "Super Tip 2: Common Issues",
      content:
        "This is some sample content for accordion 2. You can replace it with your own text.",
    },
    {
      title: "Super Tip 3: Pest and Disease Identification",
      content:
        "Another accordion body example. Consistent styling keeps things clean.",
    },
    {
      title: "Super Tip 4: Placeholder",
      content: "Last accordion with placeholder text. Styled per your theme.",
    },
  ];

  // filters accordions by search box text
  const filteredAccordions = accordions.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = () => {
    setError("");
    // add search functionality?
  };

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24">

      <br />
      <div>
        <input
          type="search"
          id="search"
          placeholder="ex: watering techniques"
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
      <br />
      {/* Render filtered accordions */}
      <div className="space-y-4">
        {filteredAccordions.length > 0 ? (
          filteredAccordions.map((item, idx) => (
            <CustomAccordion key={idx} title={item.title} content={item.content} />
          ))
        ) : (
          <p>{error || "No tips found."}</p>
        )}
      </div>
    </div>
  );
}
