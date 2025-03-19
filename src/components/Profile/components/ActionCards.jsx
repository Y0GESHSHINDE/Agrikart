import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTools, FaHandshake, FaMoneyBillWave, FaFileContract, FaStar, FaArrowRight } from 'react-icons/fa';

const ActionCards = () => {
  // No changes to the data as per requirements
  const actionCards = [
    {
      title: "Manage Instruments",
      desc: "Manage your all instruments",
      link: "/manage-instruments",
      icon: <FaTools className="text-2xl text-green-600" />
    },
    {
      title: "Instrument Rented",
      desc: "You have rented 3 instruments.",
      link: "/rented-instruments",
      icon: <FaHandshake className="text-2xl text-green-600" />
    },
    {
      title: "Money Earned",
      desc: "Total: $1500",
      link: "/money-earned",
      icon: <FaMoneyBillWave className="text-2xl text-green-600" />
    },
    {
      title: "Contracts",
      desc: "Active Contracts: 5",
      link: "#",
      icon: <FaFileContract className="text-2xl text-green-600" />
    },
    {
      title: "History & Rating",
      desc: "Rating: 4.5",
      link: "/history-ratings",
      icon: <FaStar className="text-2xl text-green-600" />
    }
  ];

  const notify = (message) => toast.success(message, {
    position: "top-right",
    autoClose: 2000
  });

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {actionCards.map((card, index) => (
        <div
          key={index}
          className="group transform overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"
        >
          <div className="flex h-full flex-col">
            <div className="mb-3 flex items-center gap-3">
              <span className="text-2xl">{card.icon}</span>
              <h2 className="text-lg font-semibold text-green-700">
                {card.title}
              </h2>
            </div>
            
            <p className="mb-4 flex-grow text-gray-600">
              {card.desc}
            </p>
            
            <Link
              to={card.link}
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-5 py-2 text-white transition-all duration-300 hover:bg-green-700 hover:shadow-md group-hover:translate-x-1"
              onClick={() => notify(`${card.title} opened`)}
            >
              View Details
              <FaArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActionCards;