"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trophy, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  LogOut,
  BarChart3,
  Users,
  Vote,
  Calendar,
  TrendingUp,
  Settings,
  Plus,
  Eye,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Confetti from "react-confetti"; // 🎉 celebration effect

// ✅ Matches /GetElectionVoteCount API
type Candidate = {
  candidateId: number;
  candidateName: string;
  partyName: string;
  votes: number;
};

// ✅ Matches /GetAllElection API
type Election = {
  electionid: number;
  electionname: string;
  startdate?: string;
  enddate?: string;
  recordstatus?: string;
  candidates?: Candidate[];
};

type Party = {
  id: number;
  partyname: string;
  recordstatus: string;
};

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  const [partyName, setPartyName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"success" | "error" | "info" | "">("");
  const [parties, setParties] = useState<
    { partyid: number; partyname: string }[]
  >([]);
  const [candidateName, setCandidateName] = useState("");
  const [candidatePartyId, setCandidatePartyId] = useState<string>("");
  const [candidateMessage, setCandidateMessage] = useState("");
  const [candidateStatus, setCandidateStatus] = useState<
    "success" | "error" | "info" | ""
  >("");

  const [electionName, setElectionName] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [elections, setElections] = useState<Election[]>([]);

  // Election & Candidate Data from API
  const [apiElections, setApiElections] = useState<Election[]>([]);

  // Stats
  const [totalVotesAPI, setTotalVotesAPI] = useState(0);
  const [activeElectionsAPI, setActiveElectionsAPI] = useState(0);
  const [completedElectionsAPI, setCompletedElectionsAPI] = useState(0);

  const [selectedCandidateId, setSelectedCandidateId] = useState<number | "">(
    ""
  );
  const [selectedElectionId, setSelectedElectionId] = useState<number | "">("");

  const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#facc15", "#9333ea"];
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("userRole");
    const username = localStorage.getItem("username");

    if (!userId || userRole !== "2") {
      router.push("/login?role=admin");
      return;
    }

    setUser({
      id: userId,
      username: username || "",
      role: userRole,
      name: username
        ? username.charAt(0).toUpperCase() + username.slice(1)
        : "Admin",
    });
  }, [router]);

  // fetch active parties
  useEffect(() => {
    const fetchParties = async () => {
      try {
        const res = await fetch("http://localhost:8081/GetAllParty");
        const data = await res.json();
        setParties(data);
      } catch (error) {
        console.error("Failed to load parties", error);
      }
    };

    fetchParties();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all candidates
        const candidateRes = await fetch(
          "http://localhost:8081/GetAllCandidate"
        );
        const rawCandidates = await candidateRes.json();

        // Transform backend fields → match your Candidate type
        const formattedCandidates: Candidate[] = rawCandidates.map(
          (c: any) => ({
            candidateId: c.id,
            candidateName: c.candidatename,
            partyName: c.party?.partyname || "",
            votes: 0, // backend doesn’t return votes here, so default
          })
        );
        setCandidates(formattedCandidates);

        // Fetch all elections (this already matches your Election type)
        const electionRes = await fetch("http://localhost:8081/GetAllElection");
        setElections(await electionRes.json());
      } catch (err) {
        console.error(err);
        alert("❌ Error fetching candidates or elections!");
      }
    };

    fetchData();
  }, []);

  // Get All Party and Active Election Count
  useEffect(() => {
    const fetchElectionsAndVotes = async () => {
      try {
        // 1️⃣ Fetch all elections
        const electionRes = await fetch("http://localhost:8081/GetAllElection");
        const electionsData: Election[] = await electionRes.json();

        // 2️⃣ For each election, fetch candidate vote counts
        const electionsWithVotes = await Promise.all(
          electionsData.map(async (election) => {
            const voteRes = await fetch(
              `http://localhost:8081/GetElectionVoteCount/${election.electionid}`
            );
            const candidatesData: Candidate[] = await voteRes.json();
            return { ...election, candidates: candidatesData };
          })
        );

        // 3️⃣ Update state
        setApiElections(electionsWithVotes);

        // 4️⃣ Calculate total votes
        const totalVotes = electionsWithVotes.reduce(
          (sum, e) =>
            sum +
            (e.candidates?.reduce((s, c) => s + Number(c.votes ?? 0), 0) || 0),
          0
        );

        // 5️⃣ Count active/completed elections
        const now = new Date();
        let activeCount = 0;
        let completedCount = 0;

        electionsWithVotes.forEach((e) => {
          const start = e.startdate ? new Date(e.startdate) : null;
          const end = e.enddate ? new Date(e.enddate) : null;

          if (start && end && start <= now && end >= now) activeCount++;
          else if (end && end < now) completedCount++;
        });

        // 6️⃣ Set stats
        setTotalVotesAPI(totalVotes);
        setActiveElectionsAPI(activeCount);
        setCompletedElectionsAPI(completedCount);
      } catch (err) {
        console.error("Error fetching elections or votes:", err);
      }
    };

    fetchElectionsAndVotes();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    router.push("/");
  };

  const handleAddParty = async () => {
    if (!partyName.trim()) {
      setMessage("Please enter a party name");
      setStatus("info");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/addparty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partyname: partyName }),
      });

      const code = await response.text();

      if (code === "1") {
        setMessage("Party added successfully!");
        setStatus("success");
        setPartyName(""); // clear input
      } else if (code === "-1") {
        setMessage("Party already exists!");
        setStatus("error");
      } else {
        setMessage("Something went wrong");
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error connecting to server");
      setStatus("error");
    }
  };

  const handleAddCandidate = async () => {
    if (!candidateName.trim() || !candidatePartyId) {
      setCandidateMessage("Please enter candidate name and select a party");
      setCandidateStatus("info");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8081/addcandidate/${candidatePartyId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ candidatename: candidateName }),
        }
      );

      const code = await response.text();
      const result = parseInt(code, 10); // ✅ ensure it's an integer

      if (result === 1) {
        setCandidateMessage("Candidate added successfully!");
        setCandidateStatus("success");
        setCandidateName("");
        setCandidatePartyId("");
      } else if (result === -1) {
        setCandidateMessage("Candidate already exists!");
        setCandidateStatus("error");
      } else if (result === -3) {
        setCandidateMessage("Party not found!");
        setCandidateStatus("error");
      } else {
        setCandidateMessage("Something went wrong");
        setCandidateStatus("error");
      }
    } catch (error) {
      console.error(error);
      setCandidateMessage("Error connecting to server");
      setCandidateStatus("error");
    }
  };

  const handleAssignElection = async () => {
    if (!selectedCandidateId) {
      alert("⚠️ Please select a candidate!");
      return;
    }
    if (!selectedElectionId) {
      alert("⚠️ Please select an election!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8081/assignelection/${selectedCandidateId}/${selectedElectionId}`,
        { method: "POST" }
      );

      const code = await response.text();

      if (code === "1") {
        alert("✅ Election assigned successfully!");
        setSelectedCandidateId("");
        setSelectedElectionId("");
      } else if (code === "-1") {
        alert("⚠️ This candidate is already assigned to this election!");
      } else if (code === "-3") {
        alert("⚠️ Candidate or Election not found!");
      } else {
        alert("❌ Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error connecting to server!");
    }
  };

  const handleAddElection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!electionName.trim()) {
      alert("⚠️ Please enter election name!");
      return;
    }

    if (!startDate) {
      alert("⚠️ Please select a start date & time!");
      return;
    }

    if (!endDate) {
      alert("⚠️ Please select an end date & time!");
      return;
    }
    try {
      const response = await fetch("http://localhost:8081/addelection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          electionname: electionName,
          startdate: startDate,
          enddate: endDate,
        }),
      });

      const code = await response.text();

      if (code === "1") {
        alert("✅ Saved Successfully!");
        setElectionName("");
        setStartDate("");
        setEndDate("");
      } else if (code === "-1") {
        alert("⚠️ Election already exists!");
      } else {
        alert("❌ Not saved, something went wrong!");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error connecting to server!");
    }
  };
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-pink-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const totalVotes = totalVotesAPI;
  const activeElections = activeElectionsAPI;
  const completedElections = completedElectionsAPI;

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
                <h1 className="text-xl font-bold text-blue-900">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Election Management System
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-pink-100 text-pink-600 text-sm font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-blue-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">Admin ID: {user.id}</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-pink-600 border-pink-200 hover:bg-pink-50 bg-transparent">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Votes</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {totalVotes.toLocaleString()}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Vote className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Elections</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {activeElections}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {completedElections}
                  </p>
                </div>
                <div className="bg-pink-100 p-3 rounded-full">
                  <BarChart3 className="h-6 w-6 text-pink-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Turnout Rate</p>
                  <p className="text-2xl font-bold text-blue-900">78.5%</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="elections">Elections</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
            <TabsTrigger value="party">Add Party</TabsTrigger>
            <TabsTrigger value="candidate">Add Candidate</TabsTrigger>
            <TabsTrigger value="election">Add Election</TabsTrigger>

            <Link href="/dashboard/admin/verification">
              <TabsTrigger value="verification">
                Verification & Token
              </TabsTrigger>
            </Link>
          </TabsList>
          {/* Recent Election */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Elections */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-900">
                    Recent Elections
                  </CardTitle>
                  <CardDescription>
                    Latest election results and status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {apiElections.map((election) => (
                    <div
                      key={election.electionid}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-900">
                          {election.electionname}
                        </p>
                        {/* ✅ Keep sum of votes */}
                        <p className="text-sm text-gray-600">
                          {election.candidates?.reduce(
                            (sum, c) => sum + (c.votes ?? 0),
                            0
                          )}{" "}
                          votes
                        </p>
                      </div>
                      <Badge
                        variant={
                          new Date(election.startdate || "") <= new Date() &&
                          new Date(election.enddate || "") >= new Date()
                            ? "default"
                            : "secondary"
                        }
                        className={`
    text-lg font-semibold
    ${
      new Date(election.startdate || "") > new Date()
        ? "bg-[#2563eb] text-white"
        : new Date(election.enddate || "") < new Date()
        ? "bg-[#dc2626] text-white"
        : "bg-[#16a34a] text-white"
    }
  `}>
                        {new Date(election.startdate || "") > new Date()
                          ? "Upcoming"
                          : new Date(election.enddate || "") < new Date()
                          ? "Completed"
                          : "Active"}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
              {/* Recent Election End */}

              {/* Leading Candidates (Only Active Elections) */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-900">
                    Leading Candidates
                  </CardTitle>
                  <CardDescription>
                    Current vote leaders across all active elections
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {apiElections
                    .filter(
                      (e) =>
                        new Date(e.startdate || "") <= new Date() &&
                        new Date(e.enddate || "") >= new Date()
                    )
                    .map((election) => (
                      <div
                        key={election.electionid}
                        className="p-3 bg-gray-50 rounded-lg space-y-3">
                        <p className="font-semibold text-blue-900">
                          {election.electionname}
                        </p>
                        {election.candidates?.map((candidate) => (
                          <div
                            key={candidate.candidateId}
                            className="flex items-center justify-between p-2 border rounded-md bg-white">
                            <div>
                              <p className="font-medium text-blue-900">
                                {candidate.candidateName}
                              </p>
                              <p className="text-sm text-gray-600">
                                {candidate.partyName ?? "Independent"}
                              </p>
                              <p className="text-sm text-gray-600">
                                {candidate.votes?.toLocaleString() ?? 0} votes
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                </CardContent>
              </Card>

              {/* ✅ Final Vote Counting (All Candidates of Completed Elections) */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-900">
                    Final Vote Counting
                  </CardTitle>
                  <CardDescription>
                    Complete results of all completed elections
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {apiElections
                    .filter((e) => new Date(e.enddate || "") < new Date())
                    .map((election) => (
                      <div
                        key={election.electionid}
                        className="p-3 bg-gray-50 rounded-lg space-y-3">
                        <p className="font-semibold text-blue-900">
                          {election.electionname}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(
                            election.startdate || ""
                          ).toLocaleDateString()}{" "}
                          -{" "}
                          {new Date(
                            election.enddate || ""
                          ).toLocaleDateString()}
                        </p>
                        {election.candidates?.map((candidate) => (
                          <div
                            key={candidate.candidateId}
                            className="p-2 border rounded-md bg-white">
                            <p className="font-medium text-blue-900">
                              {candidate.candidateName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {candidate.partyName ?? "Independent"}
                            </p>
                            <p className="text-sm text-gray-600">
                              Votes: {candidate.votes ?? 0}
                            </p>
                          </div>
                        ))}
                      </div>
                    ))}
                </CardContent>
              </Card>
              {/* Pie Chart - Recent Election Only */}

              <Card className="p-6 shadow-lg rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-900">
                    Vote Distribution (Recent Election)
                  </CardTitle>
                  <CardDescription className="text-base">
                    Candidate share of votes
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={
                          apiElections.length > 0
                            ? apiElections[0].candidates?.map(
                                (c: Candidate) => ({
                                  name: `${c.candidateName}`,
                                  value: c.votes ?? 0,
                                })
                              )
                            : []
                        }
                        cx="50%"
                        cy="50%"
                        outerRadius={140}
                        fill="#8884d8"
                        dataKey="value"
                        labelLine={false} // ❌ no label line
                        label={({
                          cx,
                          cy,
                          midAngle,
                          innerRadius,
                          outerRadius,
                          percent,
                          name,
                        }) => {
                          const radius =
                            innerRadius + (outerRadius - innerRadius) / 2;
                          const x =
                            cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                          const y =
                            cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                          return (
                            <text
                              x={x}
                              y={y}
                              fill="white"
                              textAnchor="middle"
                              dominantBaseline="central"
                              fontSize={12}
                              fontWeight="bold">
                              {`${name} ${(percent * 100).toFixed(0)}%`}
                            </text>
                          );
                        }}>
                        {apiElections[0]?.candidates?.map(
                          (_: Candidate, index: number) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value} votes`, name]}
                      />
                      <Legend
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ fontSize: "14px", marginTop: "10px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Pie Chart END*/}

              {/* Winners (Completed Elections) */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-yellow-500" /> Winners
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600">
                    Final results of completed elections
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 relative">
                  {apiElections
                    .filter((e) => new Date(e.enddate || "") < new Date())
                    .map((election) => {
                      const sortedCandidates =
                        election.candidates?.sort(
                          (a, b) => (b.votes ?? 0) - (a.votes ?? 0)
                        ) || [];
                      const winner = sortedCandidates[0];
                      const runnerUp = sortedCandidates[1];
                      const totalVotes = sortedCandidates.reduce(
                        (sum, c) => sum + (c.votes ?? 0),
                        0
                      );
                      const winBy =
                        winner && runnerUp
                          ? (winner.votes ?? 0) - (runnerUp.votes ?? 0)
                          : 0;

                      return (
                        <motion.div
                          key={election.electionid}
                          className="p-5 bg-white border rounded-2xl shadow-sm relative overflow-hidden"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                          whileHover={{ scale: 1.01 }}>
                          {/* Confetti only for winner */}
                          {winner && (
                            <Confetti
                              recycle={true}
                              numberOfPieces={100}
                              width={window.innerWidth}
                              height={250}
                            />
                          )}

                          {/* Election Name + Dates */}
                          <p className="font-semibold text-lg text-blue-900">
                            {election.electionname}
                          </p>
                          <p className="text-sm text-gray-500 mb-3">
                            {new Date(
                              election.startdate || ""
                            ).toLocaleDateString()}{" "}
                            –{" "}
                            {new Date(
                              election.enddate || ""
                            ).toLocaleDateString()}
                          </p>

                          {winner ? (
                            <div className="space-y-4">
                              {/* Winner Card */}
                              <motion.div
                                className="p-4 border rounded-xl bg-green-50 shadow-sm relative z-10 flex items-center gap-2"
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3 }}>
                                <Trophy className="h-5 w-5 text-yellow-500" />
                                <div>
                                  <p className="text-lg font-bold text-green-800">
                                    Winner: {winner.candidateName}
                                  </p>
                                  <p className="text-sm text-gray-700">
                                    {winner.partyName ?? "Independent"}
                                  </p>
                                  <p className="text-sm text-gray-700">
                                    Total Votes:{" "}
                                    <span className="font-semibold">
                                      {winner.votes}
                                    </span>
                                  </p>
                                  <Progress
                                    value={Math.round(
                                      ((winner.votes ?? 0) / totalVotes) * 100
                                    )}
                                    className="h-3 mt-2 bg-green-200"
                                  />
                                  <p className="text-sm text-green-700 font-bold mt-1">
                                    Won by {winBy} votes
                                  </p>
                                </div>
                              </motion.div>

                              {/* Runner-Up Card */}
                              {runnerUp && (
                                <motion.div
                                  className="p-4 border rounded-xl bg-red-50 shadow-sm relative z-10 flex items-center gap-2"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.2 }}>
                                  <XCircle className="h-5 w-5 text-red-500" />
                                  <div>
                                    <p className="text-lg font-bold text-red-800">
                                      Runner-up: {runnerUp.candidateName}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                      {runnerUp.partyName ?? "Independent"}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                      Total Votes:{" "}
                                      <span className="font-semibold">
                                        {runnerUp.votes}
                                      </span>
                                    </p>
                                    <Progress
                                      value={Math.round(
                                        ((runnerUp.votes ?? 0) / totalVotes) *
                                          100
                                      )}
                                      className="h-3 mt-2 bg-red-200"
                                    />
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">
                              No candidates
                            </p>
                          )}
                        </motion.div>
                      );
                    })}
                </CardContent>
              </Card>

              {/* End winner */}
            </div>
          </TabsContent>

          {/* Election Management */}
          <TabsContent value="elections" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-blue-900">
                Election Management
              </h2>
              <Button
                className="bg-pink-600 hover:bg-pink-700"
                onClick={() => setActiveTab("assignElection")}>
                <Plus className="h-4 w-4 mr-2" />
                New Election
              </Button>
            </div>

            <CardContent className="space-y-8">
              {(() => {
                const now = new Date();

                const activeElections = apiElections.filter(
                  (e) =>
                    new Date(e.startdate || "") <= now &&
                    new Date(e.enddate || "") >= now
                );

                const completedElections = apiElections.filter(
                  (e) => new Date(e.enddate || "") < now
                );

                const upcomingElections = apiElections.filter(
                  (e) => new Date(e.startdate || "") > now
                );

                return (
                  <>
                    {/* Active Elections */}
                    {activeElections.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-green-700 mb-3">
                          Active Elections
                        </h3>
                        <div className="space-y-3">
                          {activeElections.map((election) => (
                            <div
                              key={election.electionid}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <p className="font-medium text-blue-900">
                                {election.electionname}
                              </p>
                              <Badge className="bg-green-100 text-green-700">
                                Active
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Completed Elections */}
                    {completedElections.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-red-700 mb-3">
                          Completed Elections
                        </h3>
                        <div className="space-y-3">
                          {completedElections.map((election) => (
                            <div
                              key={election.electionid}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <p className="font-medium text-blue-900">
                                {election.electionname}
                              </p>
                              <Badge className="bg-red-100 text-red-700">
                                Completed
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Upcoming Elections */}
                    {upcomingElections.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-blue-700 mb-3">
                          Upcoming Elections
                        </h3>
                        <div className="space-y-3">
                          {upcomingElections.map((election) => (
                            <div
                              key={election.electionid}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <p className="font-medium text-blue-900">
                                {election.electionname}
                              </p>
                              <Badge className="bg-blue-100 text-blue-700">
                                Upcoming
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </CardContent>
          </TabsContent>
          {/* Election Management End */}

          <TabsContent value="management" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-900">
                    <Settings className="h-5 w-5 mr-2" />
                    System Settings
                  </CardTitle>
                  <CardDescription>
                    Configure election system parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Voters
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent">
                    <Vote className="h-4 w-4 mr-2" />
                    Configure Voting Rules
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent">
                    <Shield className="h-4 w-4 mr-2" />
                    Security Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-900">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Reports & Analytics
                  </CardTitle>
                  <CardDescription>
                    Generate detailed election reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Voting Trends
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent">
                    <Users className="h-4 w-4 mr-2" />
                    Demographic Analysis
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent">
                    <Calendar className="h-4 w-4 mr-2" />
                    Historical Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="party" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Party</CardTitle>
                <CardDescription>
                  Enter party name to add to the system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="text"
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  placeholder="Party Name"
                  className="w-full p-2 border rounded-md"
                />
                <Button
                  onClick={handleAddParty}
                  className="bg-pink-600 hover:bg-pink-700">
                  <Plus className="h-4 w-4 mr-2" /> Add Party
                </Button>
                {message && (
                  <p
                    className={`${
                      status === "success"
                        ? "text-green-600"
                        : status === "error"
                        ? "text-red-600"
                        : "text-blue-600"
                    } font-medium`}>
                    {message}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/*  Add Candidate */}
          <TabsContent value="candidate" className="space-y-6">
            <Card className="shadow-md border border-gray-200">
              <CardHeader className="bg-gray-50 rounded-t-xl">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-blue-600" />
                  Add Candidate
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Enter candidate name and select a party
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 pt-4">
                {/* Candidate Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="candidateName"
                    className="text-gray-700 font-medium">
                    Candidate Name
                  </Label>
                  <Input
                    id="candidateName"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Enter candidate name"
                    className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Party Dropdown */}
                <div className="space-y-2">
                  <Label
                    htmlFor="partySelect"
                    className="text-gray-700 font-medium">
                    Select Party
                  </Label>
                  <select
                    id="partySelect"
                    className="w-full rounded-lg border border-gray-300 p-2 bg-white focus:ring-2 focus:ring-blue-500"
                    value={candidatePartyId}
                    onChange={(e) => setCandidatePartyId(e.target.value)}>
                    <option value="">-- Select Party --</option>
                    {parties.map((party, index) => (
                      <option
                        key={`${party.partyid}-${index}`}
                        value={party.partyid}>
                        {party.partyname}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Add Button */}
                <Button
                  onClick={handleAddCandidate}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
                  disabled={!candidateName || !candidatePartyId}>
                  Add Candidate
                </Button>

                {/* Status Message */}
                {candidateMessage && (
                  <div
                    className={`text-center font-medium ${
                      candidateStatus === "success"
                        ? "text-green-600"
                        : candidateStatus === "error"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}>
                    {candidateMessage}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assign Election to Candidate */}
          <TabsContent value="assignElection" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assign Election to Candidate</CardTitle>
                <CardDescription>
                  Select a candidate and an election to assign
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Candidate Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="candidateSelect">Select Candidate</Label>
                  <select
                    id="candidateSelect"
                    className="w-full p-2 border rounded-md"
                    value={selectedCandidateId}
                    onChange={(e) =>
                      setSelectedCandidateId(Number(e.target.value))
                    }>
                    {/* Default Option */}
                    <option key="candidate-default" value="">
                      -- Select Candidate --
                    </option>

                    {/* Candidate Options */}
                    {candidates.map((candidate, index) => (
                      <option
                        key={`candidate-${candidate.candidateId}-${index}`}
                        value={candidate.candidateId}>
                        {candidate.candidateName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Election Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="electionSelect">Select Election</Label>
                  <select
                    id="electionSelect"
                    className="w-full p-2 border rounded-md"
                    value={selectedElectionId}
                    onChange={(e) =>
                      setSelectedElectionId(Number(e.target.value))
                    }>
                    {/* Default Option */}
                    <option key="election-default" value="">
                      -- Select Election --
                    </option>

                    {/* Election Options */}
                    {elections.map((election, index) => (
                      <option
                        key={`election-${election.electionid}-${index}`}
                        value={election.electionid}>
                        {election.electionname}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assign Button */}
                <Button
                  onClick={handleAssignElection}
                  className="bg-purple-600 hover:bg-purple-700 w-full">
                  <Plus className="h-4 w-4 mr-2" /> Assign Election
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/*  Add Election */}
          <TabsContent value="election" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Election</CardTitle>
                <CardDescription>
                  Enter election details to add to the system
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Election Name */}
                <input
                  type="text"
                  value={electionName}
                  onChange={(e) => setElectionName(e.target.value)}
                  placeholder="Election Name"
                  className="w-full p-2 border rounded-md"
                  required
                />

                {/* Start Date & Time */}
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />

                {/* End Date & Time */}
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />

                {/* Submit Button */}
                <Button
                  onClick={handleAddElection}
                  className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" /> Add Election
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
