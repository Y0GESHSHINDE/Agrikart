import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import AddInstrument from "./AddInstrument";
import EquipmentCard from "./EquipmentCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  HiChevronRight,
  HiViewList,
  HiViewGrid,
  HiPlus,
  HiSearch,
  HiX,
  HiOutlineArchive,
  HiChevronDown
} from "react-icons/hi";
const ManageInstrument = () => {
  const navigate = useNavigate();
  
  // View state
  const [viewMode, setViewMode] = useState('grid');
  const [isAddingEquipment, setIsAddingEquipment] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [instruments, setInstruments] = useState([
    {
      id: 1,
      equipmentName: "Sonalika Tractor",
      equipmentType: "Vehicle",
      brand: "Sonalika",
      model: "Worldtrac 75",
      chassisNumber: "SON75WT2023",
      description: "Premium condition tractor with advanced features and AC cabin",
      rentalPerHour: 350,
      rentalPerDay: 2500,
      pickupLocation: "Baramati, Maharashtra",
      numberPlateNumber: "MH-42-AX-1234",
      images: [
        "https://images.pexels.com/photos/2226458/pexels-photo-2226458.jpeg"
      ]
    },
    {
      id: 2,
      equipmentName: "Rotavator",
      equipmentType: "Non-Vehicle",
      brand: "VST",
      model: "RT-150",
      description: "Heavy-duty rotavator for efficient soil preparation",
      rentalPerHour: 200,
      rentalPerDay: 1500,
      pickupLocation: "Pune, Maharashtra",
      images: ["https://images.pexels.com/photos/2226459/pexels-photo-2226459.jpeg"]
    },
    {
      id: 3,
      equipmentName: "Harvester Combine",
      equipmentType: "Vehicle",
      brand: "New Holland",
      model: "TC5.30",
      chassisNumber: "NH530TC2023",
      description: "Advanced harvester with grain loss monitoring system and automatic header height control",
      rentalPerHour: 800,
      rentalPerDay: 6000,
      pickupLocation: "Nashik, Maharashtra",
      numberPlateNumber: "MH-15-CD-5678",
      images: ["https://images.pexels.com/photos/2226460/pexels-photo-2226460.jpeg"]
    },
    {
      id: 4,
      equipmentName: "Seed Drill",
      equipmentType: "Non-Vehicle",
      brand: "Khedut",
      model: "SD-9",
      description: "9-row seed drill with precise seed placement and depth control",
      rentalPerHour: 150,
      rentalPerDay: 1000,
      pickupLocation: "Satara, Maharashtra",
      images: ["https://images.pexels.com/photos/2226461/pexels-photo-2226461.jpeg"]
    }
  ]);

  const handleDelete = (id) => {
    setInstruments(instruments.filter((instrument) => instrument.id !== id));
    toast.error("Equipment removed!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleEdit = (instrument) => {
    setEditingEquipment(instrument);
    setIsAddingEquipment(true);
  };

  const handleAddOrUpdateInstrument = (data, isEditing) => {
    if (isEditing) {
      setInstruments(instruments.map(item =>
        item.id === editingEquipment.id ? { ...data, id: editingEquipment.id } : item
      ));
      setEditingEquipment(null);
      toast.success("Equipment updated successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      setInstruments([...instruments, { id: Date.now(), ...data }]);
      toast.success("Equipment added successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
    setIsAddingEquipment(false);
  };

  // Filter functions
  const filteredInstruments = useCallback(() => {
    return instruments.filter(instrument => {
      const matchesSearch = instrument.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instrument.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instrument.model.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || instrument.equipmentType === filterType;
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
                        onClick={() => navigate('/profile')}
                        className="cursor-pointer text-base font-medium text-gray-500 transition-colors duration-200 hover:text-green-600"
                      >
                        Dashboard
                      </button>
                      <HiChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </li>
                  <li>
                    <span className="text-sm font-medium text-gray-950">Manage Equipment</span>
                  </li>
                </ol>
              </nav>
              <h1 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">Equipment Management</h1>
              <p className="mt-1 text-sm text-gray-500">Manage and track your agricultural equipment inventory</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="hidden items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 sm:inline-flex"
              >
                {viewMode === 'grid' ? (
                  <HiViewList className="h-5 w-5" />
                ) : (
                  <HiViewGrid className="h-5 w-5" />
                )}
                <span className="ml-2">{viewMode === 'grid' ? 'List View' : 'Grid View'}</span>
              </button>
              <button
                onClick={toggleAddEquipment}
                className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <HiPlus className="-ml-1 mr-2 h-5 w-5" />
                Add Equipment
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="overflow-hidden rounded-lg bg-white p-3 shadow transition-all hover:shadow-md sm:p-5">
              <dt className="truncate text-sm font-medium text-gray-500">Total Equipment</dt>
              <dd className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">{instruments.length}</dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white p-3 shadow transition-all hover:shadow-md sm:p-5">
              <dt className="truncate text-sm font-medium text-gray-500">Vehicles</dt>
              <dd className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">
                {instruments.filter(i => i.equipmentType === 'Vehicle').length}
              </dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white p-3 shadow transition-all hover:shadow-md sm:p-5">
              <dt className="truncate text-sm font-medium text-gray-500">Non-Vehicles</dt>
              <dd className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">
                {instruments.filter(i => i.equipmentType === 'Non-Vehicle').length}
              </dd>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Search and Filter Section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:max-w-lg">
              <label htmlFor="search" className="sr-only">Search equipment</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <HiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="Search equipment..."
                />
              </div>
            </div>
            <div className="flex w-full items-center justify-end sm:w-auto">
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-10 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:w-auto [&_optgroup]:bg-white [&_option]:bg-white"
                  style={{ position: 'relative', transform: 'none !important' }}
                >
                  <option value="all">All Types</option>
                  <option value="Vehicle">Vehicles</option>
                  <option value="Non-Vehicle">Non-Vehicles</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <HiChevronDown className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Add Equipment Form Section */}
          {isAddingEquipment && (
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Add New Equipment</h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Fill in the details to add new farming equipment
                    </p>
                  </div>
                  <button
                    onClick={toggleAddEquipment}
                    className="rounded-full bg-gray-200 p-1.5 text-gray-500 transition-all duration-200 ease-in-out hover:bg-slate-300 hover:text-gray-600 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 active:bg-green-200 active:text-gray-800 active:shadow-inner"
                    title="Close form"
                  >
                    <HiX className="h-6 w-6 transition-colors duration-200" />
                  </button>
                </div>
              </div>
              <div className="p-4 md:p-6">
                <AddInstrument
                  onAddInstrument={handleAddOrUpdateInstrument}
                  initialData={editingEquipment}
                  isEditing={!!editingEquipment}
                />
                {/* Navigation guidance */}
                <p className="mt-4 text-center text-sm text-gray-500">
                  Use the form navigation to move between steps and ensure all required fields are filled.
                </p>
              </div>
            </div>
          )}

          {/* Equipment List Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Equipment Inventory</h3>
              <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                {instruments.length} Items Listed
              </span>
            </div>

            <div className={viewMode === 'grid'
              ? 'grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'space-y-4 mx-auto'
            }>
              {filteredInstruments().map((instrument) => (
                <EquipmentCard
                  key={instrument.id}
                  instrument={instrument}
                  viewMode={viewMode}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {instruments.length === 0 && (
              <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <HiOutlineArchive className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="mb-1 text-sm font-medium text-gray-900">No Equipment Listed</h3>
                <p className="text-sm text-gray-500">
                  Get started by adding your first equipment using the form above.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ManageInstrument;
