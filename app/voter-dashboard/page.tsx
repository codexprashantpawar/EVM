"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Vote, LogOut, Clock, CheckCircle, AlertCircle, User, Calendar, MapPin, Shield } from "lucide-react"

// Mock data - replace with actual API calls
const mockVoter = {
  id: "V001",
  name: "John Doe",
  voterId: "ABC123456789",
  constituency: "Central District",
  hasVoted: false,
}

const mockElection = {
  id: "E001",
  title: "General Election 2024",
  description: "National Parliamentary Election",
  startTime: "2024-03-15T08:00:00",
  endTime: "2024-03-15T18:00:00",
  status: "active",
  candidates: [
    {
      id: "C001",
      name: "Alice Johnson",
      party: "Democratic Party",
      symbol: "🌟",
      color: "blue",
    },
    {
      id: "C002",
      name: "Bob Smith",
      party: "Republican Party",
      symbol: "🦅",
      color: "red",
    },
    {
      id: "C003",
      name: "Carol Williams",
      party: "Green Party",
      symbol: "🌱",
      color: "green",
    },
  ],
}

export default function VoterDashboard() {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleVoteSubmit = () => {
    if (selectedCandidate) {
      setShowConfirmation(true)
    }
  }

  const handleConfirmVote = () => {
    // API call to submit vote would go here
    alert("Vote submitted successfully!")
    setShowConfirmation(false)
    // Redirect or update state to show vote completed
  }

  const handleLogout = () => {
    window.location.href = "/"
  }

  if (showConfirmation) {
    const candidate = mockElection.candidates.find((c) => c.id === selectedCandidate)

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 p-4">
        <div className="max-w-2xl mx-auto pt-12">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center space-y-4">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-blue-900">Confirm Your Vote</CardTitle>
              <CardDescription className="text-lg">Please review your selection before submitting</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Election Details</h3>
                <p className="text-blue-800">{mockElection.title}</p>
                <p className="text-sm text-blue-600">{mockElection.description}</p>
              </div>

              <div className="bg-pink-50 p-6 rounded-lg border border-pink-200">
                <h3 className="font-semibold text-blue-900 mb-2">Your Selected Candidate</h3>
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{candidate?.symbol}</div>
                  <div>
                    <p className="font-semibold text-blue-900">{candidate?.name}</p>
                    <p className="text-sm text-gray-600">{candidate?.party}</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  className="flex-1 h-12 bg-transparent"
                  onClick={() => setShowConfirmation(false)}
                >
                  Go Back
                </Button>
                <Button className="flex-1 h-12 bg-green-600 hover:bg-green-700" onClick={handleConfirmVote}>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Confirm Vote
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

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
                <h1 className="text-xl font-bold text-blue-900">Voter Dashboard</h1>
                <p className="text-sm text-gray-600">Your Vote Matters</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="text-blue-600 border-blue-200 bg-transparent">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-600 to-pink-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Welcome, {mockVoter.name}!</h2>
                  <p className="text-blue-100">Ready to make your voice heard in the democratic process</p>
                </div>
                <div className="bg-white/20 p-4 rounded-full">
                  <User className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Voter Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Voter Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {mockVoter.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-blue-900">{mockVoter.name}</p>
                    <p className="text-sm text-gray-600">ID: {mockVoter.voterId}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {mockVoter.constituency}
                  </div>
                  <div className="flex items-center text-sm">
                    {mockVoter.hasVoted ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Vote Submitted
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-orange-600 border-orange-200">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending Vote
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Election Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Election Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-blue-900">{mockElection.title}</p>
                    <p className="text-sm text-gray-600">{mockElection.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600">Election Active</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    <p>Started: March 15, 2024 at 8:00 AM</p>
                    <p>Ends: March 15, 2024 at 6:00 PM</p>
                  </div>
                  <Progress value={65} className="h-2" />
                  <p className="text-xs text-gray-500">Election progress: 65% complete</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Voting Section */}
          <div className="lg:col-span-2">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-900">Cast Your Vote</CardTitle>
                <CardDescription className="text-lg">
                  Select your preferred candidate for {mockElection.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mockVoter.hasVoted ? (
                  <div className="text-center py-12">
                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-blue-900 mb-2">Vote Already Submitted</h3>
                    <p className="text-gray-600">Thank you for participating in the democratic process!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid gap-4">
                      {mockElection.candidates.map((candidate) => (
                        <Card
                          key={candidate.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedCandidate === candidate.id ? "ring-2 ring-pink-500 bg-pink-50" : "hover:bg-blue-50"
                          }`}
                          onClick={() => setSelectedCandidate(candidate.id)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="text-4xl">{candidate.symbol}</div>
                                <div>
                                  <h3 className="text-lg font-semibold text-blue-900">{candidate.name}</h3>
                                  <p className="text-gray-600">{candidate.party}</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                {selectedCandidate === candidate.id && (
                                  <CheckCircle className="h-6 w-6 text-pink-600" />
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="flex justify-center pt-6">
                      <Button
                        size="lg"
                        className="px-12 h-12 bg-blue-600 hover:bg-pink-600 transition-colors"
                        disabled={!selectedCandidate}
                        onClick={handleVoteSubmit}
                      >
                        <Vote className="h-5 w-5 mr-2" />
                        Submit Vote
                      </Button>
                    </div>

                    {selectedCandidate && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-5 w-5 text-blue-600" />
                          <p className="text-sm text-blue-800">
                            <strong>Important:</strong> Once you submit your vote, it cannot be changed. Please review
                            your selection carefully.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
