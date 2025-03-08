import { Link } from "react-router-dom";
import { FaBook, FaUsers, FaBriefcase, FaProjectDiagram, FaCode, FaLaptopCode, FaComments, FaUniversity, FaShoppingCart, FaSearch } from "react-icons/fa";
import backgroundImage from '../assets/nitk2.jpg'; // Import the image

const categories = [
    { name: "Academics", path: "/forum/academics", icon: <FaBook /> },
    { name: "Club Activities", path: "/forum/clubs", icon: <FaUsers /> },
    { name: "Internships & Placements", path: "/forum/internships", icon: <FaBriefcase /> },
    { name: "Projects & Research", path: "/forum/projects", icon: <FaProjectDiagram /> },
    { name: "Coding & CP", path: "/forum/coding", icon: <FaLaptopCode /> },
    { name: "General Discussions", path: "/forum/General", icon: <FaComments /> },
    { name: "Hostel & Campus Life", path: "/forum/campus", icon: <FaUniversity /> },
    { name: "Buy & Sell", path: "/forum/marketplace", icon: <FaShoppingCart /> },
    { name: "Lost & Found", path: "/forum/lost-found", icon: <FaSearch /> },
];

export default function ForumPage() {
    return (
        <div 
            className="relative min-h-screen flex items-center justify-center bg-cover bg-center" // Apply blur directly here
            style={{ backgroundImage: `url(${backgroundImage})` }} // Use the imported image
        >

            <div className="relative max-w-4xl w-full p-6 text-white">
            <div className="flex justify-center">
    <h1 className="text-4xl font-extrabold text-center drop-shadow-lg 
                   bg-white/20 backdrop-blur-lg p-4 rounded-xl shadow-md">
        ✪ EduSphere Forums ✪
    </h1>
</div>

<br /><br /><br />

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map((category, index) => (
                        <Link 
                            key={index} 
                            to={category.path + "/all"} 
                            className="block p-6 bg-white bg-opacity-90 rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1 text-center flex flex-col items-center space-y-2"
                        >
                            <div className="text-3xl text-blue-500">{category.icon}</div>
                            <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}