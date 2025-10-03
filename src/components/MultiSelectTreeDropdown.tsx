import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { LayerTreeNode } from '@/lib/layerData';
import { useAppStore } from '@/lib/store';

interface MultiSelectTreeDropdownProps {
  data: LayerTreeNode;
  onSelectionChange: (selected: string[]) => void;
  searchTerm?: string;
}

const IconPlaceholder: React.FC<{ type: string; className?: string }> = ({ type, className = "w-4 h-4" }) => {
  const baseClasses = `${className} flex-shrink-0 border border-gray-400`;
  
  switch (type) {
    case 'square':
      return <div className={`${baseClasses} bg-gray-200`} />;
    case 'circle':
      return <div className={`${baseClasses} bg-gray-200 rounded-full`} />;
    case 'triangle':
      return (
        <div className={`${baseClasses} bg-gray-200`} style={{
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
        }} />
      );
    case 'diamond':
      return (
        <div className={`${baseClasses} bg-gray-200`} style={{
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
        }} />
      );
    case 'hexagon':
      return (
        <div className={`${baseClasses} bg-gray-200`} style={{
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)'
        }} />
      );
    default:
      return <div className={`${baseClasses} bg-gray-200`} />;
  }
};

export const MultiSelectTreeDropdown: React.FC<MultiSelectTreeDropdownProps> = ({
  data,
  onSelectionChange,
  searchTerm = '',
}) => {
  const { selectedLayers, expandedNodes, selectedLanguage, toggleNodeExpansion } = useAppStore();

  const handleSelectionChange = (nodeId: string, checked: boolean) => {
    let newSelection = [...selectedLayers];
    
    if (checked) {
      if (!newSelection.includes(nodeId)) {
        newSelection.push(nodeId);
      }
    } else {
      newSelection = newSelection.filter(id => id !== nodeId);
    }
    
    onSelectionChange(newSelection);
  };

  const getAllChildLayerIds = (node: LayerTreeNode): string[] => {
    const layerIds: string[] = [];
    
    if (node.type === 'layer') {
      layerIds.push(node.id);
    }
    
    if (node.children) {
      node.children.forEach(child => {
        layerIds.push(...getAllChildLayerIds(child));
      });
    }
    
    return layerIds;
  };

  const handleGroupSelection = (node: LayerTreeNode, checked: boolean) => {
    const childLayerIds = getAllChildLayerIds(node);
    let newSelection = [...selectedLayers];
    
    if (checked) {
      childLayerIds.forEach(id => {
        if (!newSelection.includes(id)) {
          newSelection.push(id);
        }
      });
    } else {
      newSelection = newSelection.filter(id => !childLayerIds.includes(id));
    }
    
    onSelectionChange(newSelection);
  };

  const isGroupPartiallySelected = (node: LayerTreeNode): boolean => {
    const childLayerIds = getAllChildLayerIds(node);
    const selectedChildIds = childLayerIds.filter(id => selectedLayers.includes(id));
    return selectedChildIds.length > 0 && selectedChildIds.length < childLayerIds.length;
  };

  const isGroupFullySelected = (node: LayerTreeNode): boolean => {
    const childLayerIds = getAllChildLayerIds(node);
    return childLayerIds.length > 0 && childLayerIds.every(id => selectedLayers.includes(id));
  };

  const matchesSearch = (node: LayerTreeNode): boolean => {
    if (!searchTerm) return true;
    const title = selectedLanguage === 'hi' ? node.titleHindi : node.title;
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const renderTreeNode = (node: LayerTreeNode, level: number = 0): JSX.Element | null => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const title = selectedLanguage === 'hi' ? node.titleHindi : node.title;
    
    // Filter logic
    const nodeMatches = matchesSearch(node);
    const hasMatchingChildren = hasChildren && node.children!.some(child => 
      matchesSearch(child) || (child.children && child.children.some(matchesSearch))
    );
    
    if (!nodeMatches && !hasMatchingChildren) {
      return null;
    }
    
    const isSelected = node.type === 'layer' 
      ? selectedLayers.includes(node.id)
      : isGroupFullySelected(node);
    
    const isIndeterminate = node.type === 'group' && isGroupPartiallySelected(node);

    return (
      <div key={node.id} className="select-none">
        <div 
          className={`flex items-center py-1.5 px-2 hover:bg-gray-50 rounded transition-all duration-200 group ${
            level > 0 ? 'ml-6' : ''
          } ${isSelected ? 'bg-emerald-50 border-l-2 border-emerald-500' : ''}`}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-4 w-4 mr-1.5 hover:bg-gray-200"
              onClick={() => toggleNodeExpansion(node.id)}
            >
              {isExpanded ? (
                <ChevronDown className="h-2.5 w-2.5" />
              ) : (
                <ChevronRight className="h-2.5 w-2.5" />
              )}
            </Button>
          )}
          
          {!hasChildren && <div className="w-5.5" />}
          
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => {
                if (node.type === 'layer') {
                  handleSelectionChange(node.id, checked as boolean);
                } else {
                  handleGroupSelection(node, checked as boolean);
                }
              }}
              className={`
                data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600
                ${isIndeterminate ? 'data-[state=indeterminate]:bg-emerald-500' : ''}
              `}
              {...(isIndeterminate && { 'data-state': 'indeterminate' })}
            />
            
            <div className="flex items-center space-x-1.5 flex-1 min-w-0">
              <div className="flex-1 min-w-0 ml-1">
                <span className={`text-[11px] font-medium text-gray-700 truncate block ${
                  isSelected ? 'text-emerald-700' : ''
                }`}>
                  {title}
                </span>
                {node.description && level > 0 && (
                  <span className="text-[9px] text-gray-500 truncate block">
                    {node.description}
                  </span>
                )}
              </div>
              
            </div>
          </div>
        </div>
        
        
        {hasChildren && isExpanded && (
          <div className="ml-6 space-y-0.5">
            {node.children!.map(child => renderTreeNode(child, level + 1)).filter(Boolean)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-2 space-y-1 max-h-full overflow-y-auto">
      {data.children?.map(child => renderTreeNode(child)).filter(Boolean)}
    </div>
  );
};