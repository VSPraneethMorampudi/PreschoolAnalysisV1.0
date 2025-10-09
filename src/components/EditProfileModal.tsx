import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, MapPin, Building2, Save, X } from "lucide-react";
import { useAppStore } from "@/lib/store";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: any) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const { selectedLanguage } = useAppStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    department: "",
    role: "",
  });

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name:
          selectedLanguage === "hi" ? "प्रणीत मोरमपुडी" : "Praneeth Morampudi",
        email: "praneeth.morampudi@chhattisgarh-gis.gov.in",
        phone: "+91-7680932739",
        location:
          selectedLanguage === "hi"
            ? "रायपुर, छत्तीसगढ़"
            : "Raipur, Chhattisgarh",
        department:
          selectedLanguage === "hi"
            ? "भू-सूचना विभाग"
            : "Geographic Information Department",
        role: selectedLanguage === "hi" ? "GIS विश्लेषक" : "GIS Analyst",
      });
    }
  }, [isOpen, selectedLanguage]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSave(formData);
    onClose();
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("EditProfileModal: Cancel button clicked");
    onClose();
  };

  const departments = [
    {
      value: "gis",
      label:
        selectedLanguage === "hi"
          ? "भू-सूचना विभाग"
          : "Geographic Information Department",
    },
    {
      value: "planning",
      label: selectedLanguage === "hi" ? "योजना विभाग" : "Planning Department",
    },
    {
      value: "revenue",
      label:
        selectedLanguage === "hi"
          ? "राजस्व विभाग"
          : "Education Department of Chhattisgarh",
    },
    {
      value: "forest",
      label: selectedLanguage === "hi" ? "वन विभाग" : "Forest Department",
    },
    {
      value: "water",
      label:
        selectedLanguage === "hi"
          ? "जल संसाधन विभाग"
          : "Water Resources Department",
    },
  ];

  const roles = [
    {
      value: "analyst",
      label: selectedLanguage === "hi" ? "GIS विश्लेषक" : "GIS Analyst",
    },
    {
      value: "manager",
      label: selectedLanguage === "hi" ? "GIS प्रबंधक" : "GIS Manager",
    },
    {
      value: "developer",
      label: selectedLanguage === "hi" ? "GIS डेवलपर" : "GIS Developer",
    },
    {
      value: "admin",
      label: selectedLanguage === "hi" ? "GIS प्रशासक" : "GIS Administrator",
    },
  ];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          console.log("EditProfileModal: Dialog onOpenChange triggered");
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col p-0 z-[60]">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <span>
              {selectedLanguage === "hi"
                ? "प्रोफ़ाइल संपादित करें"
                : "Edit Profile"}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardContent className="pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                {selectedLanguage === "hi"
                  ? "व्यक्तिगत जानकारी"
                  : "Personal Information"}
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      {selectedLanguage === "hi" ? "नाम" : "Name"} *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder={
                        selectedLanguage === "hi"
                          ? "अपना नाम दर्ज करें"
                          : "Enter your name"
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {selectedLanguage === "hi" ? "ईमेल" : "Email"} *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder={
                        selectedLanguage === "hi"
                          ? "अपना ईमेल दर्ज करें"
                          : "Enter your email"
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      {selectedLanguage === "hi" ? "फोन नंबर" : "Phone Number"}
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder={
                        selectedLanguage === "hi"
                          ? "फोन नंबर दर्ज करें"
                          : "Enter phone number"
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">
                      {selectedLanguage === "hi" ? "स्थान" : "Location"}
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      placeholder={
                        selectedLanguage === "hi"
                          ? "अपना स्थान दर्ज करें"
                          : "Enter your location"
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardContent className="pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                {selectedLanguage === "hi"
                  ? "पेशेवर जानकारी"
                  : "Professional Information"}
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="department">
                    {selectedLanguage === "hi" ? "विभाग" : "Department"} *
                  </Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) =>
                      handleInputChange("department", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          selectedLanguage === "hi"
                            ? "विभाग चुनें"
                            : "Select department"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.value} value={dept.label}>
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">
                    {selectedLanguage === "hi" ? "भूमिका" : "Role"} *
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange("role", value)}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          selectedLanguage === "hi"
                            ? "भूमिका चुनें"
                            : "Select role"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.label}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Action Buttons */}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel} type="button">
              <X className="h-4 w-4 mr-2" />
              {selectedLanguage === "hi" ? "रद्द करें" : "Cancel"}
            </Button>
            <Button onClick={handleSave} type="button">
              <Save className="h-4 w-4 mr-2" />
              {selectedLanguage === "hi" ? "सहेजें" : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
