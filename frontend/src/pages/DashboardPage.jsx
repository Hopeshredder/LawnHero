import { useState, useEffect } from "react";
import { getYardList } from "../Api";
import Button from "@mui/material/Button";
import NewYardModal from "../components/NewYardModal";

export default function Dashboard() {
  const [yards, setYards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);

  const fetchYards = async () => {
    try {
      const data = await getYardList();
      console.log("Yard API response:", data);
      setYards(data || []);
      console.log(data);
    } catch (err) {
      setError("Failed to fetch yards");
      setYards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYards();
  }, []);

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 flex flex-col items-center justify-start min-h-screen">
      <h1>Yards</h1>

      {loading && <p>Loading yards...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="border border-gray-300 rounded-lg p-4 w-full flex flex-col items-center justify-center">
        <ul className="pb-8 flex flex-col justify-center items-center">
          {yards.length > 0 ? (
            yards.map((yard) => <li key={yard.id}>{yard.yard_name}</li>) 
          ) : (
            <p>{error || "No yards found."}</p>
          )}
        </ul>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#a14525",
            "&:hover": { backgroundColor: "#c65b3b" },
            maxWidth: "45%",
            mt: 2,
          }}
          onClick={() => setModalOpen(true)}
        >
          New Yard
        </Button>
      </div>
      <NewYardModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onYardCreated={fetchYards}
      />
    </div>
  );
}
