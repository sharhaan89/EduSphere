import React from "react";

const teamMembers = [
  {
    name: "SK Sharhaan Naim",
    role: "Project Lead & Developer",
    image: "https://ui-avatars.com/api/?name=SK+Sharhaan+Naim&background=random&color=fff&size=128",
    description: "Lead developer and visionary behind EduSphere, specializing in full-stack development."
  },
  {
    name: "Raazdeep Roy",
    role: "Backend Developer",
    image: "https://ui-avatars.com/api/?name=Raazdeep+Roy&background=random&color=fff&size=128",
    description: "Handles database architecture, authentication, and API development."
  },
  {
    name: "Ashutosh Kumar",
    role: "Designer & Marketing",
    image: "https://ui-avatars.com/api/?name=Ashutosh+Kumar&background=random&color=fff&size=128",
    description: "Designs visuals and spreads the word about EduSphere."
  },
  {
    name: "Aman Kumar Singh",
    role: "Frontend Developer",
    image: "https://ui-avatars.com/api/?name=Aman+Kumar+Singh&background=random&color=fff&size=128",
    description: "Works on debugging, testing, security and report system."
  }
];

const TeamPage = () => {
  return (
    <div className="bg-gray-900 text-white py-12 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">Meet Our Team</h2>
        <p className="text-lg mb-10">Passionate individuals dedicated to building EduSphere.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6 shadow-lg text-center">
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 mx-auto rounded-full border-4 border-gray-700 mb-4"
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-sm text-gray-400">{member.role}</p>
              <p className="mt-2 text-gray-300">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
