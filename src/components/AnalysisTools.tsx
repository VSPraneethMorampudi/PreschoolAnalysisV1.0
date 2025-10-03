import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Calculator, 
  Ruler, 
  MapPin, 
  Search, 
  Download,
  BarChart3
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface AnalysisToolsProps {
  onMeasureDistance?: () => void;
  onMeasureArea?: () => void;
  onBufferAnalysis?: () => void;
  onSpatialQuery?: () => void;
  onExportData?: () => void;
  onGenerateReport?: () => void;
}

export const AnalysisTools: React.FC<AnalysisToolsProps> = ({
  onMeasureDistance,
  onMeasureArea,
  onBufferAnalysis,
  onSpatialQuery,
  onExportData,
  onGenerateReport,
}) => {
  const { selectedLanguage } = useAppStore();

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-gray-800 flex items-center space-x-2">
          <Calculator className="h-4 w-4 text-emerald-600" />
          <span>
            {selectedLanguage === 'hi' ? 'विश्लेषण उपकरण' : 'Analysis Tools'}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Measurement Tools */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            {selectedLanguage === 'hi' ? 'मापना' : 'Measurement'}
          </h4>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onMeasureDistance}
              className="text-xs h-8 justify-start"
            >
              <Ruler className="h-3 w-3 mr-1" />
              {selectedLanguage === 'hi' ? 'दूरी' : 'Distance'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onMeasureArea}
              className="text-xs h-8 justify-start"
            >
              <MapPin className="h-3 w-3 mr-1" />
              {selectedLanguage === 'hi' ? 'क्षेत्र' : 'Area'}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Spatial Analysis */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            {selectedLanguage === 'hi' ? 'स्थानिक विश्लेषण' : 'Spatial Analysis'}
          </h4>
          
          <div className="space-y-1">
            <Button
              variant="outline"
              size="sm"
              onClick={onBufferAnalysis}
              className="w-full text-xs h-8 justify-start"
            >
              <Search className="h-3 w-3 mr-2" />
              {selectedLanguage === 'hi' ? 'बफर विश्लेषण' : 'Buffer Analysis'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onSpatialQuery}
              className="w-full text-xs h-8 justify-start"
            >
              <Calculator className="h-3 w-3 mr-2" />
              {selectedLanguage === 'hi' ? 'स्थानिक क्वेरी' : 'Spatial Query'}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Export & Reports */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            {selectedLanguage === 'hi' ? 'निर्यात और रिपोर्ट' : 'Export & Reports'}
          </h4>
          
          <div className="space-y-1">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportData}
              className="w-full text-xs h-8 justify-start"
            >
              <Download className="h-3 w-3 mr-2" />
              {selectedLanguage === 'hi' ? 'डेटा निर्यात' : 'Export Data'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onGenerateReport}
              className="w-full text-xs h-8 justify-start"
            >
              <BarChart3 className="h-3 w-3 mr-2" />
              {selectedLanguage === 'hi' ? 'रिपोर्ट जेनरेट करें' : 'Generate Report'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};