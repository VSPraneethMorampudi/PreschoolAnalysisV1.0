import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Layers, 
  Pencil, 
  Calculator, 
  Search, 
  Filter, 
  Ruler, 
  MapPin,
  Download,
  BarChart3,
  Globe,
  Settings,
  User
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const { selectedLanguage } = useAppStore();

  const features = [
    {
      icon: Layers,
      title: selectedLanguage === 'hi' ? 'परतें' : 'Layers',
      description: selectedLanguage === 'hi' 
        ? 'विभिन्न भौगोलिक परतों को देखें और प्रबंधित करें'
        : 'View and manage different geographic layers',
      features: selectedLanguage === 'hi' 
        ? ['परत खोजें', 'फ़िल्टर करें', 'चयन करें', 'साफ़ करें']
        : ['Search layers', 'Filter options', 'Select layers', 'Clear selection']
    },
    {
      icon: Pencil,
      title: selectedLanguage === 'hi' ? 'ड्राइंग टूल्स' : 'Drawing Tools',
      description: selectedLanguage === 'hi' 
        ? 'मानचित्र पर आकृतियाँ बनाएं और संपादित करें'
        : 'Create and edit shapes on the map',
      features: selectedLanguage === 'hi' 
        ? ['बिंदु', 'रेखा', 'बहुभुज', 'वृत्त', 'आयत']
        : ['Point', 'Line', 'Polygon', 'Circle', 'Rectangle']
    },
    {
      icon: Calculator,
      title: selectedLanguage === 'hi' ? 'विश्लेषण उपकरण' : 'Analysis Tools',
      description: selectedLanguage === 'hi' 
        ? 'स्थानिक विश्लेषण और मापन करें'
        : 'Perform spatial analysis and measurements',
      features: selectedLanguage === 'hi' 
        ? ['दूरी मापें', 'क्षेत्र मापें', 'बफर विश्लेषण', 'डेटा निर्यात']
        : ['Measure distance', 'Measure area', 'Buffer analysis', 'Export data']
    }
  ];

  const shortcuts = [
    { key: 'Ctrl + L', action: selectedLanguage === 'hi' ? 'परत पैनल टॉगल करें' : 'Toggle layers panel' },
    { key: 'Ctrl + D', action: selectedLanguage === 'hi' ? 'ड्राइंग मोड' : 'Drawing mode' },
    { key: 'Ctrl + A', action: selectedLanguage === 'hi' ? 'विश्लेषण मोड' : 'Analysis mode' },
    { key: 'Ctrl + S', action: selectedLanguage === 'hi' ? 'सेटिंग्स खोलें' : 'Open settings' },
    { key: 'F1', action: selectedLanguage === 'hi' ? 'सहायता खोलें' : 'Open help' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <DialogTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-emerald-600" />
            <span>
              {selectedLanguage === 'hi' ? 'सहायता और गाइड' : 'Help & Guide'}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Welcome Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {selectedLanguage === 'hi' 
                  ? 'छत्तीसगढ़ भू-पोर्टल में आपका स्वागत है' 
                  : 'Welcome to Chhattisgarh Geo Portal'
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {selectedLanguage === 'hi' 
                  ? 'यह राज्य भौगोलिक सूचना प्रणाली आपको विभिन्न भौगोलिक डेटा और उपकरणों तक पहुंच प्रदान करती है।'
                  : 'This State Geographic Information System provides access to various geographic data and tools.'
                }
              </p>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {selectedLanguage === 'hi' ? 'मुख्य सुविधाएं' : 'Key Features'}
            </h3>
            <div className="grid gap-4">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center space-x-2">
                        <IconComponent className="h-4 w-4 text-emerald-600" />
                        <span>{feature.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground mb-2">
                        {feature.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {feature.features.map((feat, featIndex) => (
                          <Badge key={featIndex} variant="secondary" className="text-xs">
                            {feat}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {selectedLanguage === 'hi' ? 'कीबोर्ड शॉर्टकट' : 'Keyboard Shortcuts'}
            </h3>
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  {shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                        {shortcut.key}
                      </code>
                      <span className="text-sm text-muted-foreground">
                        {shortcut.action}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                {selectedLanguage === 'hi' ? 'संपर्क जानकारी' : 'Contact Information'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>
                  {selectedLanguage === 'hi' 
                    ? 'अधिक सहायता के लिए कृपया संपर्क करें:'
                    : 'For more assistance, please contact:'
                  }
                </p>
                <p>Email: support@chhattisgarh-gis.gov.in</p>
                <p>Phone: +91-XXX-XXXXXXX</p>
                <p>
                  {selectedLanguage === 'hi' 
                    ? 'वेबसाइट: www.chhattisgarh-gis.gov.in'
                    : 'Website: www.chhattisgarh-gis.gov.in'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex justify-end">
            <Button onClick={onClose}>
              {selectedLanguage === 'hi' ? 'बंद करें' : 'Close'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


