import CustomAccordion from "./MUIAccordion";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useState, useEffect } from "react";
import { getTips } from "../Api";

export default function SuperTipsYardAccordion({ yard }) {
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [superTips, setSuperTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch tips for this yard when component mounts
  useEffect(() => {
    const fetchTips = async () => {
      if (!yard?.id) return;
      setLoading(true);
      setError("");
      try {
        const tips = await getTips(yard.id);
        if (tips) {
          // Convert the tips object into an array for the accordion
          const tipsArray = [
            {
              title: "Super Tip 2: Watering",
              content: (
                <>
                  Proper watering is key to a healthy, resilient lawn. Water
                  efficiently to promote deep root growth, avoid stress, and
                  prevent costly water bills. Overwatering can cause runoff and
                  disease, while underwatering weakens or even kills the grass.
                  <br />
                  {tips.watering.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </>
              ),
            },
            {
              title: "Super Tip 3: Tools",
              content: (
                <>
                  Maintaining your yard efficiently starts with having the right
                  tools. Essential tools may include a lawn mower, edger,
                  fertilizer spreader, dethatching equipment, aerator,
                  irrigation system, shovel, soil moisture meter, soil test kit,
                  rain gauge, and gloves. Using the correct tools for your tasks
                  saves time, reduces effort, and helps your yard stay healthy.
                  <br />
                  {tips.tools.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </>
              ),
            },
            {
              title: "Super Tip 4: Yard Problems",
              content: (
                <>
                  Yards can encounter common issues such as overwatering,
                  underwatering, poor soil-to-grass matching, pests, diseases,
                  and weeds. Being aware of these problems helps maintain a
                  healthy lawn and prevent long-term damage.
                  <br />
                  {tips.yard_problems.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </>
              ),
            },
            {
              title: "Super Tip 5: Mowing",
              content: (
                <>
                  Regular mowing keeps your grass healthy, prevents thatch
                  buildup, and promotes strong root growth. Avoid cutting too
                  much at once; a good rule of thumb is no more than one-third
                  of the grass height per mow.
                  <br />
                  {tips.mowing.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </>
              ),
            },
            {
              title: "Super Tip 6: Fertilizing",
              content: (
                <>
                  Fertilizing your lawn provides essential nutrients that
                  promote healthy growth, vibrant color, and resilience against
                  stress. The type and amount of fertilizer should be chosen
                  based on your soil composition, grass type, and the season.
                  Over-fertilizing can harm your lawn and the environment, while
                  under-fertilizing may limit growth and color.
                  <br />
                  {tips.fertilizing.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </>
              ),
            },
            {
              title: "Super Tip 7: Aerating",
              content: (
                <>
                  Aerating your lawn helps relieve soil compaction, improves
                  water and nutrient absorption, and promotes stronger root
                  growth. Regular aeration enhances overall turf health and
                  resilience.
                  <br />
                  {tips.aerating.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </>
              ),
            },
            {
              title: "Super Tip 8: Dethatching",
              content: (
                <>
                  A thick layer of thatch can block water, nutrients, and air
                  from reaching your grass roots, reducing lawn health.
                  Dethatching helps remove this layer, encouraging stronger
                  growth and better nutrient absorption.
                  <br />
                  {tips.dethatching.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </>
              ),
            },
          ];

          setSuperTips(tipsArray);
        }
      } catch (err) {
        setError("Failed to load tips");
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, [yard?.id]);

  const handleQuery = async () => {
    // TODO: hook this to ai query
    console.log("ask ai");
  };

  const filteredTips = superTips.filter((tip) =>
    tip.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <CustomAccordion
      title={yard.yard_name}
      content={
        <>
          {/* Query AI */}
          {/* <div className="mt-2">
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
          </div> */}

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
