import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  LogOut,
  Edit
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { 
    selectedLanguage,
    setShowEditProfileModal,
    setShowChangePasswordModal
  } = useAppStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const [userData, setUserData] = useState({
    name: selectedLanguage === 'hi' ? 'प्रणीत मोरमपुडी' : 'Praneeth Morampudi',
    email: 'praneeth.morampudi@chhattisgarh-gis.gov.in',
    phone: '+91-7680932739',
    department: selectedLanguage === 'hi' ? 'भू-सूचना विभाग' : 'Geographic Information Department',
    role: selectedLanguage === 'hi' ? 'GIS विश्लेषक' : 'GIS Analyst',
    location: selectedLanguage === 'hi' ? 'रायपुर, छत्तीसगढ़' : 'Raipur, Chhattisgarh',
    joinDate: '2023-01-15',
    lastLogin: '2025-01-27 14:30',
    permissions: selectedLanguage === 'hi' 
      ? ['परत देखें', 'डेटा निर्यात', 'विश्लेषण करें', 'रिपोर्ट बनाएं']
      : ['View Layers', 'Export Data', 'Perform Analysis', 'Generate Reports']
  });

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if click is outside the profile modal
      if (modalRef.current && !modalRef.current.contains(target)) {
        // Check if click is on a dialog modal (which should not close the profile)
        const isDialogClick = target.closest('[role="dialog"]');
        
        if (!isDialogClick) {
          console.log('UserProfileModal: Clicked outside, closing profile modal');
          onClose();
        } else {
          console.log('UserProfileModal: Clicked on dialog modal, keeping profile open');
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Update user data when language changes
  useEffect(() => {
    setUserData(prev => ({
      ...prev,
      name: selectedLanguage === 'hi' ? 'प्रणीत मोरमपुडी' : 'Praneeth Morampudi',
      department: selectedLanguage === 'hi' ? 'भू-सूचना विभाग' : 'Geographic Information Department',
      role: selectedLanguage === 'hi' ? 'GIS विश्लेषक' : 'GIS Analyst',
      location: selectedLanguage === 'hi' ? 'रायपुर, छत्तीसगढ़' : 'Raipur, Chhattisgarh',
      permissions: selectedLanguage === 'hi' 
        ? ['परत देखें', 'डेटा निर्यात', 'विश्लेषण करें', 'रिपोर्ट बनाएं']
        : ['View Layers', 'Export Data', 'Perform Analysis', 'Generate Reports']
    }));
  }, [selectedLanguage]);

  const handleEditProfile = (newUserData: any) => {
    setUserData(prev => ({
      ...prev,
      ...newUserData
    }));
    console.log('Profile updated:', newUserData);
  };

  const handleChangePassword = (passwordData: any) => {
    console.log('Password changed:', passwordData);
    // In a real app, this would make an API call to change the password
  };

  if (!isOpen) return null;

  console.log('UserProfileModal rendered:', { isOpen });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
      <div className="fixed inset-0 bg-black bg-opacity-25" />
      <div 
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-xl border border-gray-200 w-96 max-h-[90vh] overflow-y-auto z-[55]"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-emerald-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedLanguage === 'hi' ? 'उपयोगकर्ता प्रोफ़ाइल' : 'User Profile'}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-emerald-200"
            >
              ×
            </Button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Profile Header - Horizontal Layout */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/api/placeholder/48/48" />
              <AvatarFallback className="text-sm">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-800 truncate">{userData.name}</h3>
              <p className="text-sm text-emerald-600 font-medium">{userData.role}</p>
              <p className="text-xs text-gray-500 truncate">{userData.department}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="shrink-0"
              onClick={() => setShowEditProfileModal(true)}
            >
              <Edit className="h-3 w-3 mr-1" />
              {selectedLanguage === 'hi' ? 'संपादित करें' : 'Edit'}
            </Button>
          </div>

          <Separator />

          {/* Contact Information - Compact */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">
              {selectedLanguage === 'hi' ? 'संपर्क जानकारी' : 'Contact Information'}
            </h4>
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-3 w-3 text-gray-400" />
                <span className="truncate">{userData.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-3 w-3 text-gray-400" />
                <span>{userData.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-3 w-3 text-gray-400" />
                <span className="truncate">{userData.location}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Account Details - Compact */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">
              {selectedLanguage === 'hi' ? 'खाता विवरण' : 'Account Details'}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3 text-gray-400" />
                <div>
                  <p className="text-gray-500">
                    {selectedLanguage === 'hi' ? 'शामिल हुए' : 'Joined'}
                  </p>
                  <p className="font-medium">{userData.joinDate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3 text-gray-400" />
                <div>
                  <p className="text-gray-500">
                    {selectedLanguage === 'hi' ? 'अंतिम लॉगिन' : 'Last Login'}
                  </p>
                  <p className="font-medium text-xs">{userData.lastLogin.split(' ')[0]}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Permissions - Compact */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">
              {selectedLanguage === 'hi' ? 'अनुमतियां' : 'Permissions'}
            </h4>
            <div className="flex flex-wrap gap-1">
              {userData.permissions.map((permission, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                  {permission}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Actions - Horizontal */}
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setShowChangePasswordModal(true)}
            >
              <Shield className="h-3 w-3 mr-1" />
              {selectedLanguage === 'hi' ? 'पासवर्ड बदलें' : 'Change Password'}
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex-1"
              onClick={() => {
                console.log('Logout clicked');
                onClose();
              }}
            >
              <LogOut className="h-3 w-3 mr-1" />
              {selectedLanguage === 'hi' ? 'लॉग आउट' : 'Logout'}
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
};
