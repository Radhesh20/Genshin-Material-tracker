import React, { useState, useMemo } from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import Footer from './components/Footer';

interface Material {
  id: string;
  name: string;
  needed: number;
  collected: number;
}

function App() {
  const [materials, setMaterials] = useLocalStorage<Material[]>('genshin-materials', []);
  const [newMaterial, setNewMaterial] = useState({ name: '', needed: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [editingMaterial, setEditingMaterial] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ collected: number; needed: number }>({ collected: 0, needed: 0 });

  // Calculate items per page based on screen size
  const itemsPerPage = 6; // 2 rows of 3 items each for optimal viewing

  // Pagination logic
  const totalPages = Math.ceil(materials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMaterials = materials.slice(startIndex, endIndex);

  // Reset to first page if current page becomes invalid
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const addMaterial = () => {
    if (newMaterial.name.trim() && newMaterial.needed > 0) {
      const material: Material = {
        id: Date.now().toString(),
        name: newMaterial.name.trim(),
        needed: newMaterial.needed,
        collected: 0
      };
      setMaterials([...materials, material]);
      setNewMaterial({ name: '', needed: 0 });
      
      // Navigate to the page where the new material will appear
      const newTotalPages = Math.ceil((materials.length + 1) / itemsPerPage);
      setCurrentPage(newTotalPages);
    }
  };

  const incrementMaterial = (id: string, amount: number) => {
    setMaterials(materials.map(material => 
      material.id === id 
        ? { ...material, collected: Math.min(material.collected + amount, material.needed) }
        : material
    ));
  };

  const decrementMaterial = (id: string, amount: number) => {
    setMaterials(materials.map(material => 
      material.id === id 
        ? { ...material, collected: Math.max(material.collected - amount, 0) }
        : material
    ));
  };

  const startEditing = (material: Material) => {
    setEditingMaterial(material.id);
    setEditValues({ collected: material.collected, needed: material.needed });
  };

  const saveEdit = (id: string) => {
    setMaterials(materials.map(material => 
      material.id === id 
        ? { 
            ...material, 
            collected: Math.max(0, Math.min(editValues.collected, editValues.needed)),
            needed: Math.max(1, editValues.needed)
          }
        : material
    ));
    setEditingMaterial(null);
  };

  const cancelEdit = () => {
    setEditingMaterial(null);
  };
  const deleteMaterial = (id: string) => {
    setMaterials(materials.filter(material => material.id !== id));
  };

  const getProgressPercentage = (collected: number, needed: number) => {
    return Math.min((collected / needed) * 100, 100);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-3">
            MATERIAL TRACKER
          </h1>
          <p className="text-lg text-gray-300 font-light">
            Genshin Impact Collection Manager
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Add Material Form */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 text-center text-cyan-300">
              Add New Material
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Material name..."
                value={newMaterial.name}
                onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                className="flex-1 px-4 py-2.5 bg-black/30 border border-cyan-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
              />
              <input
                type="number"
                placeholder="Amount needed"
                value={newMaterial.needed || ''}
                onChange={(e) => setNewMaterial({ ...newMaterial, needed: parseInt(e.target.value) || 0 })}
                className="w-full sm:w-36 px-4 py-2.5 bg-black/30 border border-cyan-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
              />
              <button
                onClick={addMaterial}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-semibold hover:from-cyan-400 hover:to-purple-400 transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/25"
              >
                <Plus size={18} />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Materials Grid - Fixed Height Container */}
        <div className="flex-1 flex flex-col min-h-0">
          {materials.length > 0 ? (
            <>
              {/* Materials Grid */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-6xl mx-auto w-full">
                {currentMaterials.map((material) => {
                  const progress = getProgressPercentage(material.collected, material.needed);
                  const isComplete = material.collected >= material.needed;
                  
                  return (
                    <div
                      key={material.id}
                      className={`backdrop-blur-md bg-white/5 border rounded-2xl p-5 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 hover:scale-105 ${
                        isComplete 
                          ? 'border-green-500/50 bg-green-500/5' 
                          : 'border-white/10'
                      }`}
                    >
                      {/* Material Header */}
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-cyan-300 truncate pr-2">
                          {material.name}
                        </h3>
                        <button
                          onClick={() => deleteMaterial(material.id)}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Progress Info or Edit Mode */}
                      {editingMaterial === material.id ? (
                        <div className="mb-3">
                          <div className="space-y-3">
                            <div>
                              <label className="text-gray-300 text-sm block mb-1">Collected</label>
                              <input
                                type="number"
                                value={editValues.collected}
                                onChange={(e) => setEditValues({ ...editValues, collected: parseInt(e.target.value) || 0 })}
                                className="w-full px-3 py-2 bg-black/30 border border-cyan-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
                                min="0"
                                max={editValues.needed}
                              />
                            </div>
                            <div>
                              <label className="text-gray-300 text-sm block mb-1">Needed</label>
                              <input
                                type="number"
                                value={editValues.needed}
                                onChange={(e) => setEditValues({ ...editValues, needed: parseInt(e.target.value) || 1 })}
                                className="w-full px-3 py-2 bg-black/30 border border-cyan-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
                                min="1"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => saveEdit(material.id)}
                              className="flex-1 py-2 bg-gradient-to-r from-green-600 to-green-500 rounded-lg font-semibold hover:from-green-500 hover:to-green-400 transition-all duration-200 text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="flex-1 py-2 bg-gradient-to-r from-gray-600 to-gray-500 rounded-lg font-semibold hover:from-gray-500 hover:to-gray-400 transition-all duration-200 text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-300 text-sm">Progress</span>
                            <button
                              onClick={() => startEditing(material)}
                              className="font-bold text-sm hover:text-cyan-300 transition-colors cursor-pointer"
                              title="Click to edit"
                            >
                              <span className={isComplete ? 'text-green-400' : 'text-white'}>
                                {material.collected} / {material.needed}
                              </span>
                            </button>
                          </div>
                        
                          {/* Progress Bar */}
                          <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 rounded-full ${
                                isComplete 
                                  ? 'bg-gradient-to-r from-green-400 to-green-500' 
                                  : 'bg-gradient-to-r from-cyan-400 to-purple-500'
                              }`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        
                          <div className="text-right mt-1">
                            <span className={`text-xs ${isComplete ? 'text-green-400' : 'text-gray-400'}`}>
                              {progress.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons - Only show if not editing */}
                      {editingMaterial !== material.id && (
                        <div className="space-y-2">
                          {/* Increment Buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => incrementMaterial(material.id, 1)}
                              disabled={material.collected >= material.needed}
                              className="flex-1 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-lg font-semibold hover:from-cyan-500 hover:to-cyan-400 disabled:from-gray-600 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:scale-100 text-sm"
                            >
                              +1
                            </button>
                            <button
                              onClick={() => incrementMaterial(material.id, 5)}
                              disabled={material.collected >= material.needed}
                              className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg font-semibold hover:from-purple-500 hover:to-purple-400 disabled:from-gray-600 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:scale-100 text-sm"
                            >
                              +5
                            </button>
                          </div>
                          
                          {/* Decrement Buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => decrementMaterial(material.id, 1)}
                              disabled={material.collected <= 0}
                              className="flex-1 py-2 bg-gradient-to-r from-red-600 to-red-500 rounded-lg font-semibold hover:from-red-500 hover:to-red-400 disabled:from-gray-600 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:scale-100 text-sm"
                            >
                              -1
                            </button>
                            <button
                              onClick={() => decrementMaterial(material.id, 5)}
                              disabled={material.collected <= 0}
                              className="flex-1 py-2 bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg font-semibold hover:from-orange-500 hover:to-orange-400 disabled:from-gray-600 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:scale-100 text-sm"
                            >
                              -5
                            </button>
                          </div>
                        </div>
                      )}

                      {isComplete && (
                        <div className="mt-3 text-center">
                          <span className="inline-block px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full text-xs font-medium border border-green-500/30">
                            ✨ Complete!
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:scale-100"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => goToPage(pageNumber)}
                          className={`w-10 h-10 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${
                            currentPage === pageNumber
                              ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                              : 'bg-white/10 border border-white/20 hover:bg-white/20'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:scale-100"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}

              {/* Page Info */}
              {totalPages > 1 && (
                <div className="text-center mt-3">
                  <span className="text-sm text-gray-400">
                    Page {currentPage} of {totalPages} • {materials.length} total materials
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                  <Plus size={36} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-3">
                  No Materials Added Yet
                </h3>
                <p className="text-gray-500 max-w-md mx-auto text-sm">
                  Start by adding your first material to track your collection progress for Genshin Impact
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;