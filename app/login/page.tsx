"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, ArrowLeft, UserCheck } from "lucide-react"
import axios from "axios"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const loginResponse = await axios.post(`http://localhost:8081/login/${username}`, password, {
        headers: { "Content-Type": "text/plain" },
      })

      const data = loginResponse.data?.toString();

      if (data === "-2") {
        alert("User not found!\nPlease check your username and try again.");
        setIsLoading(false);
        return;
      } else if (data === "-3") {
        alert(
          "Multiple user accounts found!\nContact your election administrator for support."
        );
        setIsLoading(false);
        return;
      } else if (data === "-4") {
        alert(
          "Incorrect password!\nPlease re-enter your password and try again."
        );
        setIsLoading(false);
        return;
      }

      const [id, userRole] = data.split(",")

      localStorage.setItem("userId", id)
      localStorage.setItem("userRole", userRole)
      localStorage.setItem("username", username)

      if (userRole === "1") {
        window.location.href = "/dashboard/voter"
      } else if (userRole === "2") {
        window.location.href = "/dashboard/admin"
      } else {
        alert("Unknown role!")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Login failed:", error)
      alert("Login failed! Please check your connection.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 text-blue-600 hover:text-pink-600"
          onClick={() => (window.location.href = "/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-blue-100">
              <UserCheck className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl text-blue-900">Login to E-EVM</CardTitle>
              <CardDescription className="text-base mt-2">Sign in to access your dashboard</CardDescription>
            </div>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              Secure Authentication
            </Badge>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
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
                <Label htmlFor="password" className="text-blue-900 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 border-blue-200 focus:border-blue-400 focus:ring-blue-400 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-pink-600 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="text-center">
                <Button
                  variant="link"
                  className="text-blue-600 hover:text-pink-600 p-0"
                  onClick={() => (window.location.href = "/forgot-password")}
                >
                  Forgot Password?
                </Button>
              </div>

              <div className="text-center border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Don't have an account?</p>
                <Button
                  variant="outline"
                  className="w-full border-pink-200 text-pink-600 hover:bg-pink-50 bg-transparent"
                  onClick={() => (window.location.href = "/register")}
                >
                  Register as New Voter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
