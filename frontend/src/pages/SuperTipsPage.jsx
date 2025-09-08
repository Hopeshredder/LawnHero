import CustomAccordion from "../components/MUIAccordion";
import { useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

export default function SuperTips() {
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [error, setError] = useState("");

  const accordions = [
    {
      title: "Super Tip 1: Yard Creation",
      content: `Welcome to the Yard Creation tool! This tool helps you set up your yard profile so that all Super Tips can be tailored specifically to your yard.

      First, provide general information about your yard using the New Yard button on your Dashboard:
      - **Zip code:** Enables climate and regional soil insights.
      - **Soil type:** Helps determine watering, fertilizing, and aeration needs.
      - **Grass type:** Allows tips to be specific to your turf.

      Next, provide yard preferences:
      - **Watering schedule and rate:** Helps optimize irrigation suggestions.
      - **Mowing frequency:** Ensures mowing tips fit your routine.
      - **Seasonal tasks:** Fertilizing, aeration, dethatching schedules can be integrated.

      Finally, the more accurate and up-to-date the information, the more personalized your Super Tips will be. `,
    },
    {
      title: "Super Tip 2: Watering Optimization",
      content: `Proper watering is key to a healthy, resilient lawn. Water efficiently to promote deep root growth, avoid stress, and prevent costly water bills. Overwatering can cause runoff and disease, while underwatering weakens or even kills the grass.

        [AI-Customized Content Placeholder: The AI will generate personalized watering intervals, amounts, and seasonal adjustments based on your provided yard data and preferences.]`,
    },
    {
      title: "Super Tip 3: Essential Yard Tools",
      content: `Maintaining your yard efficiently starts with having the right tools. Essential tools may include a lawn mower, edger, fertilizer spreader, dethatching equipment, aerator, irrigation system, shovel, soil moisture meter, soil test kit, rain gauge, and gloves. Using the correct tools for your tasks saves time, reduces effort, and helps your yard stay healthy.

        [AI-Customized Content Placeholder: The AI will suggest which tools are most important or beneficial for your specific yard based on its size, layout, grass type, and your yard preferences. Also details on maintining individual tools.]`,
    },
    {
      title: "Super Tip 4: Troubleshooting Yard Problems",
      content: `Yards can encounter common issues such as overwatering, underwatering, poor soil-to-grass matching, pests, diseases, and weeds. Being aware of these problems helps maintain a healthy lawn and prevent long-term damage.

        [AI-Customized Content Placeholder: The AI will analyze your yard data and preferences to provide tailored solutions and recommendations for any issues detected, specific to your grass type, soil, location, and schedule. It will also list high priority pests (their symptoms), diseases (their symptoms), and weeds.]`,
    },
    {
      title: "Super Tip 5: Mowing Tips",
      content: `Regular mowing keeps your grass healthy, prevents thatch buildup, and promotes strong root growth. Always keep your mower blades sharp — dull blades tear the grass and increase stress on your lawn. Avoid cutting too much at once; a good rule of thumb is no more than one-third of the grass height per mow.

      [AI-Customized Content Placeholder: The AI will suggest optimal mowing intervals, heights, and timing based on your grass type, current height, and cutting preferences, ensuring you don’t let your grass get too long before mowing.]`,
    },
    {
      title: "Super Tip 6: Fertilizing Best Practices",
      content: `Fertilizing your lawn provides essential nutrients that promote healthy growth, vibrant color, and resilience against stress. The type and amount of fertilizer should be chosen based on your soil composition, grass type, and the season. Over-fertilizing can harm your lawn and the environment, while under-fertilizing may limit growth and color.

      [AI-Customized Content Placeholder: The AI will generate a personalized fertilizing plan for your yard, including recommended fertilizer types, application rates, and seasonal timing, tailored to your grass type, soil, and maintenance schedule.]`,
    },
    {
      title: "Super Tip 7: Aerating Your Lawn",
      content: `Aerating your lawn helps relieve soil compaction, improves water and nutrient absorption, and promotes stronger root growth. Regular aeration enhances overall turf health and resilience.  

      [AI-Customized Content Placeholder: The AI will recommend the best times and methods to aerate your yard based on your soil type, grass variety, and seasonal conditions, tailored to your specific yard preferences.]`,
    },
    {
      title: "Super Tip 8: Dethatching Guide",
      content: `A thick layer of thatch can block water, nutrients, and air from reaching your grass roots, reducing lawn health. Dethatching helps remove this layer, encouraging stronger growth and better nutrient absorption.

      [AI-Customized Content Placeholder: The AI will recommend the best timing and method for dethatching your yard based on your grass type, soil conditions, and maintenance schedule.]`,
    },
  ];

  // filters accordions by filter box text
  const filteredAccordions = accordions.filter((item) =>
    item.title.toLowerCase().includes(filter.toLowerCase())
  );

  const handleQuery = () => {
    setError("");
    // add query functionality.
  };

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24">
      <h1 className="text-2xl font-bold mb-2 text-center">Super Tips</h1>
      <br />

      {/* Query AI */}
      <div>
        <input
          type="ask"
          id="ask"
          placeholder="Ask AI a question about your yard"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 rounded border border-var(--color-medium) bg-var(--color-light) text-var(--color-darkest) focus:outline-none focus:ring-2 focus:ring-var(--color-medium)"
        />
        <button
          onClick={handleQuery}
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
          Ask AI
        </button>
      </div>

      {/* Filter Input and Toggle Button */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex-1 h-[52px] flex items-center relative">
          {/* Clear (X) button */}
          {filter && (
            <button
              onClick={() => setFilter("")}
              className="absolute left-3 text-gray-500 hover:text-gray-800 focus:outline-none"
            >
              ✕
            </button>
          )}

          {/* Input */}
          <input
            type="text"
            id="filter"
            placeholder="ex: watering techniques"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`w-full pl-10 pr-3 h-[52px] rounded border border-var(--color-medium) bg-var(--color-light) text-var(--color-darkest) focus:outline-none focus:ring-2 focus:ring-var(--color-medium) transition-opacity duration-300 ${
              showFilter ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setShowFilter((prev) => !prev)}
          className="relative flex items-center justify-center gap-2 h-[52px] px-4 rounded font-semibold transition duration-200"
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
          <FilterAltIcon />

          {/* Active labels */}
          <span className={`${showFilter ? "block" : "hidden"}`}>
            Hide Super Tips Filter
          </span>
          <span className={`${showFilter ? "hidden" : "block"}`}>
            Show Super Tips Filter
          </span>

          {/* Invisible placeholder keeps width stable */}
          <span className="invisible absolute">Hide Super Tips Filter</span>
        </button>
      </div>

      <br />

      {/* Render filtered accordions */}
      <div className="space-y-4">
        {filteredAccordions.length > 0 ? (
          filteredAccordions.map((item, idx) => (
            <CustomAccordion
              key={idx}
              title={item.title}
              content={item.content}
            />
          ))
        ) : (
          <p>{error || "No tips found."}</p>
        )}
      </div>
    </div>
  );
}
