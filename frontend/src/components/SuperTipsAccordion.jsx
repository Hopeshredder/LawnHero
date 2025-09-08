import CustomAccordion from "./MUIAccordion";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useState } from "react";

export default function SuperTipsYardAccordion({ yard }) {
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const handleQuery = async () => {
    // placeholder for custom ai query
    console.log("ask ai");
  };

  const superTips = [
    // placeholder for ai generated supertip backend fetch
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

  const filteredTips = superTips.filter((tip) =>
    tip.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <CustomAccordion
      title={yard.yard_name}
      content={
        <>
          {/* Query AI */}
          <div className="mt-2">
            <input
              type="text"
              placeholder="Ask AI a question about your yard"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-3 rounded border border-var(--color-medium) bg-var(--color-light) text-var(--color-darkest) focus:outline-none focus:ring-2 focus:ring-var(--color-medium)"
            />
            <button
              onClick={handleQuery}
              className="w-full relative flex items-center justify-center gap-2 h-[52px] px-4 rounded font-semibold transition duration-200 mt-2"
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
              {filter && (
                <button
                  onClick={() => setFilter("")}
                  className="absolute left-3 text-gray-500 hover:text-gray-800 focus:outline-none"
                >
                  ✕
                </button>
              )}

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
              <span className={`${showFilter ? "block" : "hidden"}`}>
                Hide Filter
              </span>
              <span className={`${showFilter ? "hidden" : "block"}`}>
                Show Filter
              </span>
              <span className="invisible absolute">Show Super Tips Filter</span>
            </button>
          </div>

          <br />

          {/* Nested Super Tips 2–8 */}
          <div className="space-y-4">
            {filteredTips.length > 0 ? (
              filteredTips.map((tip, idx) => (
                <CustomAccordion
                  key={idx}
                  title={tip.title}
                  content={tip.content}
                />
              ))
            ) : (
              <p>No tips found.</p>
            )}
          </div>
        </>
      }
    />
  );
}
