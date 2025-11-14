
import React, { useState, useEffect } from 'react';
import type { Space } from '../types';
import { generateDescription } from '../services/geminiService';
import { SparklesIcon, XMarkIcon } from './icons';

interface SpaceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (space: Omit<Space, 'id' | 'bookings'> & { id?: string }) => void;
  spaceToEdit?: Space | null;
}

const SpaceForm: React.FC<SpaceFormProps> = ({ isOpen, onClose, onSave, spaceToEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: 10,
    pricePerDay: 100,
    amenities: '',
    description: '',
    imageUrl: ''
  });
  const [aiKeywords, setAiKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (spaceToEdit) {
      setFormData({
        name: spaceToEdit.name,
        location: spaceToEdit.location,
        capacity: spaceToEdit.capacity,
        pricePerDay: spaceToEdit.pricePerDay,
        amenities: spaceToEdit.amenities.join(', '),
        description: spaceToEdit.description,
        imageUrl: spaceToEdit.imageUrl
      });
    } else {
      setFormData({
        name: '', location: '', capacity: 10, pricePerDay: 100, amenities: '', description: '', imageUrl: ''
      });
    }
  }, [spaceToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'capacity' || name === 'pricePerDay' ? parseInt(value, 10) : value }));
  };

  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    const desc = await generateDescription(aiKeywords);
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSpaceData = {
      ...formData,
      amenities: formData.amenities.split(',').map(s => s.trim()).filter(Boolean),
      imageUrl: formData.imageUrl || `https://picsum.photos/seed/${formData.name}/800/600`,
    };
    if (spaceToEdit) {
        onSave({ ...newSpaceData, id: spaceToEdit.id });
    } else {
        onSave(newSpaceData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{spaceToEdit ? 'Edit Space' : 'Add New Space'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <XMarkIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" required />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" required />
            </div>
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity</label>
              <input type="number" name="capacity" id="capacity" min="1" value={formData.capacity} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" required />
            </div>
            <div>
              <label htmlFor="pricePerDay" className="block text-sm font-medium text-gray-700">Price per Day ($)</label>
              <input type="number" name="pricePerDay" id="pricePerDay" min="0" value={formData.pricePerDay} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" required />
            </div>
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL (optional)</label>
            <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="e.g., https://picsum.photos/800/600" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label htmlFor="amenities" className="block text-sm font-medium text-gray-700">Amenities (comma-separated)</label>
            <input type="text" name="amenities" id="amenities" value={formData.amenities} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label htmlFor="aiKeywords" className="block text-sm font-medium text-gray-700">AI Description Helper</label>
            <div className="flex items-center space-x-2 mt-1">
              <input type="text" id="aiKeywords" value={aiKeywords} onChange={(e) => setAiKeywords(e.target.value)} placeholder="e.g., modern, downtown, great view" className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
              <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300">
                <SparklesIcon className="w-5 h-5 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" id="description" rows={4} value={formData.description} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" required></textarea>
          </div>
          <div className="pt-4 flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">{spaceToEdit ? 'Save Changes' : 'Create Space'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpaceForm;
   