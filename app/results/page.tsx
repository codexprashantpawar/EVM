"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, BarChart3, Users, Vote, ArrowLeft, Download, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function ResultsPage() {
  const [election, setElection] = useState<any>(null)
  const [results, setResults] = useState<any>({
    totalVotes: 0,
    candidates: [],
    parties: [],
    turnout: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    setLoading(true)
    try {
      // API call placeholder - user will implement
      const response = await fetch("/api/results/current")
      const data = await response.json()

      setElection(data.election)
      setResults(data.results)
    } catch (err) {
      console.error("Failed to fetch results:", err)
    } finally {
      setLoading(false)
    }
  }

  const exportResults = () => {
    // Export functionality placeholder
    console.log("Exporting results...")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading election results...</p>
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
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-900">Election Results</h1>
                <p className="text-sm text-gray-600">{election?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={exportResults} variant="outline" size="sm" className="border-blue-200 bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={fetchResults} variant="outline" size="sm" className="border-blue-200 bg-transparent">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Link href="/">
                <Button variant="outline" size="sm" className="border-blue-200 bg-transparent">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Election Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-900">{election?.name}</CardTitle>
            <CardDescription>{election?.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-900">{results.totalVotes}</div>
                <p className="text-sm text-gray-600">Total Votes Cast</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-900">{results.turnout}%</div>
                <p className="text-sm text-gray-600">Voter Turnout</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-900">{results.candidates?.length}</div>
                <p className="text-sm text-gray-600">Candidates</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-900">{results.parties?.length}</div>
                <p className="text-sm text-gray-600">Parties</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Tabs */}
        <Tabs defaultValue="candidates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="candidates">Candidate Results</TabsTrigger>
            <TabsTrigger value="parties">Party Results</TabsTrigger>
          </TabsList>

          <TabsContent value="candidates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <Users className="h-5 w-5 mr-2" />
                  Candidate-wise Results
                </CardTitle>
                <CardDescription>Vote count and percentage for each candidate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {results.candidates?.map((candidate: any, index: number) => {
                    const percentage = results.totalVotes > 0 ? (candidate.votes / results.totalVotes) * 100 : 0
                    const isWinner = index === 0

                    return (
                      <div key={candidate.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {isWinner && <Trophy className="h-5 w-5 text-yellow-500" />}
                            <div>
                              <h3 className="font-semibold text-blue-900">{candidate.name}</h3>
                              <p className="text-sm text-gray-600">{candidate.party}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-900">{candidate.votes}</div>
                            <div className="text-sm text-gray-600">{percentage.toFixed(1)}%</div>
                          </div>
                        </div>

                        <Progress value={percentage} className="h-3" />

                        <div className="flex justify-between items-center">
                          <Badge variant={isWinner ? "default" : "outline"} className={isWinner ? "bg-yellow-500" : ""}>
                            {isWinner ? "Winner" : `#${index + 1}`}
                          </Badge>
                          <Badge variant="outline" className="text-pink-600 border-pink-200">
                            {candidate.party}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parties" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Party-wise Results
                </CardTitle>
                <CardDescription>Vote distribution by political parties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {results.parties?.map((party: any, index: number) => {
                    const percentage = results.totalVotes > 0 ? (party.votes / results.totalVotes) * 100 : 0
                    const isLeading = index === 0

                    return (
                      <div key={party.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded ${index % 2 === 0 ? "bg-blue-500" : "bg-pink-500"}`} />
                            <div>
                              <h3 className="font-semibold text-blue-900">{party.name}</h3>
                              <p className="text-sm text-gray-600">{party.abbreviation}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-900">{party.votes}</div>
                            <div className="text-sm text-gray-600">{percentage.toFixed(1)}%</div>
                          </div>
                        </div>

                        <Progress value={percentage} className="h-3" />

                        <div className="flex justify-between items-center">
                          <Badge variant={isLeading ? "default" : "outline"}>
                            {isLeading ? "Leading Party" : `#${index + 1}`}
                          </Badge>
                          <div className="text-sm text-gray-600">
                            {party.candidateCount} candidate{party.candidateCount !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Election Status */}
        <Card className="mt-8">
          <CardContent className="text-center py-8">
            <Vote className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Election Completed</h3>
            <p className="text-gray-600 mb-4">Results are final and have been verified by election officials.</p>
            <Badge variant="outline" className="text-green-600 border-green-200">
              Status: {election?.status || "Completed"}
            </Badge>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
