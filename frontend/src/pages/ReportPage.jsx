"use client"
import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { FiArrowLeft, FiUser, FiFlag, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle } from "react-icons/fi"

const API_URL = import.meta.env.VITE_API_URL;

const ReportPage = () => {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`${API_URL}/report/${id}`, {
          method: "GET",
          credentials: "include", // Include cookies for authentication
          headers: {
            "Content-Type": "application/json"
          }
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch report details");
        }
  
        const data = await response.json();
        setReport(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
  
    fetchReport();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await fetch(`${process.env.API_URL}/report/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update report status")
      }

      // Update local state
      setReport({ ...report, status: newStatus })
    } catch (err) {
      console.error("Error updating report status:", err)
      alert("Failed to update report status. Please try again.")
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FiClock className="h-5 w-5 text-yellow-500" />
      case "resolved":
        return <FiCheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <FiXCircle className="h-5 w-5 text-red-500" />
      default:
        return <FiAlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>Error: {error}</p>
        <p>Please try again later or contact support.</p>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
        <p>Report not found. It may have been deleted or you don't have permission to view it.</p>
        <button
          onClick={() => navigate("/admin/reports")}
          className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          <FiArrowLeft className="mr-2 h-4 w-4" />
          Back to Reports
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/admin/reports")}
          className="mr-4 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FiArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
        <h2 className="text-xl font-semibold text-gray-800">Report #{report.id}</h2>
      </div>

      {/* Report Status */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center">
          {getStatusIcon(report.status)}
          <span className="ml-2 text-lg font-medium capitalize">{report.status}</span>
        </div>
        <div className="flex space-x-2">
          {report.status !== "resolved" && (
            <button
              onClick={() => handleStatusChange("resolved")}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FiCheckCircle className="mr-2 h-4 w-4" />
              Resolve
            </button>
          )}
          {report.status !== "rejected" && (
            <button
              onClick={() => handleStatusChange("rejected")}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FiXCircle className="mr-2 h-4 w-4" />
              Reject
            </button>
          )}
          {report.status !== "pending" && (
            <button
              onClick={() => handleStatusChange("pending")}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <FiClock className="mr-2 h-4 w-4" />
              Mark as Pending
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Report Details */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center">
            <FiFlag className="mr-2 h-5 w-5 text-red-500" />
            Report Details
          </h3>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Reason:</p>
              <p className="font-medium">{report.reason}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Date Reported:</p>
              <p className="font-medium">{formatDate(report.created_at)}</p>
            </div>

            {report.thread_id && (
                <div>
                    <p className="text-sm text-gray-500">Thread ID:</p>
                    <Link to={`/forum/thread/${report.thread_id}`} className="font-medium text-blue-600 hover:underline">
                    #{report.thread_id}
                    </Link>
                </div>
            )}

            {report.reply_id && (
                <div>
                    <p className="text-sm text-gray-500">Reply ID:</p>
                    <Link to={`/forum/thread/${report.thread_id}`} className="font-medium text-blue-600 hover:underline">
                    #{report.reply_id}
                    </Link>
                </div>
            )}

            <div>
              <p className="text-sm text-gray-500">Details:</p>
              <p className="mt-1 p-2 bg-gray-50 rounded-md whitespace-pre-wrap">{report.details}</p>
            </div>
          </div>
        </div>

        {/* User Information */}
        <div className="space-y-4">
          {/* Reporter */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center">
              <FiUser className="mr-2 h-5 w-5 text-blue-500" />
              Reporter
            </h3>

            <div className="flex items-center">
              <div className="bg-gray-100 rounded-full p-3 mr-3">
                <FiUser className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p
                  className="font-medium text-indigo-600 hover:text-indigo-900 hover:underline cursor-pointer"
                  onClick={() => navigate(`/user/${report.reporter_id}`)}
                >
                  {report.reporter_name}
                </p>
                <p className="text-sm text-gray-500">Roll: {report.reporter_roll_number}</p>
              </div>
            </div>
          </div>

          {/* Reportee */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center">
              <FiUser className="mr-2 h-5 w-5 text-red-500" />
              Reportee
            </h3>

            <div className="flex items-center">
              <div className="bg-gray-100 rounded-full p-3 mr-3">
                <FiUser className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p
                  className="font-medium text-indigo-600 hover:text-indigo-900 hover:underline cursor-pointer"
                  onClick={() => navigate(`/user/${report.reportee_id}`)}
                >
                  {report.reportee_name}
                </p>
                <p className="text-sm text-gray-500">Roll: {report.reportee_roll_number}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportPage
