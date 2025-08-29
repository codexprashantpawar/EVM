"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Vote, Shield, Users, BarChart3, LogIn } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Vote className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-900">
                  ElectoNet System
                </h1>
                <p className="text-sm text-gray-600">
                  Electronic Election Voting Machine
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                variant="outline"
                className="text-blue-600 border-blue-200">
                Secure & Transparent
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                onClick={() => (window.location.href = "/login")}>
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            Welcome to the Future of Voting
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience secure, transparent, and efficient elections with our
            modern Electronic Voting Machine system. Your vote matters, and we
            ensure it counts.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="border-blue-100 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-blue-900">Secure Voting</CardTitle>
              <CardDescription>
                Advanced encryption and security measures protect every vote
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-pink-100 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-pink-600" />
              </div>
              <CardTitle className="text-blue-900">User Friendly</CardTitle>
              <CardDescription>
                Intuitive interface designed for voters of all backgrounds
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-blue-100 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-blue-900">Real-time Results</CardTitle>
              <CardDescription>
                Instant vote counting and transparent result reporting
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Access Portal */}
        <Card className="max-w-2xl mx-auto bg-white shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-blue-900">
              Access Your Portal
            </CardTitle>
            <CardDescription className="text-lg">
              Login to access your dashboard or register as a new voter
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                size="lg"
                className="h-20 bg-blue-600 hover:bg-pink-600 transition-colors"
                onClick={() => (window.location.href = "/login")}>
                <div className="text-center">
                  <LogIn className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-semibold">Login</div>
                  <div className="text-sm opacity-90">Access your account</div>
                </div>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-20 border-pink-200 hover:bg-pink-50 hover:border-pink-300 transition-colors bg-transparent"
                onClick={() => (window.location.href = "/register")}>
                <div className="text-center text-blue-900">
                  <Users className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-semibold">Register</div>
                  <div className="text-sm opacity-70">
                    New voter registration
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-blue-100">
            © 2025 ElectoNet System. Ensuring democratic participation through
            secure technology.
          </p>
        </div>
      </footer>
    </div>
  );
}
