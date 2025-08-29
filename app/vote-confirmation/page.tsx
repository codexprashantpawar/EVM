"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Vote, User, Calendar, Home } from "lucide-react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

export default function VoteConfirmationPage() {
  const searchParams = useSearchParams()
  const [candidate, setCandidate] = useState("")
  const [election, setElection] = useState("")

  useEffect(() => {
    setCandidate(searchParams.get("candidate") || "")
    setElection(searchParams.get("election") || "")
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-green-200">
          <CardHeader className="text-center">
            <div className="bg-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl text-green-900">Vote Confirmed!</CardTitle>
            <CardDescription className="text-lg">Your vote has been successfully recorded</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Vote Details */}
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <div className="flex items-center space-x-3">
                <Vote className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">Election</p>
                  <p className="text-blue-900 font-semibold">{election}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">Selected Candidate</p>
                  <p className="text-blue-900 font-semibold">{candidate}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">Vote Cast On</p>
                  <p className="text-blue-900 font-semibold">{new Date().toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center space-y-3">
              <h3 className="text-lg font-semibold text-blue-900">Thank You for Voting!</h3>
              <p className="text-gray-600">
                Your vote has been securely recorded and your voting token has been used. You cannot vote again in this
                election.
              </p>
            </div>

            {/* Security Notice */}
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Security Notice:</strong> Your voting token has been permanently invalidated to prevent
                duplicate voting. This ensures election integrity.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link href="/dashboard/voter">
                <Button className="w-full bg-blue-600 hover:bg-pink-600 transition-colors">Return to Dashboard</Button>
              </Link>

              <Link href="/">
                <Button variant="outline" className="w-full border-blue-200 text-blue-600 bg-transparent">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
