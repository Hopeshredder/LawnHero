import CustomAccordion from "../components/MUIAccordion";
import { useState, useEffect } from "react";
import SuperTipsYardAccordion from "../components/SuperTipsAccordion";
import { getYardList } from "../Api";

export default function SuperTips() {
  const [yards, setYards] = useState([]);

  useEffect(() => {
    const fetchYards = async () => {
      try {
        const res = await getYardList();
        setYards(res);
      } catch (err) {
        console.error("Failed to fetch yards:", err);
      }
    };
    fetchYards();
  }, []);

  const superTip1 = {
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
  };

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24">
      <h1 className="text-2xl font-bold mb-6 text-center">Super Tips</h1>
      {superTip1 && (
        <CustomAccordion title={superTip1.title} content={superTip1.content} />
      )}

      <div className="space-y-4 mt-4">
        {/* Map all yards */}
        {yards.length > 0 ? (
          yards.map((yard) => (
            <SuperTipsYardAccordion key={yard.id} yard={yard} />
          ))
        ) : (
          <p>Loading yards...</p>
        )}
      </div>
    </div>
  );
}
