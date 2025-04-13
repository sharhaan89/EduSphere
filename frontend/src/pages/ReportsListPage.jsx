"use client"

import { useState, useEffect } from "react"
import { FiSearch, FiFilter, FiFlag, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle } from "react-icons/fi"
import { useNavigate } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL;

const ReportsListPage = () => {
  const [reports, setReports] = useState([])
  const [filteredReports, setFilteredReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const navigate = useNavigate()

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${API_URL}/report`, {
          method: "GET",
          credentials: "include", // Send cookies/session info
          headers: {
            "Content-Type": "application/json"
          }
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }
  
        const data = await response.json();
        setReports(data);
        setFilteredReports(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
  
    fetchReports();
  }, []);
  

  useEffect(() => {
    // Apply filters and search
    let result = [...reports]

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((report) => report.status === statusFilter)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (report) =>
          (report.reporter_name && report.reporter_name.toLowerCase().includes(term)) ||
          (report.reportee_name && report.reportee_name.toLowerCase().includes(term)) ||
          (report.reason && report.reason.toLowerCase().includes(term)) ||
          (report.details && report.details.toLowerCase().includes(term)),
      )
    }

    setFilteredReports(result)
  }, [reports, statusFilter, searchTerm])

  const handleReportClick = (reportId) => {
    navigate(`/acp/report/${reportId}`)
  }

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/report/${reportId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update report status");
      }
  
      // Update local state
      setReports(reports.map((report) =>
        report.id === reportId ? { ...report, status: newStatus } : report
      ));
    } catch (err) {
      console.error("Error updating report status:", err);
      alert("Failed to update report status. Please try again.");
    }
  };
  

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

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Manage Reports</h2>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center">
          <FiFilter className="mr-2 h-5 w-5 text-gray-400" />
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Reports</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Report Count */}
      <p className="text-sm text-gray-500 mb-4">
        Showing {filteredReports.length} of {reports.length} reports
      </p>

      {/* Reports Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Reason
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Reporter
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Reportee
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReports.map((report) => (
              <tr
                key={report.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleReportClick(report.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{report.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.reason}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className="text-indigo-600 hover:text-indigo-900 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/user/${report.reporter_id}`)
                    }}
                  >
                    {report.reporter_name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className="text-indigo-600 hover:text-indigo-900 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/user/${report.reportee_id}`)
                    }}
                  >
                    {report.reportee_name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(report.created_at)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    {getStatusIcon(report.status)}
                    <span className="ml-1 capitalize">{report.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                    {report.status !== "resolved" && (
                      <button
                        onClick={() => handleStatusChange(report.id, "resolved")}
                        className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 rounded-md px-2 py-1 text-xs"
                      >
                        Resolve
                      </button>
                    )}
                    {report.status !== "rejected" && (
                      <button
                        onClick={() => handleStatusChange(report.id, "rejected")}
                        className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 rounded-md px-2 py-1 text-xs"
                      >
                        Reject
                      </button>
                    )}
                    {report.status !== "pending" && (
                      <button
                        onClick={() => handleStatusChange(report.id, "pending")}
                        className="text-yellow-600 hover:text-yellow-900 bg-yellow-100 hover:bg-yellow-200 rounded-md px-2 py-1 text-xs"
                      >
                        Pending
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg mt-4">
          <FiFlag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  )
}

export default ReportsListPage
