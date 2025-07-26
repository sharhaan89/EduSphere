"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBook,
  FaUsers,
  FaBriefcase,
  FaProjectDiagram,
  FaComments,
  FaUniversity,
  FaChevronRight,
  FaArrowRight,
  FaStar,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaLightbulb,
  FaRocket,
  FaEnvelope,
} from "react-icons/fa";

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [stats, setStats] = useState({
    users: 0,
    discussions: 0,
    resources: 0,
    communities: 0,
  });

  // Animate stats counting up
  useEffect(() => {
    setIsVisible(true);

    const targetStats = {
      users: 5000,
      discussions: 12500,
      resources: 3200,
      communities: 48,
    };
    const duration = 2000; // 2 seconds
    const frameRate = 60;
    const totalFrames = duration / (1000 / frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;

      if (frame <= totalFrames) {
        setStats({
          users: Math.floor(targetStats.users * progress),
          discussions: Math.floor(targetStats.discussions * progress),
          resources: Math.floor(targetStats.resources * progress),
          communities: Math.floor(targetStats.communities * progress),
        });
      } else {
        clearInterval(timer);
      }
    }, 1000 / frameRate);

    return () => clearInterval(timer);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Featured categories
  const categories = [
    {
      name: "Academics",
      icon: <FaBook />,
      color: "from-blue-500 to-indigo-600",
      path: "/forum/academics/all",
      description: "Course discussions, study materials, and exam preparation",
    },
    {
      name: "Internships",
      icon: <FaBriefcase />,
      color: "from-emerald-500 to-green-600",
      path: "/forum/internships/all",
      description: "Opportunities, interview experiences, and career advice",
    },
    {
      name: "Projects",
      icon: <FaProjectDiagram />,
      color: "from-amber-500 to-orange-600",
      path: "/forum/projects/all",
      description: "Collaborate on projects and share research ideas",
    },
    {
      name: "Campus Life",
      icon: <FaUniversity />,
      color: "from-rose-500 to-pink-600",
      path: "/forum/campus/all",
      description: "Events, hostel life, and campus activities",
    },
  ];

  // Features
  const features = [
    {
      title: "Collaborative Learning",
      icon: <FaUsers />,
      description: "Connect with peers to solve problems and share knowledge",
    },
    {
      title: "Expert Guidance",
      icon: <FaChalkboardTeacher />,
      description: "Get advice from seniors and faculty members",
    },
    {
      title: "Resource Library",
      icon: <FaBook />,
      description: "Access study materials, notes, and past papers",
    },
    {
      title: "Skill Development",
      icon: <FaLightbulb />,
      description: "Enhance your skills through workshops and discussions",
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Elon Musk",
      role: "Computer Science, 2nd Year",
      quote:
        "EduSphere has been a game-changer for my academic journey. The discussions and resources helped me secure an internship at Google!",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Bill Gates",
      role: "Electrical Engineering, 3rd Year",
      quote:
        "The community here is incredibly supportive. I found my project team through EduSphere and we went on to win the national hackathon!",
      avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    },
    {
      name: "Mark Zuckerberg",
      role: "Mechanical Engineering, 2nd Year",
      quote:
        "As a sophomore, I was struggling with advanced courses until I found the study groups on EduSphere. Now I'm among the top performers in my class.",
      avatar: "https://randomuser.me/api/portraits/men/68.jpg",
    },
  ];

  // Upcoming events
  const events = [
    {
      title: "IEEE Technical Workshop on AI",
      date: "March 20, 2025",
      location: "Online",
    },
    {
      title: "WEC Hackathon UNIDAO",
      date: "March 25, 2025",
      location: "LHC-C",
    },
    {
      title: "Hackathon: Build for Future",
      date: "March 31, 2023",
      location: "CIDS",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-20 w-80 h-80 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-24 sm:pb-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              <span className="block text-gray-900 dark:text-white font-serif pb-1">
                Welcome to
              </span>
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-serif leading-[1.1]">
                EduSphere
              </span>
            </h1>

            <p className="mt-6 max-w-6xl mx-auto text-xl text-gray-600 dark:text-gray-300 font-serif leading-relaxed">
EduSphere is a student-focused community forum built for meaningful discussions across academics, internships, and campus life. It offers categorized subforums, threads with replies, upvoting/downvoting, content and user reporting, live chat rooms, and a gamified leaderboard system — all designed to encourage active participation and collaborative engagement.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                to="/forum"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Explore Forum
                <FaChevronRight className="ml-2 -mr-1 h-4 w-4" />
              </Link>
              <Link
                to="/user/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        {/* <div className="relative">
          <svg
            className="w-full h-24 sm:h-32 fill-current text-white dark:text-gray-800"
            viewBox="0 0 1440 72"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,0 C240,40 480,60 720,60 C960,60 1200,40 1440,0 L1440,72 L0,72 Z" />
          </svg>
        </div> */}
      </div>

      {/* Stats Section */}
      {/* <div className="bg-white dark:bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div
              className={`transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              } transition-all duration-700 delay-100`}
            >
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                  {stats.users.toLocaleString()}+
                </div>
                <div className="mt-2 text-sm sm:text-base font-medium text-gray-600 dark:text-gray-300">
                  Active Users
                </div>
              </div>
            </div>
            <div
              className={`transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              } transition-all duration-700 delay-200`}
            >
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                  {stats.discussions.toLocaleString()}+
                </div>
                <div className="mt-2 text-sm sm:text-base font-medium text-gray-600 dark:text-gray-300">
                  Discussions
                </div>
              </div>
            </div>
            <div
              className={`transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              } transition-all duration-700 delay-300`}
            >
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                  {stats.resources.toLocaleString()}+
                </div>
                <div className="mt-2 text-sm sm:text-base font-medium text-gray-600 dark:text-gray-300">
                  Resources
                </div>
              </div>
            </div>
            <div
              className={`transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              } transition-all duration-700 delay-400`}
            >
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                  {stats.communities}
                </div>
                <div className="mt-2 text-sm sm:text-base font-medium text-gray-600 dark:text-gray-300">
                  Communities
                </div>
              </div>
            </div>
          </div>
        </div> 
      </div> */}

      {/* Featured Categories */}
      <div className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Explore Popular Categories
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              Join discussions in your areas of interest and connect with
              like-minded peers
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={category.path}
                className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>
                <div className="relative p-6 flex flex-col items-center text-center h-full">
                  <div
                    className={`p-3 rounded-full bg-gradient-to-br ${category.color} text-white text-2xl`}
                  >
                    {category.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white group-hover:text-white transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 group-hover:text-white transition-colors duration-300">
                    {category.description}
                  </p>
                  <div className="mt-auto pt-4">
                    <span className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors duration-300">
                      Explore
                      <FaArrowRight className="ml-1 h-3 w-3 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/forum"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800 transition-colors duration-300"
            >
              View All Categories
              <FaChevronRight className="ml-2 -mr-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      {/* <div className="py-16 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to succeed
            </p>
            <p className="mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300 lg:mx-auto">
              EduSphere provides all the tools and resources you need for
              academic excellence and career growth
            </p>
          </div>

          <div className="mt-16">
            <div className="grid gap-8 md:grid-cols-2">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`relative bg-gray-50 dark:bg-gray-700 rounded-xl p-6 shadow-md transform hover:-translate-y-1 transition-all duration-300 hover:shadow-lg ${
                    isVisible
                      ? "translate-x-0 opacity-100"
                      : index % 2 === 0
                      ? "-translate-x-10 opacity-0"
                      : "translate-x-10 opacity-0"
                  } transition-all duration-700 delay-${(index + 1) * 100}`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div> */}

      {/* Call to Action */}
        <div className="relative py-16 bg-white dark:bg-gray-800 flex items-center justify-center min-h-[400px]">
        {/* 
        <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <div className="h-full w-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-10 dark:opacity-20"></div>
        </div>
        */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                <span className="block">Ready to elevate your</span>
                <span className="block text-indigo-600 dark:text-indigo-400">
                academic journey?
                </span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Join students who are already part of our community.
                Share knowledge, collaborate on projects, and build connections
                that last beyond graduation.
            </p>
            <div className="mt-8 flex justify-center">
                <Link
                to="/user/register"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
                >
                Sign Up Now
                <FaRocket className="ml-2 -mr-1 h-4 w-4" />
                </Link>
            </div>
            </div>
        </div>
        </div>

      {/* Newsletter */}
      {/* 
      <div className="bg-indigo-700 dark:bg-indigo-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center">
          <div className="lg:w-0 lg:flex-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Stay updated with EduSphere
            </h2>
            <p className="mt-3 max-w-3xl text-lg text-indigo-100">
              Get the latest news, events, and resources delivered straight to
              your inbox.
            </p>
          </div>
          <div className="mt-8 lg:mt-0 lg:ml-8">
            <form className="sm:flex">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-5 py-3 border border-transparent placeholder-gray-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white focus:border-white sm:max-w-xs rounded-md"
                required
              />
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white"
                >
                  <FaEnvelope className="mr-2 h-4 w-4" />
                  Subscribe
                </button>
              </div>
            </form>
            <p className="mt-3 text-sm text-indigo-100">
              We care about your data. Read our{" "}
              <Link to="/privacy" className="text-white font-medium underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
      */}

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
