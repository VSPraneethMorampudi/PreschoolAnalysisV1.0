import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Pencil, 
  Square, 
  Circle, 
  Triangle, 
  Minus, 
  MapPin, 
  Trash2, 
  Save,
  Edit3
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface DrawingToolsProps {
  onToolSelect: (tool: string) => void;
  activeTool: string | null;
}

export const DrawingTools: React.FC<DrawingToolsProps> = ({ onToolSelect, activeTool }) => {
  const { selectedLanguage } = useAppStore();

  const drawingTools = [
    { id: 'point', icon: MapPin, label: 'Point', labelHindi: 'बिंदु' },
    { id: 'line', icon: Minus, label: 'Line', labelHindi: 'रेखा' },
    { id: 'polygon', icon: Triangle, label: 'Polygon', labelHindi: 'बहुभुज' },
    { id: 'circle', icon: Circle, label: 'Circle', labelHindi: 'वृत्त' },
    { id: 'rectangle', icon: Square, label: 'Rectangle', labelHindi: 'आयत' },
  ];

  const editTools = [
    { id: 'edit', icon: Edit3, label: 'Edit', labelHindi: 'संपादित करें' },
    { id: 'delete', icon: Trash2, label: 'Delete', labelHindi: 'हटाएं' },
    { id: 'save', icon: Save, label: 'Save', labelHindi: 'सहेजें' },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center space-x-2">
          <Pencil className="h-4 w-4 text-emerald-600" />
          <span>
            {selectedLanguage === 'hi' ? 'ड्राइंग टूल्स' : 'Drawing Tools'}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Drawing Tools */}
        <div>
          <h4 className="text-xs font-medium text-gray-600 mb-2">
            {selectedLanguage === 'hi' ? 'आकार बनाएं' : 'Create Shapes'}
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {drawingTools.map((tool) => {
              const IconComponent = tool.icon;
              const isActive = activeTool === tool.id;
              
              return (
                <Button
                  key={tool.id}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => onToolSelect(tool.id)}
                  className={`h-10 justify-start ${isActive ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                >
                  <IconComponent className="h-4 w-4 mr-1" />
                  <span className="text-xs">
                    {selectedLanguage === 'hi' ? tool.labelHindi : tool.label}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Edit Tools */}
        <div>
          <h4 className="text-xs font-medium text-gray-600 mb-2">
            {selectedLanguage === 'hi' ? 'संपादन टूल्स' : 'Edit Tools'}
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {editTools.map((tool) => {
              const IconComponent = tool.icon;
              const isActive = activeTool === tool.id;
              
              return (
                <Button
                  key={tool.id}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => onToolSelect(tool.id)}
                  className={`h-8 justify-start ${isActive ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                >
                  <IconComponent className="h-3 w-3 mr-2" />
                  <span className="text-xs">
                    {selectedLanguage === 'hi' ? tool.labelHindi : tool.label}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};