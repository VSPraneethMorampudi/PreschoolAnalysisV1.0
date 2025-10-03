import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/lib/store';
import { departments, getDepartmentName } from '@/lib/departmentConfig';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { selectedLanguage, selectedDepartment, setLanguage, setSelectedDepartment } = useAppStore();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <DialogTitle>
            {selectedLanguage === 'hi' ? 'सेटिंग्स' : 'Settings'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 relative">
          {/* Language Settings */}
          <div className="space-y-2">
            <Label htmlFor="language">
              {selectedLanguage === 'hi' ? 'भाषा' : 'Language'}
            </Label>
            <Select value={selectedLanguage} onValueChange={(value: 'en' | 'hi') => setLanguage(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[60]">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Department Settings */}
          <div className="space-y-2">
            <Label htmlFor="department">
              {selectedLanguage === 'hi' ? 'विभाग' : 'Department'}
            </Label>
            <Select value={selectedDepartment} onValueChange={(value: string) => setSelectedDepartment(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[60]">
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {getDepartmentName(dept.id, selectedLanguage)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {selectedLanguage === 'hi' 
                ? 'पोर्टल में दिखाई जाने वाली विभाग जानकारी चुनें'
                : 'Select the department information to display in the portal'
              }
            </p>
          </div>

          <Separator />

          {/* Map Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">
              {selectedLanguage === 'hi' ? 'मानचित्र सेटिंग्स' : 'Map Settings'}
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>
                  {selectedLanguage === 'hi' ? 'डिफ़ॉल्ट ज़ूम स्तर' : 'Default Zoom Level'}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {selectedLanguage === 'hi' 
                    ? 'मानचित्र लोड होने पर प्रारंभिक ज़ूम स्तर'
                    : 'Initial zoom level when map loads'
                  }
                </p>
              </div>
              <Select defaultValue="10">
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[60]">
                  {Array.from({ length: 18 }, (_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>
                  {selectedLanguage === 'hi' ? 'ऑटो-सेव' : 'Auto-save'}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {selectedLanguage === 'hi' 
                    ? 'परत चयन और सेटिंग्स को स्वचालित रूप से सहेजें'
                    : 'Automatically save layer selections and settings'
                  }
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <Separator />

          {/* Display Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">
              {selectedLanguage === 'hi' ? 'प्रदर्शन सेटिंग्स' : 'Display Settings'}
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>
                  {selectedLanguage === 'hi' ? 'डार्क मोड' : 'Dark Mode'}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {selectedLanguage === 'hi' 
                    ? 'अंधेरे थीम का उपयोग करें'
                    : 'Use dark theme'
                  }
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>
                  {selectedLanguage === 'hi' ? 'एनिमेशन' : 'Animations'}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {selectedLanguage === 'hi' 
                    ? 'UI एनिमेशन सक्षम करें'
                    : 'Enable UI animations'
                  }
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 px-6 py-4 border-t border-gray-200 flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            {selectedLanguage === 'hi' ? 'रद्द करें' : 'Cancel'}
          </Button>
          <Button onClick={onClose}>
            {selectedLanguage === 'hi' ? 'सहेजें' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


