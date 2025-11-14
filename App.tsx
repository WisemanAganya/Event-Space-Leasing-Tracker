
import React, { useState, useMemo } from 'react';
import type { Space, Booking } from './types';
import Header from './components/Header';
import SpaceCard from './components/SpaceCard';
import SpaceDetails from './components/SpaceDetails';
import SpaceForm from './components/SpaceForm';

const initialSpaces: Space[] = [
    {
        id: '1',
        name: 'The Grand Ballroom',
        location: 'Downtown, Metro City',
        capacity: 200,
        amenities: ['Wi-Fi', 'Projector', 'Catering', 'Sound System'],
        pricePerDay: 1500,
        description: 'An elegant and spacious ballroom perfect for weddings, galas, and large corporate events. Features high ceilings and classic decor.',
        imageUrl: 'https://picsum.photos/seed/ballroom/800/600',
        bookings: [],
    },
    {
        id: '2',
        name: 'Modern Loft',
        location: 'Arts District, Metro City',
        capacity: 75,
        amenities: ['Wi-Fi', 'Kitchenette', 'Natural Light', 'Rooftop Access'],
        pricePerDay: 800,
        description: 'A stylish and versatile loft with an industrial-chic vibe. Ideal for workshops, photo shoots, and intimate gatherings.',
        imageUrl: 'https://picsum.photos/seed/loft/800/600',
        bookings: [],
    },
    {
        id: '3',
        name: 'Lakeside Conference Center',
        location: 'North Suburbs',
        capacity: 120,
        amenities: ['Wi-Fi', 'Whiteboards', 'AV Equipment', 'Free Parking'],
        pricePerDay: 1100,
        description: 'A professional setting with serene lake views. Our conference center is equipped with state-of-the-art technology for your next business meeting.',
        imageUrl: 'https://picsum.photos/seed/conference/800/600',
        bookings: [],
    },
];


const App: React.FC = () => {
    const [spaces, setSpaces] = useState<Space[]>(initialSpaces);
    const [selectedSpace, setSelectedSpace] = useState<Space | null>(spaces[0] || null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [spaceToEdit, setSpaceToEdit] = useState<Space | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSelectSpace = (space: Space) => {
        setSelectedSpace(space);
    };

    const handleOpenForm = (space?: Space) => {
        setSpaceToEdit(space || null);
        setIsFormOpen(true);
    };
    
    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSpaceToEdit(null);
    };
    
    const handleSaveSpace = (spaceData: Omit<Space, 'id' | 'bookings'> & { id?: string }) => {
        if (spaceData.id) { // Editing existing space
            setSpaces(spaces.map(s => s.id === spaceData.id ? { ...s, ...spaceData, amenities: spaceData.amenities } : s));
            if(selectedSpace?.id === spaceData.id) {
                setSelectedSpace(prev => prev ? {...prev, ...spaceData, amenities: spaceData.amenities} : null);
            }
        } else { // Adding new space
            const newSpace: Space = {
                ...spaceData,
                id: new Date().toISOString(),
                bookings: [],
            };
            setSpaces([newSpace, ...spaces]);
            setSelectedSpace(newSpace);
        }
    };
    
    const handleDeleteSpace = () => {
        if (!selectedSpace) return;
        setSpaces(spaces.filter(s => s.id !== selectedSpace.id));
        setSelectedSpace(spaces.length > 1 ? spaces.find(s => s.id !== selectedSpace.id) || null : null);
    };

    const handleAddBooking = (spaceId: string, date: Date) => {
        const newBooking: Booking = { id: new Date().toISOString(), date };
        setSpaces(spaces.map(space => {
            if (space.id === spaceId) {
                const updatedBookings = [...space.bookings, newBooking].sort((a,b) => a.date.getTime() - b.date.getTime());
                const updatedSpace = { ...space, bookings: updatedBookings };
                if (selectedSpace?.id === spaceId) {
                    setSelectedSpace(updatedSpace);
                }
                return updatedSpace;
            }
            return space;
        }));
    };
    
    const filteredSpaces = useMemo(() => {
        return spaces.filter(space =>
            space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            space.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [spaces, searchTerm]);

    return (
        <div className="h-screen w-screen flex flex-col font-sans">
            <Header onAddSpace={() => handleOpenForm()} />
            <main className="flex-grow grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 overflow-hidden">
                {/* Space List */}
                <div className="flex flex-col bg-white border-r border-gray-200 lg:col-span-1 xl:col-span-1">
                    <div className="p-4 border-b">
                        <input
                            type="text"
                            placeholder="Search spaces..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                    </div>
                    <div className="flex-grow overflow-y-auto p-2 space-y-1">
                        {filteredSpaces.map(space => (
                            <SpaceCard 
                                key={space.id} 
                                space={space} 
                                onSelect={handleSelectSpace} 
                                isSelected={selectedSpace?.id === space.id}
                            />
                        ))}
                         {filteredSpaces.length === 0 && <p className="text-center text-gray-500 p-4">No spaces found.</p>}
                    </div>
                </div>

                {/* Space Details */}
                <div className={`lg:col-span-2 xl:col-span-3 bg-gray-50 overflow-y-auto ${!selectedSpace && 'hidden lg:flex items-center justify-center'}`}>
                    {selectedSpace ? (
                        <SpaceDetails
                            space={selectedSpace}
                            onClose={() => setSelectedSpace(null)}
                            onEdit={() => handleOpenForm(selectedSpace)}
                            onDelete={handleDeleteSpace}
                            onAddBooking={handleAddBooking}
                        />
                    ) : (
                       <div className="text-center">
                            <h2 className="text-2xl font-semibold text-gray-600">Select a space to view details</h2>
                            <p className="text-gray-400 mt-2">Or add a new space to get started.</p>
                        </div>
                    )}
                </div>
            </main>
            <SpaceForm 
                isOpen={isFormOpen} 
                onClose={handleCloseForm}
                onSave={handleSaveSpace}
                spaceToEdit={spaceToEdit}
            />
        </div>
    );
};

export default App;
   