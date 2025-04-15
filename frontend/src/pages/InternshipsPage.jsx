"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

export default function InternshipsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCompanies, setFilteredCompanies] = useState([])
  
  const companies = [
    {
      id: "google",
      name: "Google",
      slug: "Internships-Google",
      logo: "G",
      description: "Software Engineering, UX Design, and Research internships at Google",
      tags: ["Software", "AI/ML", "UX", "Cloud"],
      color: "bg-blue-500",
      accentColor: "group-hover:border-blue-500"
    },
    {
      id: "microsoft",
      name: "Microsoft",
      slug: "Internships-Microsoft",
      logo: "M",
      description: "Diverse technical and non-technical roles across Microsoft's product teams",
      tags: ["Software", "Cloud", "Data Science"],
      color: "bg-blue-600",
      accentColor: "group-hover:border-blue-600"
    },
    {
      id: "amazon",
      name: "Amazon",
      slug: "Internships-Amazon",
      logo: "A",
      description: "SDE internships, Product Management, and Operations at Amazon",
      tags: ["Software", "Cloud", "Business"],
      color: "bg-orange-500",
      accentColor: "group-hover:border-orange-500"
    },
    {
      id: "meta",
      name: "Meta",
      slug: "Internships-Meta",
      logo: "M",
      description: "Software Engineering, Data Science, and Research internships at Meta",
      tags: ["Software", "AI/ML", "AR/VR"],
      color: "bg-blue-400",
      accentColor: "group-hover:border-blue-400"
    },
    {
      id: "sprinklr",
      name: "Sprinklr",
      slug: "Internships-Sprinklr",
      logo: "S",
      description: "Engineering and Product Development internships at Sprinklr",
      tags: ["Software", "CRM", "SaaS"],
      color: "bg-red-500",
      accentColor: "group-hover:border-red-500"
    },
    {
      id: "deshaw",
      name: "DE Shaw",
      slug: "Internships-DEShaw",
      logo: "DS",
      description: "Software Development and Quantitative Research internships at DE Shaw",
      tags: ["Finance", "Quant", "Software"],
      color: "bg-green-600",
      accentColor: "group-hover:border-green-600"
    },
    {
      id: "goldman",
      name: "Goldman Sachs",
      slug: "Internships-GoldmanSachs",
      logo: "GS",
      description: "Technology, Finance, and Operations internships at Goldman Sachs",
      tags: ["Finance", "Software", "Business"],
      color: "bg-blue-900",
      accentColor: "group-hover:border-blue-900"
    },
    {
      id: "qualcomm",
      name: "Qualcomm",
      slug: "Internships-Qualcomm",
      logo: "Q",
      description: "Hardware and Software Engineering internships at Qualcomm",
      tags: ["Hardware", "Software", "Semiconductors"],
      color: "bg-red-600",
      accentColor: "group-hover:border-red-600"
    },
    {
      id: "nvidia",
      name: "NVIDIA",
      slug: "Internships-NVIDIA",
      logo: "N",
      description: "GPU Architecture, AI Research, and Software Engineering internships at NVIDIA",
      tags: ["Hardware", "AI/ML", "Graphics"],
      color: "bg-green-500",
      accentColor: "group-hover:border-green-500"
    },
    {
      id: "jpmorgan",
      name: "JP Morgan",
      slug: "Internships-JPMorgan",
      logo: "JP",
      description: "Software Engineering, Financial Analysis, and Risk Management internships",
      tags: ["Finance", "Software", "Business"],
      color: "bg-blue-700",
      accentColor: "group-hover:border-blue-700"
    },
    {
      id: "intuit",
      name: "Intuit",
      slug: "Internships-Intuit",
      logo: "I",
      description: "Software Engineering, Product Design, and Data Science internships at Intuit",
      tags: ["Software", "Design", "Fintech"],
      color: "bg-blue-500",
      accentColor: "group-hover:border-blue-500"
    },
    {
      id: "adobe",
      name: "Adobe",
      slug: "Internships-Adobe",
      logo: "A",
      description: "Software Development, UX Design, and Research internships at Adobe",
      tags: ["Software", "Design", "AI/ML"],
      color: "bg-red-600",
      accentColor: "group-hover:border-red-600"
    }
  ]

  useEffect(() => {
    setFilteredCompanies(
      searchTerm 
        ? companies.filter(company => 
            company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
            company.description.toLowerCase().includes(searchTerm.toLowerCase()))
        : companies
    )
  }, [searchTerm])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="relative bg-indigo-700 dark:bg-indigo-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Internship Opportunities
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              Connect with leading companies that recruit from NITK Surathkal for internships and career opportunities.
            </p>
          </div>
        </div>
        
        {/* Bottom Curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60">
            <path 
              fill="currentColor" 
              d="M0,0L80,5.3C160,11,320,21,480,26.7C640,32,800,32,960,26.7C1120,21,1280,11,1360,5.3L1440,0L1440,60L1360,60C1280,60,1120,60,960,60C800,60,640,60,480,60C320,60,160,60,80,60L0,60Z"
              className="fill-gray-50 dark:fill-gray-900"
            ></path>
          </svg>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Search & Filter Section */}
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Browse Companies
          </h2>
          
          <div className="flex flex-wrap justify-center gap-2">
            {["All", "Software", "AI/ML", "Hardware", "Finance", "Cloud", "Design"].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchTerm(tag === "All" ? "" : tag)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  (tag === "All" && searchTerm === "") || 
                  (tag !== "All" && searchTerm.toLowerCase() === tag.toLowerCase())
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Company Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Link 
              to={`/forum/${company.slug}/all`} 
              key={company.id}
              className="group"
            >
              <div className="h-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group-hover:border-indigo-500">
                {/* Company Logo */}
                <div className="p-6 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-md ${company.color} flex items-center justify-center text-white text-xl font-bold shadow-md`}>
                    {company.logo}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{company.name}</h3>
                </div>
                
                <div className="px-6 pb-6 flex-1">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{company.description}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {company.tags.map(tag => (
                      <span 
                        key={`${company.id}-${tag}`}
                        className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">NITK Recruiter</span>
                    <div className="group-hover:translate-x-1 transition-transform duration-200 flex items-center text-indigo-600 dark:text-indigo-400">
                      <span className="text-sm font-medium mr-1">View discussions</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">No results found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search terms or filters.</p>
            <button 
              onClick={() => setSearchTerm("")}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Clear search
            </button>
          </div>
        )}
        
        {/* Footer Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            This page shows companies that frequently recruit from NITK Surathkal.
            <br />
            Join the discussion forums to connect with students who have interned at these companies.
          </p>
        </div>
      </div>
    </div>
  )
}