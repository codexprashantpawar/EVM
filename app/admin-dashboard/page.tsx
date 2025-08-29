"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Shield, LogOut, Users, Vote, BarChart3, Plus, Calendar, Eye, Settings, TrendingUp } from "lucide-react"

// Mock data - replace with actual API calls
const mockElectionStats = {
  totalVotes: 15420,
  totalVoters: 25000,
  turnoutPercentage: 61.68,
  activeElections: 1,
  completedElections: 3,
}

const mockPartyResults = [
  { party: "Democratic Party", votes: 6850, percentage: 44.4, color: "blue" },
  { party: "Republican Party", votes: 5320, percentage: 34.5, color: "red" },
  { party: "Green Party", votes: 2180, percentage: 14.1, color: "green" },
  { party: "Independent", votes: 1070, percentage: 6.9, color: "gray" },
]

const mockCandidateResults = [
  { name: "Alice Johnson", party: "Democratic Party", votes: 6850, percentage: 44.4 },
  { name: "Bob Smith", party: "Republican Party", votes: 5320, percentage: 34.5 },
  { name: "Carol Williams", party: "Green Party", votes: 2180, percentage: 14.1 },
  { name: "David Brown", party: "Independent", votes: 1070, percentage: 6.9 },
]

const mockCurrentElection = {
  id: "E001",
  title: "General Election 2024",
  description: "National Parliamentary Election",
  startDate: "2024-03-15",
  endDate: "2024-03-15",
  status: "active",
  candidates: [
    { id: "C001", name: "Alice Johnson", party: "Democratic Party" },
    { id: "C002", name: "Bob Smith", party: "Republican Party" },
    { id: "C003", name: "Carol Williams", party: "Green Party" },
    { id: "C004", name: "David Brown", party: "Independent" },
  ],
}

export default function AdminDashboard() {
  const [showAddElection, setShowAddElection] = useState(false)
  const [showAddParty, setShowAddParty] = useState(false)
  const [showAddCandidate, setShowAddCandidate] = useState(false)
  const [showCandidateList, setShowCandidateList] = useState(false)

  const handleLogout = () => {
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-pink-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Election Management - Secure, Efficient, Transparent</p>
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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Votes</p>
                  <p className="text-3xl font-bold">{mockElectionStats.totalVotes.toLocaleString()}</p>
                </div>
                <Vote className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-pink-600 to-pink-700 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm">Total Voters</p>
                  <p className="text-3xl font-bold">{mockElectionStats.totalVoters.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-pink-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Turnout</p>
                  <p className="text-3xl font-bold">{mockElectionStats.turnoutPercentage}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Active Elections</p>
                  <p className="text-3xl font-bold">{mockElectionStats.activeElections}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Management Actions */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Manage elections, parties, and candidates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog open={showAddElection} onOpenChange={setShowAddElection}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-blue-600 hover:bg-pink-600 transition-colors">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Election
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Election</DialogTitle>
                      <DialogDescription>Set up a new election with details and timeline</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="election-title">Election Title</Label>
                        <Input id="election-title" placeholder="e.g., General Election 2024" />
                      </div>
                      <div>
                        <Label htmlFor="election-description">Description</Label>
                        <Textarea id="election-description" placeholder="Brief description of the election" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="start-date">Start Date</Label>
                          <Input id="start-date" type="date" />
                        </div>
                        <div>
                          <Label htmlFor="end-date">End Date</Label>
                          <Input id="end-date" type="date" />
                        </div>
                      </div>
                      <Button className="w-full">Create Election</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showAddParty} onOpenChange={setShowAddParty}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Party
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Party</DialogTitle>
                      <DialogDescription>Register a new political party</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="party-name">Party Name</Label>
                        <Input id="party-name" placeholder="e.g., Democratic Party" />
                      </div>
                      <div>
                        <Label htmlFor="party-symbol">Party Symbol</Label>
                        <Input id="party-symbol" placeholder="e.g., 🌟" />
                      </div>
                      <div>
                        <Label htmlFor="party-color">Party Color</Label>
                        <Input id="party-color" type="color" />
                      </div>
                      <Button className="w-full">Add Party</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showAddCandidate} onOpenChange={setShowAddCandidate}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Candidate
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Candidate</DialogTitle>
                      <DialogDescription>Register a candidate for the election</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="candidate-name">Candidate Name</Label>
                        <Input id="candidate-name" placeholder="e.g., John Doe" />
                      </div>
                      <div>
                        <Label htmlFor="candidate-party">Party</Label>
                        <Input id="candidate-party" placeholder="e.g., Democratic Party" />
                      </div>
                      <div>
                        <Label htmlFor="candidate-constituency">Constituency</Label>
                        <Input id="candidate-constituency" placeholder="e.g., Central District" />
                      </div>
                      <Button className="w-full">Add Candidate</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowCandidateList(true)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Current Election
                </Button>
              </CardContent>
            </Card>

            {/* Current Election Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Current Election
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-blue-900">{mockCurrentElection.title}</p>
                    <p className="text-sm text-gray-600">{mockCurrentElection.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    <p>Date: {mockCurrentElection.startDate}</p>
                    <p>Candidates: {mockCurrentElection.candidates.length}</p>
                  </div>
                  <Progress value={65} className="h-2" />
                  <p className="text-xs text-gray-500">Election progress: 65% complete</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results and Analytics */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="party-results" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="party-results">Party-wise Results</TabsTrigger>
                <TabsTrigger value="candidate-results">Candidate-wise Results</TabsTrigger>
              </TabsList>

              <TabsContent value="party-results">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-900 flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Party-wise Vote Distribution
                    </CardTitle>
                    <CardDescription>Real-time results by political party</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {mockPartyResults.map((party, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded-full bg-${party.color}-500`}></div>
                              <span className="font-medium text-blue-900">{party.party}</span>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-blue-900">{party.votes.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">{party.percentage}%</p>
                            </div>
                          </div>
                          <Progress value={party.percentage} className="h-3" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="candidate-results">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-900 flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Candidate-wise Results
                    </CardTitle>
                    <CardDescription>Individual candidate performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockCandidateResults.map((candidate, index) => (
                        <Card key={index} className="border border-blue-100">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold text-blue-900">{candidate.name}</p>
                                <p className="text-sm text-gray-600">{candidate.party}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-blue-900">{candidate.votes.toLocaleString()}</p>
                                <p className="text-sm text-gray-600">{candidate.percentage}%</p>
                              </div>
                            </div>
                            <Progress value={candidate.percentage} className="h-2 mt-2" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Candidate List Modal */}
        <Dialog open={showCandidateList} onOpenChange={setShowCandidateList}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Current Election Candidates</DialogTitle>
              <DialogDescription>{mockCurrentElection.title} - Candidate List</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {mockCurrentElection.candidates.map((candidate, index) => (
                <Card key={candidate.id} className="border border-blue-100">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-blue-900">{candidate.name}</p>
                        <p className="text-sm text-gray-600">{candidate.party}</p>
                      </div>
                      <Badge variant="outline" className="text-blue-600 border-blue-200">
                        Candidate #{index + 1}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
