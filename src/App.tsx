import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Material {
  id: string;
  name: string;
  needed: number;
  collected: number;
}

function App() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [newMaterial, setNewMaterial] = useState({ name: '', needed: 0 });

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
    }
  };

  const incrementMaterial = (id: string, amount: number) => {
    setMaterials(materials.map(material => 
      material.id === id 
        ? { ...material, collected: Math.min(material.collected + amount, material.needed) }
        : material
    ));
  };

  const deleteMaterial = (id: string) => {
    setMaterials(materials.filter(material => material.id !== id));
  };

  const getProgressPercentage = (collected: number, needed: number) => {
    return Math.min((collected / needed) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            MATERIAL TRACKER
          </h1>
          <p className="text-xl text-gray-300 font-light">
            Genshin Impact Collection Manager
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Add Material Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold mb-6 text-center text-cyan-300">
              Add New Material
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Material name..."
                value={newMaterial.name}
                onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                className="flex-1 px-4 py-3 bg-black/30 border border-cyan-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
              />
              <input
                type="number"
                placeholder="Amount needed"
                value={newMaterial.needed || ''}
                onChange={(e) => setNewMaterial({ ...newMaterial, needed: parseInt(e.target.value) || 0 })}
                className="w-full sm:w-40 px-4 py-3 bg-black/30 border border-cyan-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
              />
              <button
                onClick={addMaterial}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-semibold hover:from-cyan-400 hover:to-purple-400 transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/25"
              >
                <Plus size={20} />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Materials Grid */}
        {materials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {materials.map((material) => {
              const progress = getProgressPercentage(material.collected, material.needed);
              const isComplete = material.collected >= material.needed;
              
              return (
                <div
                  key={material.id}
                  className={`backdrop-blur-md bg-white/5 border rounded-2xl p-6 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 hover:scale-105 ${
                    isComplete 
                      ? 'border-green-500/50 bg-green-500/5' 
                      : 'border-white/10'
                  }`}
                >
                  {/* Material Header */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-cyan-300 truncate pr-2">
                      {material.name}
                    </h3>
                    <button
                      onClick={() => deleteMaterial(material.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Progress Info */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Progress</span>
                      <span className={`font-bold ${isComplete ? 'text-green-400' : 'text-white'}`}>
                        {material.collected} / {material.needed}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
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
                      <span className={`text-sm ${isComplete ? 'text-green-400' : 'text-gray-400'}`}>
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => incrementMaterial(material.id, 1)}
                      disabled={material.collected >= material.needed}
                      className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-xl font-semibold hover:from-cyan-500 hover:to-cyan-400 disabled:from-gray-600 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:scale-100"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => incrementMaterial(material.id, 5)}
                      disabled={material.collected >= material.needed}
                      className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl font-semibold hover:from-purple-500 hover:to-purple-400 disabled:from-gray-600 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:scale-100"
                    >
                      +5
                    </button>
                  </div>

                  {isComplete && (
                    <div className="mt-4 text-center">
                      <span className="inline-block px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
                        ✨ Complete!
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
              <Plus size={48} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-300 mb-4">
              No Materials Added Yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Start by adding your first material to track your collection progress for Genshin Impact
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;