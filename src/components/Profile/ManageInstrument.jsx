import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "@clerk/clerk-react";
import {
  HiChevronRight,
  HiViewList,
  HiViewGrid,
  HiPlus,
  HiSearch,
  HiX,
  HiOutlineArchive,
  HiChevronDown,
} from "react-icons/hi";
import AddInstrument from "./AddInstrument";
import EquipmentCard from "./EquipmentCard";

const ManageInstrument = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const userId = user.id;

  // View state
  const [viewMode, setViewMode] = useState("grid");
  const [isAddingEquipment, setIsAddingEquipment] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [instruments, setInstruments] = useState([]);

  // Fetch instruments from API
  const fetchInstruments = async () => {
    try {
      const response = await fetch(
        `https://main-backend-agrikart.vercel.app/api/equipment/owner/${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch instruments");
      }
      const result = await response.json();

      // Ensure the response contains a valid data array
      if (result.success && Array.isArray(result.data)) {
        setInstruments(result.data);
      } else {
        console.error("API response is not an array:", result);
        setInstruments([]); // Fallback to an empty array
      }
    } catch (error) {
      console.error("Error fetching instruments:", error);
      toast.error("Failed to fetch instruments");
      setInstruments([]); // Fallback to an empty array
    }
  };

  // Fetch instruments on component mount
  useEffect(() => {
    fetchInstruments();
  }, []);

  // Handle delete
  const handleDelete = (id) => {
    setInstruments(instruments.filter((instrument) => instrument._id !== id));
    toast.error("Equipment removed!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  // Handle edit
  const handleEdit = (instrument) => {
    setEditingEquipment(instrument);
    setIsAddingEquipment(true);
  };

  // Handle add or update instrument
  const handleAddOrUpdateInstrument = async (data, isEditing) => {
    if (isEditing) {
      try {
        // Make a PATCH request to update the equipment
        const response = await fetch(
          `https://main-backend-agrikart.vercel.app/api/equipment/${editingEquipment._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data), // Send updated fields
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update equipment");
        }

        const updatedEquipment = await response.json();

        // Update the state with the updated equipment
        setInstruments(
          instruments.map((item) =>
            item._id === editingEquipment._id ? updatedEquipment : item
          )
        );

        toast.success("Equipment updated successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
      } catch (error) {
        console.error("Error updating equipment:", error);
        toast.error("Failed to update equipment");
      }
    } else {
      // Add new equipment locally (or make a POST request if needed)
      setInstruments([...instruments, { _id: Date.now(), ...data }]);
      toast.success("Equipment added successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    }

    setEditingEquipment(null);
    setIsAddingEquipment(false);
  };

  // Filter instruments
  const filteredInstruments = useCallback(() => {
    if (!Array.isArray(instruments)) return []; // Ensure instruments is an array
    return instruments.filter((instrument) => {
      const matchesSearch =
        instrument.equipmentName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        instrument.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instrument.model.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        filterType === "all" || instrument.equipmentType === filterType;
      return matchesSearch && matchesType;
    });
  }, [instruments, searchQuery, filterType]);

  // Toggle form visibility
  const toggleAddEquipment = () => {
    setIsAddingEquipment(!isAddingEquipment);
    if (isAddingEquipment) {
      setEditingEquipment(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex-1">
              <nav className="flex flex-wrap" aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center space-x-2">
                  <li>
                    <div className="flex items-center">
                      <button
                        onClick={() => navigate("/profile")}
                        className="cursor-pointer text-base font-medium text-gray-500 transition-colors duration-200 hover:text-green-600">
                        Dashboard
                      </button>
                      <HiChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </li>
                  <li>
                    <span className="text-sm font-medium text-gray-950">
                      Manage Equipment
                    </span>
                  </li>
                </ol>
              </nav>
              <h1 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
                Equipment Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and track your agricultural equipment inventory
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className="hidden items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 sm:inline-flex">
                {viewMode === "grid" ? (
                  <HiViewList className="h-5 w-5" />
                ) : (
                  <HiViewGrid className="h-5 w-5" />
                )}
                <span className="ml-2">
                  {viewMode === "grid" ? "List View" : "Grid View"}
                </span>
              </button>
              <button
                onClick={toggleAddEquipment}
                className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                <HiPlus className="-ml-1 mr-2 h-5 w-5" />
                Add Equipment
              </button>
            </div>
          </div>
        </div>

        {isAddingEquipment && (
          <AddInstrument
            onClose={toggleAddEquipment}
            onSubmit={handleAddOrUpdateInstrument}
            editingEquipment={editingEquipment}
          />
        )}

        {/* Equipment List Section */}
        <div
          className={
            viewMode === "grid"
              ? "grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "space-y-4 mx-auto"
          }>
          {filteredInstruments().map((instrument) => (
            <EquipmentCard
              key={instrument._id}
              instrument={instrument}
              viewMode={viewMode}
              onEdit={handleEdit}
              onUpdate={(updatedInstrument) => {
                console.log("Updated instrument:", updatedInstrument);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ManageInstrument;
