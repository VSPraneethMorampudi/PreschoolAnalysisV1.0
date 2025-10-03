import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, HelpCircle, User, Settings, LogOut, Menu, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppStore } from '@/lib/store';
import { getDepartmentName } from '@/lib/departmentConfig';

export const Header: React.FC = () => {
  const { 
    selectedLanguage, 
    selectedDepartment,
    setLanguage,
    setShowSettingsModal,
    setShowHelpModal,
    setShowUserProfileModal
  } = useAppStore();

  const [showProfileTooltip, setShowProfileTooltip] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLanguageToggle = () => {
    setLanguage(selectedLanguage === 'en' ? 'hi' : 'en');
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logout clicked');
    setShowUserProfileModal(false);
  };

  // Mock user data for tooltip
  const userData = {
    name: selectedLanguage === 'hi' ? 'प्रणीत मोरमपुडी' : 'Praneeth Morampudi',
    role: selectedLanguage === 'hi' ? 'GIS विश्लेषक' : 'GIS Analyst'
  };

  return (
    <TooltipProvider>
      <header 
        className="h-12 flex items-center justify-between px-3 shadow-md z-50 border-b border-emerald-600 w-full bg-emerald-600"
      >
        
        {/* Content */}
        <div className="relative z-10 flex items-center justify-between w-full">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <img 
              src="/images/cg-logo.png" 
              alt="Chhattisgarh" 
              className="h-9 w-9"
            />
            <div>
              <h1 className="text-white text-xs font-bold leading-tight">
                {selectedLanguage === 'hi' ? 'छत्तीसगढ़ भू-पोर्टल' : 'Chhattisgarh Geo Portal'}
              </h1>
              <p className="text-emerald-200 text-[10px] leading-tight">
                {selectedLanguage === 'hi' ? 'राज्य भौगोलिक सूचना प्रणाली' : 'State Geographic Information System'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Center Department Display */}
        <div className="flex-1 flex justify-center">
            <div className="text-center">
              <p className="text-blue-100 text-[12px] leading-tight font-semibold">
                {getDepartmentName(selectedDepartment, selectedLanguage)}
              </p>
            </div>
        </div>
        
        {/* Desktop Header Buttons */}
        <div className="hidden lg:flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLanguageToggle}
            className="text-white hover:bg-emerald-700 px-2 py-1 h-6 text-[10px]"
          >
            <Globe className="h-2.5 w-2.5 mr-1" />
            <span className="font-medium">
              {selectedLanguage === 'en' ? 'हिंदी' : 'English'}
            </span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettingsModal(true)}
            className="text-white hover:bg-emerald-700 p-1 h-6 w-6"
          >
            <Settings className="h-2.5 w-2.5" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHelpModal(true)}
            className="text-white hover:bg-emerald-700 p-1 h-6 w-6"
          >
            <HelpCircle className="h-2.5 w-2.5" />
          </Button>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Profile button clicked');
                  setShowUserProfileModal(true);
                }}
                onMouseEnter={() => setShowProfileTooltip(true)}
                onMouseLeave={() => setShowProfileTooltip(false)}
                className="text-white hover:bg-emerald-700 p-1 h-6 w-6"
              >
                <User className="h-2.5 w-2.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-white border border-gray-200 shadow-lg p-3 max-w-xs">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{userData.name}</p>
                    <p className="text-xs text-emerald-600">{userData.role}</p>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 h-8"
                  >
                    <LogOut className="h-3 w-3 mr-2" />
                    {selectedLanguage === 'hi' ? 'लॉग आउट' : 'Logout'}
                  </Button>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="text-white hover:bg-emerald-700 p-1 h-6 w-6"
          >
            {showMobileMenu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="lg:hidden absolute top-12 right-0 left-0 bg-white border-b border-gray-200 shadow-lg z-50">
          <div className="px-4 py-3 space-y-2">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                handleLanguageToggle();
                setShowMobileMenu(false);
              }}
              className="w-full justify-start text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 h-10"
            >
              <Globe className="h-4 w-4 mr-3" />
              <span className="font-medium">
                {selectedLanguage === 'en' ? 'हिंदी' : 'English'}
              </span>
            </Button>
            
            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowSettingsModal(true);
                setShowMobileMenu(false);
              }}
              className="w-full justify-start text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 h-10"
            >
              <Settings className="h-4 w-4 mr-3" />
              <span className="font-medium">
                {selectedLanguage === 'hi' ? 'सेटिंग्स' : 'Settings'}
              </span>
            </Button>
            
            {/* Help */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowHelpModal(true);
                setShowMobileMenu(false);
              }}
              className="w-full justify-start text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 h-10"
            >
              <HelpCircle className="h-4 w-4 mr-3" />
              <span className="font-medium">
                {selectedLanguage === 'hi' ? 'सहायता' : 'Help'}
              </span>
            </Button>
            
            {/* User Profile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowUserProfileModal(true);
                setShowMobileMenu(false);
              }}
              className="w-full justify-start text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 h-10"
            >
              <User className="h-4 w-4 mr-3" />
              <span className="font-medium">
                {selectedLanguage === 'hi' ? 'प्रोफ़ाइल' : 'Profile'}
              </span>
            </Button>
            
            {/* User Info */}
            <div className="border-t border-gray-100 pt-3 mt-3">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">{userData.name}</p>
                  <p className="text-xs text-emerald-600">{userData.role}</p>
                </div>
              </div>
              
              {/* Logout */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleLogout();
                  setShowMobileMenu(false);
                }}
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 h-10"
              >
                <LogOut className="h-4 w-4 mr-3" />
                <span className="font-medium">
                  {selectedLanguage === 'hi' ? 'लॉग आउट' : 'Logout'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </TooltipProvider>
  );
};