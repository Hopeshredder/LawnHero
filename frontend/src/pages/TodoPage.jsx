import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../Api";

export default function Todo() {

  // const [tasks, setTasks] = useState([]); // list of tasks

  // // Pagination state
  // const [offset, setOffset] = useState(0); // for API pagination
  // const [hasMore, setHasMore] = useState(true); // track if more tasks are available
  // const PAGE_SIZE = 10; // number of tasks per API call

  useEffect(() => {
    fetchTasks(true);
  }, []);

  // Fetch workouts helper. Need to build this once api and backend set up to do so.
  const fetchTasks = async (reset = false) => {
    console.log('Tasks fetched!') 
  }

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24">
      <h1>
        TODO PAGE On render need to pull activity log (paginated to?) and
        schedule (paginated to?) to display in chronological order with dates.
        Center screen on break between activity/past and schedule/future.
      </h1>
    </div>
  );
}
