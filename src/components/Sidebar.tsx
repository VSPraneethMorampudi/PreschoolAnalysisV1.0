import React from "react";
import {
  Layers,
  Pencil,
  Calculator,
  Filter,
  MapPin,
  Building,
  Users,
  School,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";

interface SidebarProps {
  onLayerSelectionChange: (layers: string[]) => void;
  // New props for enhanced functionality
  layersVisibility?: any;
  toggleLayer?: (layerId: string) => void;
  districtOptions?: any[];
  villageOptions?: any[];
  selectedDistrict?: any;
  selectedVillage?: string;
  onDistrictChange?: (district: any) => void;
  onVillageChange?: (village: string) => void;
  bufferRadius?: number;
  setBufferRadius?: (radius: number) => void;
  highlightSchoolsInBuffers?: () => void;
  generateBufferReport?: () => void;
  connectAnganwadiToNearestSchool?: () => void;
  onClearMap?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onLayerSelectionChange,
  layersVisibility = {},
  toggleLayer = () => {},
  districtOptions = [],
  villageOptions = [],
  selectedDistrict,
  selectedVillage = "",
  onDistrictChange = () => {},
  onVillageChange = () => {},
  bufferRadius = 0.5,
  setBufferRadius = () => {},
  highlightSchoolsInBuffers = () => {},
  generateBufferReport = () => {},
  connectAnganwadiToNearestSchool = () => {},
  onClearMap = () => {},
}) => {
  const {
    selectedLanguage,
    activeSidebarTab,
    secondarySidebarOpen,
    toggleSecondarySidebar,
    setActiveSidebarTab,
  } = useAppStore();

  const handleToolClick = (tab: "layers" | "draw" | "analysis" | "filters") => {
    setActiveSidebarTab(tab as any);
    if (!secondarySidebarOpen) {
      toggleSecondarySidebar();
    }
  };

  // Enhanced error handling for report generation
  const handleGenerateReport = () => {
    console.log("Generate Report button clicked");

    if (generateBufferReport && typeof generateBufferReport === "function") {
      try {
        const data = generateBufferReport();
        console.log("Report data:", data);

        if (data && Array.isArray(data) && data.length > 0) {
          // Create and download CSV
          const csvEsc = (v: any) => `"${String(v).replace(/"/g, '""')}"`;
          const rows = [
            [
              "Anganwadi Name",
              "District",
              "Village",
              "Number of Schools",
              "Schools",
              "Distance to Nearest School",
            ],
            ...data.map((r: any) => [
              r.anganwadiName,
              r.district,
              r.village,
              r.numberOfSchools,
              (r.schoolNames || []).join("; "),
              r.distance || "-",
            ]),
          ];
          const csv = rows.map((row) => row.map(csvEsc).join(",")).join("\n");
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `anganwadi_buffer_report_${new Date()
            .toISOString()
            .slice(0, 10)}.csv`;
          link.click();
        } else {
          alert("No data available for report generation");
        }
      } catch (error) {
        console.error("Error generating report:", error);
        alert("Error generating report: " + (error as Error).message);
      }
    } else {
      console.error("generateBufferReport function is not available");
      alert(
        "Report generation function is not available. Please wait for the map to load completely."
      );
    }
  };

  const layerItems = [
    {
      id: "state",
      name: "State Boundary",
      icon: MapPin,
      color: "#000",
      description: "Chhattisgarh state outline",
    },
    {
      id: "district",
      name: "District Boundary",
      icon: Building,
      color: "#e53935",
      description: "Administrative district boundaries",
    },
    {
      id: "village",
      name: "Village Boundary",
      icon: Users,
      color: "#1e88e5",
      description: "Village-level administrative boundaries",
    },
    {
      id: "anganwadi",
      name: "Anganwadi Centers",
      icon: School,
      color: "#43a047",
      description: "Educational centers with service coverage",
    },
    {
      id: "schools",
      name: "Primary Schools",
      icon: School,
      color: "#2196f3",
      description: "Primary educational institutions",
    },
    {
      id: "gap",
      name: "Gap Analysis",
      icon: AlertTriangle,
      color: "#d32f2f",
      description: "Areas not covered by services",
    },
  ];

  return (
    <>
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <aside
        className="hidden lg:flex fixed lg:relative top-0 left-0 h-[calc(100vh-3rem)] w-12 border-r border-gray-200 shadow-xl lg:shadow-none z-50 flex-col"
        style={{
          backgroundImage: "url(/images/Mining Sidebar Background.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Collapsed Sidebar with Icons */}
        <div className="h-full flex flex-col lg:block">
          {/* Collapsed Tool Icons */}
          <div className="flex-1 flex flex-col space-y-1 p-1">
            <Button
              variant={activeSidebarTab === "layers" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleToolClick("layers")}
              className={`h-10 w-10 p-0 ${
                activeSidebarTab === "layers"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "hover:bg-gray-100"
              }`}
              title={selectedLanguage === "hi" ? "परतें" : "Layers"}
            >
              <Layers className="h-4 w-4" />
            </Button>

            <Button
              variant={activeSidebarTab === "filters" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleToolClick("filters")}
              className={`h-10 w-10 p-0 ${
                activeSidebarTab === "filters"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "hover:bg-gray-100"
              }`}
              title={selectedLanguage === "hi" ? "फिल्टर" : "Filters"}
            >
              <Filter className="h-4 w-4" />
            </Button>

            <Button
              variant={activeSidebarTab === "draw" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleToolClick("draw")}
              className={`h-10 w-10 p-0 ${
                activeSidebarTab === "draw"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "hover:bg-gray-100"
              }`}
              title={selectedLanguage === "hi" ? "ड्रा" : "Draw"}
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <Button
              variant={activeSidebarTab === "analysis" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleToolClick("analysis")}
              className={`h-10 w-10 p-0 ${
                activeSidebarTab === "analysis"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "hover:bg-gray-100"
              }`}
              title={selectedLanguage === "hi" ? "विश्लेषण" : "Analysis"}
            >
              <Calculator className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
