"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { KeyRound, ArrowLeft, Mail, Check } from "lucide-react";

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState("");
  const [voterID, setVoterID] = useState("");
  const [newPassword, setNewPassword] = useState(""); // ✅ added state
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8081/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: username,
          voterId: voterID,
          newPassword: newPassword, // 👈 now properly handled
        }).toString(),
      });

      const result = await response.text(); // backend returns int, not JSON
      if (result === "1") {
        setIsSubmitted(true); // success
      } else if (result === "-2") {
        alert("User not found");
      } else if (result === "-3") {
        alert("Invalid Voter ID");
      } else {
        alert("Error occurred, please try again");
      }
    } catch (error) {
      console.error("Password reset failed:", error);
      alert("Server error, please try later");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-green-100">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-2xl text-blue-900">
                  Request Submitted
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Your password reset request has been submitted successfully.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800">
                      <strong>What happens next?</strong>
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Please contact your election administrator with your
                      request details. They will verify your identity and
                      provide you with new login credentials.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-blue-900">
                  Your Request Details:
                </p>
                <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                  <p className="text-sm">
                    <strong>Username:</strong> {username}
                  </p>
                  <p className="text-sm">
                    <strong>Voter ID:</strong> {voterID}
                  </p>
                  <p className="text-sm">
                    <strong>New Password:</strong> {newPassword}
                  </p>
                </div>
              </div>

              <Button
                className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-pink-600 transition-colors"
                onClick={() => (window.location.href = "/login")}>
                Back to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 text-blue-600 hover:text-pink-600"
          onClick={() => (window.location.href = "/login")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </Button>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-orange-100">
              <KeyRound className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-2xl text-blue-900">
                Forgot Password
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Request a password reset for your account
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="text-orange-600 border-orange-200">
              Password Recovery
            </Badge>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-blue-900 font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-12 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="voterID" className="text-blue-900 font-medium">
                  Voter ID Number
                </Label>
                <Input
                  id="voterID"
                  type="text"
                  placeholder="Enter your Voter ID for verification"
                  value={voterID}
                  onChange={(e) => setVoterID(e.target.value)}
                  required
                  className="h-12 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>

              {/* ✅ New Password Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="newPassword"
                  className="text-blue-900 font-medium">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="h-12 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> After submitting this request, please
                  contact your election administrator to complete the password
                  reset process. You will need to verify your identity.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg font-semibold bg-orange-600 hover:bg-blue-600 transition-colors"
                disabled={isLoading}>
                {isLoading ? "Submitting Request..." : "Submit Reset Request"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">
                Remember your password?
              </p>
              <Button
                variant="link"
                className="text-blue-600 hover:text-pink-600 p-0"
                onClick={() => (window.location.href = "/login")}>
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
