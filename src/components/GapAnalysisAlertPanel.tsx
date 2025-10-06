import React, { useState } from 'react';
import { AlertTriangle, MapPin, Clock, Users, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface GapAnalysisAlertPanelProps {
  isOpen: boolean;
  onClose: () => void;
  gapAnalysisData: any;
  onExportAlertReport: () => void;
}

export const GapAnalysisAlertPanel: React.FC<GapAnalysisAlertPanelProps> = ({
  isOpen,
  onClose,
  gapAnalysisData,
  onExportAlertReport
}) => {
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [alertFilter, setAlertFilter] = useState('all');

  if (!isOpen || !gapAnalysisData) return null;

  const getAlertSeverity = (gap: any) => {
    if (gap.nearestSchoolDistance > 10) return 'critical';
    if (gap.nearestSchoolDistance > 7.5) return 'high';
    if (gap.nearestSchoolDistance > 5) return 'medium';
    if (gap.blockingObstacles?.length > 0) return 'infrastructure';
    return 'low';
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'infrastructure': return 'secondary';
      default: return 'outline';
    }
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '🟡';
      case 'infrastructure': return '🚧';
      default: return 'ℹ️';
    }
  };

  const alertCategories = {
    critical: gapAnalysisData.uncoveredDetails?.filter((gap: any) => getAlertSeverity(gap) === 'critical') || [],
    high: gapAnalysisData.uncoveredDetails?.filter((gap: any) => getAlertSeverity(gap) === 'high') || [],
    medium: gapAnalysisData.uncoveredDetails?.filter((gap: any) => getAlertSeverity(gap) === 'medium') || [],
    infrastructure: gapAnalysisData.uncoveredDetails?.filter((gap: any) => getAlertSeverity(gap) === 'infrastructure') || []
  };

  const filteredAlerts = alertFilter === 'all' 
    ? gapAnalysisData.uncoveredDetails || []
    : alertCategories[alertFilter as keyof typeof alertCategories] || [];

  const generateAlertSummary = () => {
    const total = gapAnalysisData.uncoveredDetails?.length || 0;
    const critical = alertCategories.critical.length;
    const high = alertCategories.high.length;
    const infrastructure = alertCategories.infrastructure.length;
    
    return {
      total,
      critical,
      high,
      infrastructure,
      criticalPercentage: total > 0 ? ((critical / total) * 100).toFixed(1) : '0',
      highPercentage: total > 0 ? ((high / total) * 100).toFixed(1) : '0'
    };
  };

  const alertSummary = generateAlertSummary();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gap Analysis Alert Details</h2>
              <p className="text-sm text-gray-600">Critical educational accessibility alerts and recommendations</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </Button>
        </div>

        {/* Alert Summary Dashboard */}
        <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-b">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Card className="border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-red-700">🚨 Critical Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{alertSummary.critical}</div>
                <p className="text-sm text-red-600">{alertSummary.criticalPercentage}% of total gaps</p>
              </CardContent>
            </Card>
            
            <Card className="border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-orange-700">⚠️ High Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{alertSummary.high}</div>
                <p className="text-sm text-orange-600">{alertSummary.highPercentage}% of total gaps</p>
              </CardContent>
            </Card>
            
            <Card className="border-yellow-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-yellow-700">🚧 Infrastructure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{alertSummary.infrastructure}</div>
                <p className="text-sm text-yellow-600">Blocked by obstacles</p>
              </CardContent>
            </Card>
            
            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-700">📊 Total Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-600">{alertSummary.total}</div>
                <p className="text-sm text-gray-600">Requires immediate attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="destructive" 
              size="sm"
              onClick={onExportAlertReport}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export Alert Report</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setAlertFilter('critical')}
              className="flex items-center space-x-2"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>View Critical Only</span>
            </Button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={alertFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAlertFilter('all')}
            >
              All Alerts ({alertSummary.total})
            </Button>
            <Button 
              variant={alertFilter === 'critical' ? 'destructive' : 'outline'}
              size="sm"
              onClick={() => setAlertFilter('critical')}
            >
              🚨 Critical ({alertCategories.critical.length})
            </Button>
            <Button 
              variant={alertFilter === 'high' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAlertFilter('high')}
            >
              ⚠️ High ({alertCategories.high.length})
            </Button>
            <Button 
              variant={alertFilter === 'medium' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAlertFilter('medium')}
            >
              🟡 Medium ({alertCategories.medium.length})
            </Button>
            <Button 
              variant={alertFilter === 'infrastructure' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setAlertFilter('infrastructure')}
            >
              🚧 Infrastructure ({alertCategories.infrastructure.length})
            </Button>
          </div>
        </div>

        {/* Alert List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {filteredAlerts.map((gap: any, index: number) => {
              const severity = getAlertSeverity(gap);
              const alertIcon = getAlertIcon(severity);
              
              return (
                <Alert 
                  key={index} 
                  className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${
                    severity === 'critical' ? 'border-l-red-500 bg-red-50' :
                    severity === 'high' ? 'border-l-orange-500 bg-orange-50' :
                    severity === 'infrastructure' ? 'border-l-purple-500 bg-purple-50' :
                    'border-l-yellow-500 bg-yellow-50'
                  }`}
                  onClick={() => setSelectedAlert(gap)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="text-2xl">{alertIcon}</div>
                      <div className="flex-1 min-w-0">
                        <AlertTitle className="flex items-center gap-2">
                          <span className="font-semibold">
                            {gap.properties?.awc_name || `Anganwadi ${index + 1}`}
                          </span>
                          <Badge variant={getAlertColor(severity)}>
                            {severity.toUpperCase()}
                          </Badge>
                        </AlertTitle>
                        <AlertDescription className="mt-2 space-y-1">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {gap.properties?.district || 'Unknown'}, {gap.properties?.village || 'Unknown'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Nearest: {gap.nearestSchoolDistance}km
                            </span>
                            {gap.properties?.children_count && (
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {gap.properties.children_count} children
                              </span>
                            )}
                          </div>
                          
                          {gap.gapReason && (
                            <div className="mt-2 p-2 bg-white rounded border">
                              <strong>Alert Reason:</strong> {gap.gapReason}
                            </div>
                          )}
                          
                          {gap.blockingObstacles?.length > 0 && (
                            <div className="mt-2 p-2 bg-purple-100 rounded border border-purple-200">
                              <strong>Infrastructure Barriers:</strong> {gap.blockingObstacles.join(', ')}
                            </div>
                          )}
                          
                          <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                            <strong>Recommendation:</strong> {
                              severity === 'critical' ? 'Immediate establishment of new primary school required within 5km radius' :
                              severity === 'high' ? 'Priority area for new school establishment or transportation support' :
                              severity === 'infrastructure' ? 'Infrastructure development needed to improve accessibility' :
                              'Monitor and consider for future development planning'
                            }
                          </div>
                        </AlertDescription>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </Alert>
              );
            })}
          </div>
          
          {filteredAlerts.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No alerts found for the selected filter.</p>
            </div>
          )}
        </div>

        {/* Selected Alert Detail Modal */}
        {selectedAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Alert Details</h3>
                  <Button variant="ghost" onClick={() => setSelectedAlert(null)}>✕</Button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Anganwadi Name</label>
                      <p className="text-lg font-semibold">{selectedAlert.properties?.awc_name || 'Unknown'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Severity Level</label>
                      <Badge variant={getAlertColor(getAlertSeverity(selectedAlert))}>
                        {getAlertSeverity(selectedAlert).toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">District</label>
                      <p>{selectedAlert.properties?.district || 'Unknown'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Village</label>
                      <p>{selectedAlert.properties?.village || 'Unknown'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nearest School Distance</label>
                    <p className="text-lg text-red-600 font-semibold">{selectedAlert.nearestSchoolDistance}km</p>
                  </div>
                  
                  {selectedAlert.blockingObstacles?.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Infrastructure Barriers</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedAlert.blockingObstacles.map((obstacle: string, idx: number) => (
                          <Badge key={idx} variant="secondary">{obstacle}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Alert Reason</label>
                    <p className="mt-1 p-3 bg-gray-50 rounded border">{selectedAlert.gapReason}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Recommended Actions</label>
                    <div className="mt-1 p-3 bg-blue-50 rounded border border-blue-200">
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Conduct detailed feasibility study for new primary school</li>
                        <li>Assess land availability within 3km radius</li>
                        <li>Evaluate transportation support alternatives</li>
                        <li>Coordinate with Education Department for resource allocation</li>
                        {selectedAlert.blockingObstacles?.length > 0 && (
                          <li>Address infrastructure barriers: {selectedAlert.blockingObstacles.join(', ')}</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Total {filteredAlerts.length} alert(s) • Last updated: {new Date().toLocaleString()}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={onExportAlertReport} className="bg-red-600 hover:bg-red-700">
              Export Alert Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};