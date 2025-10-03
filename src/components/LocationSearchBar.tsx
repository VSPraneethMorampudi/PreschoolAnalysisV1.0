import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/store';

interface LocationSearchBarProps {
  className?: string;
}

export const LocationSearchBar: React.FC<LocationSearchBarProps> = ({ className = "" }) => {
  const { selectedLanguage } = useAppStore();
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [locationSearchResults, setLocationSearchResults] = useState<any[]>([]);
  const [showLocationResults, setShowLocationResults] = useState(false);

  // Location search data for Chhattisgarh districts, villages, and locations
  const locationSearchData = [
    { type: 'district', name: 'Raipur', nameHi: 'रायपुर', coordinates: [81.8667, 21.2500] },
    { type: 'district', name: 'Bilaspur', nameHi: 'बिलासपुर', coordinates: [82.1500, 22.0800] },
    { type: 'district', name: 'Durg', nameHi: 'दुर्ग', coordinates: [81.2833, 21.1833] },
    { type: 'district', name: 'Raigarh', nameHi: 'रायगढ़', coordinates: [83.4000, 21.9000] },
    { type: 'district', name: 'Korba', nameHi: 'कोरबा', coordinates: [82.7167, 22.3500] },
    { type: 'district', name: 'Jagdalpur', nameHi: 'जगदलपुर', coordinates: [82.0167, 19.0833] },
    { type: 'district', name: 'Ambikapur', nameHi: 'अम्बिकापुर', coordinates: [83.2000, 23.1167] },
    { type: 'district', name: 'Rajnandgaon', nameHi: 'राजनांदगाँव', coordinates: [81.0333, 21.1000] },
    { type: 'district', name: 'Dhamtari', nameHi: 'धमतरी', coordinates: [81.5500, 20.7000] },
    { type: 'district', name: 'Mahasamund', nameHi: 'महासमुंद', coordinates: [82.1000, 21.1000] },
    { type: 'village', name: 'Bhatapara', nameHi: 'भाटापारा', coordinates: [81.9333, 21.7333] },
    { type: 'village', name: 'Tilda', nameHi: 'तिल्दा', coordinates: [81.6500, 21.5500] },
    { type: 'village', name: 'Abhanpur', nameHi: 'अभनपुर', coordinates: [81.8000, 21.1000] },
    { type: 'village', name: 'Arang', nameHi: 'अरंग', coordinates: [81.9667, 21.2000] },
    { type: 'location', name: 'Indravati National Park', nameHi: 'इंद्रावती राष्ट्रीय उद्यान', coordinates: [81.0000, 18.5000] },
    { type: 'location', name: 'Chitrakote Falls', nameHi: 'चित्रकोट जलप्रपात', coordinates: [81.7333, 19.2000] },
    { type: 'location', name: 'Kanger Valley National Park', nameHi: 'कांगेर घाटी राष्ट्रीय उद्यान', coordinates: [81.9333, 18.8333] },
    { type: 'location', name: 'Bastar Palace', nameHi: 'बस्तर महल', coordinates: [81.9667, 19.0833] },
    { type: 'location', name: 'Danteshwari Temple', nameHi: 'दंतेश्वरी मंदिर', coordinates: [81.9833, 19.1000] },
  ];

  const handleLocationSearch = (query: string) => {
    setLocationSearchQuery(query);
    if (query.length > 1) {
      const results = locationSearchData.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.nameHi.includes(query)
      );
      setLocationSearchResults(results);
      setShowLocationResults(true);
    } else {
      setLocationSearchResults([]);
      setShowLocationResults(false);
    }
  };

  const handleLocationResultClick = (result: any) => {
    console.log('Location search result clicked:', result);
    // Here you would typically zoom to the location on the map
    setLocationSearchQuery(selectedLanguage === 'hi' ? result.nameHi : result.name);
    setShowLocationResults(false);
  };

  return (
    <div className={`relative ${className}`}>
      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-600" />
      <Input
        placeholder={selectedLanguage === 'hi' ? 'जिला, गाँव या स्थान खोजें...' : 'Search district, village or location...'}
        value={locationSearchQuery}
        onChange={(e) => handleLocationSearch(e.target.value)}
        onFocus={() => setShowLocationResults(locationSearchQuery.length > 1)}
        className="pl-10 h-10 text-sm bg-white/95 border-emerald-300 focus:border-emerald-500 shadow-lg"
      />
      
      {/* Location Search Results Dropdown */}
      {showLocationResults && locationSearchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-48 overflow-y-auto z-50">
          {locationSearchResults.map((result, index) => (
            <div
              key={index}
              onClick={() => handleLocationResultClick(result)}
              className="flex items-center space-x-3 p-3 hover:bg-emerald-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <MapPin className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800">
                  {selectedLanguage === 'hi' ? result.nameHi : result.name}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {selectedLanguage === 'hi' 
                    ? (result.type === 'district' ? 'जिला' : result.type === 'village' ? 'गाँव' : 'स्थान')
                    : result.type
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
