import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL

const ReportCreatePage = () => {
  const { reportee_id, threadId, replyId } = useParams();
  const navigate = useNavigate();
  const [reportee, setReportee] = useState(null);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    const fetchReportee = async () => {
      try {
        const response = await fetch(`${API_URL}/user/${reportee_id}`);
        if (!response.ok) throw new Error("Failed to fetch reportee details");
        
        const data = await response.json();
        console.log("Fetched reportee data:", data);
        
        setReportee({ ...data }); // Force React to detect change
      } catch (error) {
        console.error("Error fetching reportee:", error);
      }
    };
  
    if (reportee_id) fetchReportee();
  }, [reportee_id]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          reportee_id,
          thread_id: threadId || null,
          reply_id: replyId || null,
          reason,
          details,
        }),
      });
      if (!response.ok) throw new Error("Failed to submit report");
      alert("Report submitted successfully!");
      navigate("/forum");
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Report User</h2>
      {reportee ? (
        <div className="mb-4 p-3 border rounded shadow-sm">
          <p><strong>Name:</strong> {reportee.name}</p>
          <p><strong>Roll Number:</strong> {reportee.roll_number}</p>
        </div>
      ) : (
        <p>Loading reportee details...</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Reason for reporting (required)"
          required
        ></textarea>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Additional details (optional)"
        ></textarea>
        <button
          type="submit"
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
};

export default ReportCreatePage;
