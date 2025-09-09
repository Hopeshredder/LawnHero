import CustomAccordion from "../components/MUIAccordion";
import { useState, useEffect } from "react";
import SuperTipsYardAccordion from "../components/SuperTipsAccordion";
import { getYardList } from "../Api";

export default function SuperTips() {
  const [yards, setYards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchYards = async () => {
      try {
        const res = await getYardList();
        setYards(res);
      } catch (err) {
        console.error("Failed to fetch yards:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchYards();
  }, []);

  const superTip1 = {
  title: "Super Tip 1: Create a Yard",
  content: (
    <>
      <p>
        Welcome to the Super Tips tool! This tool helps you set up your yard profile so that all Super Tips can be tailored specifically to your yard.
      </p>

      <p>First, provide general information about your yard using the New Yard button on your Dashboard:</p>
      <ul className="list-disc pl-6">
        <li><strong>Zip code:</strong> Enables climate and regional soil insights.</li>
        <li><strong>Soil type:</strong> Helps determine watering, fertilizing, and aeration needs.</li>
        <li><strong>Grass type:</strong> Allows tips to be specific to your turf.</li>
      </ul>

      <p>Next, provide yard preferences:</p>
      <ul className="list-disc pl-6">
        <li><strong>Watering schedule and rate:</strong> Helps optimize irrigation suggestions.</li>
        <li><strong>Mowing frequency:</strong> Ensures mowing tips fit your routine.</li>
        <li><strong>Seasonal tasks:</strong> Fertilizing, aeration, dethatching schedules can be integrated.</li>
      </ul>

      <p>
        Finally, the more accurate and up-to-date the information, the more personalized your Super Tips will be.
      </p>
    </>
  ),
};


  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 pt-6">
      <h1 className="text-2xl font-bold mb-8 text-center">Super Tips</h1>
      {superTip1 && (
        <CustomAccordion title={superTip1.title} content={superTip1.content} />
      )}

      <div className="space-y-4 mt-4">
        {loading ? (
          <p>Loading yards...</p>
        ) : yards.length > 0 ? (
          yards.map((yard) => (
            <SuperTipsYardAccordion key={yard.id} yard={yard} />
          ))
        ) : (
          <p className="text-center mt-6 text-gray-600">
            No yards created yet. Go to the Dashboard to add one.
          </p>
        )}
      </div>
    </div>
  );
}
