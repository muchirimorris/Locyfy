import React, { useState } from 'react';
import { X, Image as ImageIcon, MapPin, Loader2, Plus, Trash2 } from 'lucide-react';
import apiClient from '../../services/apiClient';

interface AddVenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddVenueModal: React.FC<AddVenueModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    pricePerDay: '',
    capacity: '',
  });

  const [locations, setLocations] = useState<{county: string, subCounty: string, terrain: string}[]>([]);
  const [newLocation, setNewLocation] = useState({county: 'Nairobi', subCounty: '', terrain: 'Manicured Gardens'});

  const [images, setImages] = useState<string[]>([]);
  const [newImage, setNewImage] = useState('');

  const [packages, setPackages] = useState<{name: string, description: string, price: string, features: string}[]>([]);
  const [newPackage, setNewPackage] = useState({name: '', description: '', price: '', features: ''});

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locations.length === 0) {
      setError("Please add at least one location branch.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiClient.post('/vendor/venues/', {
        ...formData,
        locations,
        images,
        packages: packages.map(p => ({
          ...p,
          price: Number(p.price),
          features: p.features.split(',').map(f => f.trim()).filter(f => f)
        }))
      });
      onSuccess();
    } catch (err: unknown) {
      console.error('Failed to create venue', err);
      setError((err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Failed to add venue. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = () => {
    if (newLocation.subCounty) {
      setLocations([...locations, newLocation]);
      setNewLocation({county: 'Nairobi', subCounty: '', terrain: 'Manicured Gardens'});
    }
  };

  const handleRemoveLocation = (index: number) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const handleAddImage = () => {
    if (newImage && !images.includes(newImage)) {
      setImages([...images, newImage]);
      setNewImage('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddPackage = () => {
    if (newPackage.name && newPackage.price) {
      setPackages([...packages, newPackage]);
      setNewPackage({name: '', description: '', price: '', features: ''});
    }
  };

  const handleRemovePackage = (index: number) => {
    setPackages(packages.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-extrabold text-gray-900">Add New Venue Brand</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh]">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm font-bold text-center">
              {error}
            </div>
          )}

          <div className="space-y-6">
            
            {/* Name & Desc */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Venue Brand Name</label>
              <input 
                type="text" required
                placeholder="e.g. Safari Park Hotels"
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-gray-900"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea 
                rows={3} required
                placeholder="Describe your beautiful venue brand..."
                value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-gray-900 resize-none"
              />
            </div>

            {/* Primary Image URL */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Primary High-Res Image URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="url" required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-gray-900"
                />
              </div>
            </div>

            {/* Branches / Locations Row */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-600"/> Branches / Locations</h3>
              
              {locations.length > 0 && (
                <div className="space-y-2 mb-4">
                  {locations.map((loc, idx) => (
                    <div key={idx} className="bg-white p-3 border border-gray-200 rounded-lg flex justify-between items-center">
                      <p className="font-bold text-gray-900 text-sm">
                        {loc.subCounty}, {loc.county} <span className="text-gray-500 font-normal ml-1">({loc.terrain})</span>
                      </p>
                      <button type="button" onClick={() => handleRemoveLocation(idx)} className="text-red-500 hover:bg-red-50 p-1 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">County</label>
                    <select 
                      value={newLocation.county} onChange={(e) => setNewLocation({...newLocation, county: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm"
                    >
                      <option value="Nairobi">Nairobi</option>
                      <option value="Nyeri">Nyeri</option>
                      <option value="Kiambu">Kiambu</option>
                      <option value="Nakuru">Nakuru</option>
                      <option value="Mombasa">Mombasa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Sub-County / Area</label>
                    <input 
                      type="text" placeholder="e.g. Gigiri"
                      value={newLocation.subCounty} onChange={(e) => setNewLocation({...newLocation, subCounty: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Terrain Setup</label>
                    <select 
                      value={newLocation.terrain} onChange={(e) => setNewLocation({...newLocation, terrain: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm"
                    >
                      <option value="Manicured Gardens">Manicured Gardens</option>
                      <option value="Indoor Hall">Indoor Hall</option>
                      <option value="Rooftop">Rooftop</option>
                      <option value="Lakeside">Lakeside</option>
                      <option value="Forest">Forest</option>
                    </select>
                  </div>
                </div>
                <button type="button" onClick={handleAddLocation} className="w-full bg-emerald-100 text-emerald-700 py-2 rounded-lg font-bold text-sm hover:bg-emerald-200 transition-colors flex items-center justify-center gap-1">
                  <Plus className="w-4 h-4" /> Add Branch
                </button>
              </div>
            </div>

            {/* Gallery Images */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">Gallery Images (Optional)</h3>
              <div className="flex gap-2">
                <input 
                  type="url"
                  placeholder="Add another image URL"
                  value={newImage} onChange={(e) => setNewImage(e.target.value)}
                  className="flex-grow px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none font-medium text-gray-900"
                />
                <button type="button" onClick={handleAddImage} className="bg-emerald-100 text-emerald-700 px-3 py-2 rounded-lg font-bold hover:bg-emerald-200 transition-colors flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 w-20 h-20">
                      <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Base Price Per Day (Ksh)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Ksh</span>
                  <input 
                    type="number" required min="1000"
                    placeholder="150000"
                    value={formData.pricePerDay} onChange={(e) => setFormData({...formData, pricePerDay: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Max Capacity</label>
                <input 
                  type="number" required min="10"
                  placeholder="300"
                  value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-gray-900"
                />
              </div>
            </div>

            {/* Packages */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">Custom Packages (Optional)</h3>
              
              {packages.length > 0 && (
                <div className="space-y-3 mb-4">
                  {packages.map((pkg, idx) => (
                    <div key={idx} className="bg-white p-3 border border-gray-200 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-900">{pkg.name} <span className="text-emerald-600 ml-2">Ksh {Number(pkg.price).toLocaleString()}</span></p>
                        <p className="text-xs text-gray-500 mt-1">{pkg.description} | {pkg.features}</p>
                      </div>
                      <button type="button" onClick={() => handleRemovePackage(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Package Name (e.g. VIP)" value={newPackage.name} onChange={e => setNewPackage({...newPackage, name: e.target.value})} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm" />
                  <input type="number" placeholder="Price (Ksh)" value={newPackage.price} onChange={e => setNewPackage({...newPackage, price: e.target.value})} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm" />
                </div>
                <input type="text" placeholder="Short description" value={newPackage.description} onChange={e => setNewPackage({...newPackage, description: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm" />
                <input type="text" placeholder="Features (comma separated)" value={newPackage.features} onChange={e => setNewPackage({...newPackage, features: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm" />
                <button type="button" onClick={handleAddPackage} className="w-full bg-emerald-100 text-emerald-700 py-2 rounded-lg font-bold text-sm hover:bg-emerald-200 transition-colors">
                  + Add Package
                </button>
              </div>
            </div>

          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publish Venue Brand'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
