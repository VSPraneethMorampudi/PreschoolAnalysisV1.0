import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Save,
  X,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (passwordData: any) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const { selectedLanguage } = useAppStore();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword =
        selectedLanguage === "hi"
          ? "वर्तमान पासवर्ड आवश्यक है"
          : "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword =
        selectedLanguage === "hi"
          ? "नया पासवर्ड आवश्यक है"
          : "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword =
        selectedLanguage === "hi"
          ? "पासवर्ड कम से कम 8 अक्षर का होना चाहिए"
          : "Password must be at least 8 characters long";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        selectedLanguage === "hi"
          ? "पासवर्ड की पुष्टि आवश्यक है"
          : "Password confirmation is required";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword =
        selectedLanguage === "hi"
          ? "पासवर्ड मेल नहीं खाते"
          : "Passwords do not match";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword =
        selectedLanguage === "hi"
          ? "नया पासवर्ड वर्तमान पासवर्ड से अलग होना चाहिए"
          : "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock validation - in real app, this would be an API call
      if (formData.currentPassword === "wrongpassword") {
        setErrors({
          currentPassword:
            selectedLanguage === "hi"
              ? "वर्तमान पासवर्ड गलत है"
              : "Current password is incorrect",
        });
        setIsLoading(false);
        return;
      }

      onSave(formData);
      onClose();

      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("ChangePasswordModal: Cancel button clicked");
    onClose();
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const strengthLabels =
      selectedLanguage === "hi"
        ? ["कमजोर", "कमजोर", "मध्यम", "अच्छा", "बहुत अच्छा"]
        : ["Weak", "Weak", "Medium", "Good", "Very Strong"];

    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
      "#F5330A",
    ];

    return {
      strength,
      label: strengthLabels[Math.min(strength - 1, 4)],
      color: colors[Math.min(strength - 1, 4)],
    };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          console.log("ChangePasswordModal: Dialog onOpenChange triggered");
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[450px] max-h-[90vh] flex flex-col p-0 z-[60]">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>
              {selectedLanguage === "hi" ? "पासवर्ड बदलें" : "Change Password"}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Security Notice */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {selectedLanguage === "hi"
                ? "अपने खाते की सुरक्षा के लिए एक मजबूत पासवर्ड का उपयोग करें।"
                : "Use a strong password to keep your account secure."}
            </AlertDescription>
          </Alert>

          <Card>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">
                    {selectedLanguage === "hi"
                      ? "वर्तमान पासवर्ड"
                      : "Current Password"}{" "}
                    *
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={(e) =>
                        handleInputChange("currentPassword", e.target.value)
                      }
                      placeholder={
                        selectedLanguage === "hi"
                          ? "वर्तमान पासवर्ड दर्ज करें"
                          : "Enter current password"
                      }
                      className={errors.currentPassword ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility("current")}
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-sm text-red-500 flex items-center">
                      <XCircle className="h-3 w-3 mr-1" />
                      {errors.currentPassword}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword">
                    {selectedLanguage === "hi" ? "नया पासवर्ड" : "New Password"}{" "}
                    *
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) =>
                        handleInputChange("newPassword", e.target.value)
                      }
                      placeholder={
                        selectedLanguage === "hi"
                          ? "नया पासवर्ड दर्ज करें"
                          : "Enter new password"
                      }
                      className={errors.newPassword ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility("new")}
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.newPassword && (
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                            style={{
                              width: `${
                                (passwordStrength.strength / 5) * 100
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">
                          {passwordStrength.label}
                        </span>
                      </div>
                    </div>
                  )}

                  {errors.newPassword && (
                    <p className="text-sm text-red-500 flex items-center">
                      <XCircle className="h-3 w-3 mr-1" />
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    {selectedLanguage === "hi"
                      ? "पासवर्ड की पुष्टि करें"
                      : "Confirm Password"}{" "}
                    *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      placeholder={
                        selectedLanguage === "hi"
                          ? "पासवर्ड की पुष्टि करें"
                          : "Confirm new password"
                      }
                      className={errors.confirmPassword ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility("confirm")}
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500 flex items-center">
                      <XCircle className="h-3 w-3 mr-1" />
                      {errors.confirmPassword}
                    </p>
                  )}

                  {formData.confirmPassword &&
                    formData.newPassword === formData.confirmPassword && (
                      <p className="text-sm text-green-500 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {selectedLanguage === "hi"
                          ? "पासवर्ड मेल खाते हैं"
                          : "Passwords match"}
                      </p>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
          <Separator className="mb-4" />

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              type="button"
            >
              <X className="h-4 w-4 mr-2" />
              {selectedLanguage === "hi" ? "रद्द करें" : "Cancel"}
            </Button>
            <Button onClick={handleSave} disabled={isLoading} type="button">
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {selectedLanguage === "hi" ? "सहेज रहे हैं..." : "Saving..."}
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {selectedLanguage === "hi"
                    ? "पासवर्ड बदलें"
                    : "Change Password"}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
