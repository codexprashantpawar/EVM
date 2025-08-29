// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Separator } from "@/components/ui/separator";
// import {
//   Vote,
//   LogOut,
//   User,
//   Calendar,
//   CheckCircle,
//   Clock,
//   Users,
// } from "lucide-react";

// type Candidate = {
//   id: number;
//   candidatename: string;
//   party: { partyname: string };
// };

// type Election = {
//   electionid: number;
//   electionname: string;
//   description?: string;
//   startdate: string;
//   enddate: string;
// };

// export default function VoterDashboard() {
//   const [user, setUser] = useState<any>(null);
//   const [selectedCandidate, setSelectedCandidate] = useState<number | null>(
//     null
//   );
//   const [hasVoted, setHasVoted] = useState(false);
//   const [activeElection, setActiveElection] = useState<Election | null>(null);
//   const [candidates, setCandidates] = useState<Candidate[]>([]);
//   const router = useRouter();

//   useEffect(() => {
//     // ✅ Check user login
//     const userId = localStorage.getItem("userId");
//     const userRole = localStorage.getItem("userRole");
//     const username = localStorage.getItem("username");

//     if (!userId || userRole !== "1") {
//       router.push("/login?role=voter");
//       return;
//     }

//     setUser({
//       id: userId,
//       username: username,
//       role: userRole,
//       name:
//         (username ?? "Voter").charAt(0).toUpperCase() +
//         (username ?? "Voter").slice(1),
//     });

//     // ✅ Fetch Elections
//     fetch("http://localhost:8081/GetAllElection")
//       .then((res) => res.json())
//       .then((data: Election[]) => {
//         const now = new Date();
//         const active = data.find(
//           (e) => new Date(e.startdate) <= now && new Date(e.enddate) >= now
//         );
//         if (active) {
//           setActiveElection(active);

//           // ✅ Fetch candidates for active election
//           fetch(
//             `http://localhost:8081/GetAssignedCandidatesByElection/${active.electionid}`
//           )
//             .then((res) => res.json())
//             .then((c) => setCandidates(c.map((ce: any) => ce.candidate)));
//         }
//       })
//       .catch((err) => console.error("Error fetching elections:", err));
//   }, [router]);

//   const handleLogout = () => {
//     localStorage.removeItem("userId");
//     localStorage.removeItem("userRole");
//     localStorage.removeItem("username");
//     router.push("/");
//   };

//   const handleVote = (candidateId: number) => {
//     setSelectedCandidate(candidateId);
//   };

//   const confirmVote = async () => {
//     if (!selectedCandidate) {
//       alert("❌ Please select a candidate before voting.");
//       return;
//     }

//     if (!user || !activeElection?.electionid) {
//       alert("❌ User or election info missing. Try again.");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:8081/castvote", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           voterId: user.id,
//           candidateId: selectedCandidate,
//           electionId: activeElection.electionid,
//         }),
//       });
//       console.log(res);
//       if (!res.ok) {
//         alert("❌ Failed to record your vote. Try again.");
//         return;
//       }

//       const result = await res.json();

//       if (result === 1) {
//         setHasVoted(true);
//         alert("✅ Your vote has been successfully recorded!");
//       } else if (result === -1) {
//         alert("⚠️ You have already voted for this election.");
//       } else if (result === -2) {
//         alert("❌ Invalid Data.");
//       } else {
//         alert("❌ Failed to record your vote. Try again.");
//       }
//     } catch {
//       alert("❌ Error while voting.");
//     }
//   };

//   const getInitials = (name: string) =>
//     name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase();

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-blue-600">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-3">
//               <div className="bg-blue-600 p-2 rounded-lg">
//                 <Vote className="h-6 w-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-blue-900">
//                   Voter Dashboard
//                 </h1>
//                 <p className="text-sm text-gray-600">Cast your vote securely</p>
//               </div>
//             </div>

//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-3">
//                 <Avatar className="h-8 w-8">
//                   <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-semibold">
//                     {getInitials(user.name)}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className="hidden sm:block">
//                   <p className="text-sm font-medium text-blue-900">
//                     {user.name}
//                   </p>
//                   <p className="text-xs text-gray-500">Voter ID: {user.id}</p>
//                 </div>
//               </div>

//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleLogout}
//                 className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent">
//                 <LogOut className="h-4 w-4 mr-2" />
//                 Logout
//               </Button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             <Card className="mb-6">
//               <CardHeader>
//                 <CardTitle className="flex items-center text-blue-900">
//                   <User className="h-5 w-5 mr-2" />
//                   Your Information
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex items-center space-x-3">
//                   <Avatar className="h-12 w-12">
//                     <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
//                       {getInitials(user.name)}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <p className="font-semibold text-blue-900">{user.name}</p>
//                     <p className="text-sm text-gray-600">Voter ID: {user.id}</p>
//                   </div>
//                 </div>

//                 <Separator />

//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-600">Status:</span>
//                     <Badge
//                       variant="outline"
//                       className="text-green-600 border-green-200">
//                       Eligible to Vote
//                     </Badge>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-600">Votes Cast:</span>
//                     <span className="text-sm font-medium">
//                       {hasVoted ? "1" : "0"}
//                     </span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Voting Status */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center text-blue-900">
//                   <CheckCircle className="h-5 w-5 mr-2" />
//                   Voting Status
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {hasVoted ? (
//                   <div className="text-center py-4">
//                     <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
//                     <p className="font-semibold text-green-600">
//                       Vote Recorded
//                     </p>
//                     <p className="text-sm text-gray-600 mt-1">
//                       Thank you for participating!
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="text-center py-4">
//                     <Clock className="h-12 w-12 text-blue-500 mx-auto mb-3" />
//                     <p className="font-semibold text-blue-600">Ready to Vote</p>
//                     <p className="text-sm text-gray-600 mt-1">
//                       Select your candidate below
//                     </p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Voting Section */}
//           <div className="lg:col-span-2">
//             {activeElection ? (
//               <Card>
//                 <CardHeader>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <CardTitle className="text-blue-900">
//                         {activeElection.electionname}
//                       </CardTitle>
//                       <CardDescription className="mt-1">
//                         {activeElection.description}
//                       </CardDescription>
//                     </div>
//                     <Badge className="bg-green-100 text-green-700 border-green-200">
//                       <Calendar className="h-3 w-3 mr-1" />
//                       Active
//                     </Badge>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
//                       <span>
//                         Election ends:{" "}
//                         {new Date(activeElection.enddate).toLocaleDateString()}
//                       </span>
//                       <span className="flex items-center">
//                         <Users className="h-4 w-4 mr-1" />
//                         {candidates.length} candidates
//                       </span>
//                     </div>

//                     {/* Candidate List with Tick Box */}
//                     <div className="grid gap-4">
//                       {candidates.map((candidate) => (
//                         <Card
//                           key={candidate.id}
//                           className={`cursor-pointer transition-all duration-200 ${
//                             selectedCandidate === candidate.id
//                               ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200"
//                               : "hover:shadow-md border-gray-200"
//                           } ${hasVoted ? "opacity-60 cursor-not-allowed" : ""}`}
//                           onClick={() => !hasVoted && handleVote(candidate.id)}>
//                           <CardContent className="p-4">
//                             <div className="flex items-center justify-between">
//                               <div className="flex items-center space-x-3">
//                                 {/* ✅ Tick box */}
//                                 <input
//                                   type="checkbox"
//                                   checked={selectedCandidate === candidate.id}
//                                   onChange={() => handleVote(candidate.id)}
//                                   disabled={hasVoted}
//                                   className="w-4 h-4 accent-blue-600"
//                                 />
//                                 <div>
//                                   <p className="font-semibold text-blue-900">
//                                     {candidate.candidatename}
//                                   </p>
//                                   <p className="text-sm text-gray-600">
//                                     {candidate.party?.partyname}
//                                   </p>
//                                 </div>
//                               </div>
//                               {hasVoted &&
//                                 selectedCandidate === candidate.id && (
//                                   <Badge className="bg-green-100 text-green-700">
//                                     Your Vote
//                                   </Badge>
//                                 )}
//                             </div>
//                           </CardContent>
//                         </Card>
//                       ))}
//                     </div>

//                     {!hasVoted && selectedCandidate && (
//                       <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="font-semibold text-blue-900">
//                               Confirm Your Vote
//                             </p>
//                             <p className="text-sm text-blue-600">
//                               You selected:{" "}
//                               {
//                                 candidates.find(
//                                   (c) => c.id === selectedCandidate
//                                 )?.candidatename
//                               }
//                             </p>
//                           </div>
//                           <Button
//                             onClick={confirmVote}
//                             className="bg-blue-600 hover:bg-blue-700">
//                             <Vote className="h-4 w-4 mr-2" />
//                             Cast Vote
//                           </Button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             ) : (
//               <Card>
//                 <CardContent className="text-center py-12">
//                   <Vote className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-lg font-semibold text-gray-600 mb-2">
//                     No Active Elections
//                   </h3>
//                   <p className="text-gray-500">
//                     There are currently no elections available for voting.
//                   </p>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

//new code
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trophy, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import Confetti from "react-confetti";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Vote,
  LogOut,
  User,
  Calendar,
  CheckCircle,
  Clock,
  Upload,
} from "lucide-react";
import jsQR from "jsqr";

type Candidate = {
  id: number;
  candidatename: string;
  party: { partyname: string };
};

type Election = {
  electionid: number;
  electionname: string;
  description?: string;
  startdate: string;
  enddate: string;
};
type ElectionSummary = {
  electionid: number;
  electionname: string;
  startdate: string;
  enddate: string;
  // add optional candidates array for frontend use
  candidates?: ElectionResult[];
};

type ElectionResult = {
  candidateName: string;
  partyName: string;
  votes: number;
};

export default function VoterDashboard() {
  const [recentResult, setRecentResult] = useState<ElectionResult | null>(null);
  const [recentElection, setRecentElection] = useState<ElectionSummary | null>(
    null
  );
  const [user, setUser] = useState<any>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(
    null
  );
  const [hasVoted, setHasVoted] = useState(false);
  const [activeElection, setActiveElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [tokenStatus, setTokenStatus] = useState<string>(""); // valid / invalid
  const [activeTab, setActiveTab] = useState<"overview" | "results">(
    "overview"
  );
  const [totalVotesAPI, setTotalVotesAPI] = useState(0);
  const [activeElectionsAPI, setActiveElectionsAPI] = useState(0);
  const [completedElectionsAPI, setCompletedElectionsAPI] = useState(0);
  const router = useRouter();
  const [apiElections, setApiElections] = useState<ElectionSummary[]>([]);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("userRole");
    const username = localStorage.getItem("username");

    if (!userId || userRole !== "1") {
      router.push("/login?role=voter");
      return;
    }

    setUser({
      id: userId,
      username: username,
      role: userRole,
      name:
        (username ?? "Voter").charAt(0).toUpperCase() +
        (username ?? "Voter").slice(1),
    });

    fetch("http://localhost:8081/GetAllElection")
      .then((res) => res.json())
      .then((data: Election[]) => {
        const now = new Date();
        const active = data.find(
          (e) => new Date(e.startdate) <= now && new Date(e.enddate) >= now
        );
        if (active) {
          setActiveElection(active);

          fetch(
            `http://localhost:8081/GetAssignedCandidatesByElection/${active.electionid}`
          )
            .then((res) => res.json())
            .then((c) => setCandidates(c.map((ce: any) => ce.candidate)));
        }
      })
      .catch((err) => console.error("Error fetching elections:", err));
  }, [router]);
  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await fetch("http://localhost:8081/GetActiveElection");
        const data: ElectionSummary[] = await res.json();
        setApiElections(data);
      } catch (err) {
        console.error("Error fetching election summary:", err);
      }
    };
    fetchElections();
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    router.push("/");
  };

  const handleVote = (candidateId: number) => {
    setSelectedCandidate(candidateId);
  };
  useEffect(() => {
    // Fetch recent completed election and its winner
    const fetchRecentElectionResult = async () => {
      try {
        const res = await fetch(
          "http://localhost:8081/GetRecentElectionWinner"
        );
        const data: { election: ElectionSummary; winner: ElectionResult } =
          await res.json();
        setRecentElection(data.election);
        setRecentResult(data.winner);
      } catch (err) {
        console.error("Error fetching recent election result:", err);
      }
    };
    fetchRecentElectionResult();
  }, []);

  // ✅ Upload + Decode QR Image
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

        if (qrCode) {
          handleQrScan(qrCode.data);
        } else {
          alert("❌ No QR code detected in the image.");
        }
      };
    };
    reader.readAsDataURL(file);
  };

  // ✅ Verify QR token with backend
  const handleQrScan = async (scanned: string | null) => {
    if (!scanned || !user || !activeElection) return;
    setQrToken(scanned);

    try {
      const res = await fetch("http://localhost:8081/verify-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voterId: user.id,
          electionId: activeElection.electionid,
          token: scanned,
        }),
      });

      const result = await res.json();

      if (result.valid) {
        setTokenStatus("valid");
        alert("✅ QR token verified. You can now cast your vote.");
      } else {
        setTokenStatus("invalid");
        alert(result.message);
      }
    } catch (err) {
      console.error("QR verify error", err);
      setTokenStatus("invalid");
    }
  };

  const confirmVote = async () => {
    if (!selectedCandidate) {
      alert("❌ Please select a candidate before voting.");
      return;
    }

    if (!user || !activeElection?.electionid) {
      alert("❌ User or election info missing. Try again.");
      return;
    }

    if (!qrToken || tokenStatus !== "valid") {
      alert("❌ Please upload a valid QR token first.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8081/castvote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voterId: user.id,
          candidateId: selectedCandidate,
          electionId: activeElection.electionid,
          token: qrToken,
        }),
      });

      const result = await res.json();

      if (result === 1) {
        setHasVoted(true);
        alert("✅ Your vote has been successfully recorded!");
      } else if (result === -1) {
        alert("⚠️ You have already voted for this election.");
      } else if (result === -2) {
        alert("❌ Invalid Data.");
      } else if (result === -4) {
        alert("❌ Invalid or expired token.");
      } else {
        alert("❌ Failed to record your vote. Try again.");
      }
    } catch {
      alert("❌ Error while voting.");
    }
  };

  // 1️⃣ UseEffect to fetch elections and votes
  useEffect(() => {
    const fetchElectionsAndVotes = async () => {
      try {
        // 1️⃣ Fetch all elections
        const electionRes = await fetch("http://localhost:8081/GetAllElection");
        const electionsData: ElectionSummary[] = await electionRes.json();

        // 2️⃣ For each election, fetch candidate vote counts
        const electionsWithVotes = await Promise.all(
          electionsData.map(async (election) => {
            const voteRes = await fetch(
              `http://localhost:8081/GetElectionVoteCount/${election.electionid}`
            );
            const candidatesData: ElectionResult[] = await voteRes.json();
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

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600">Loading your dashboard...</p>
        </div>
      </div>
    );
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
                <h1 className="text-xl font-bold text-blue-900">
                  Voter Dashboard
                </h1>
                <p className="text-sm text-gray-600">Cast your vote securely</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-blue-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">Voter ID: {user.id}</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      {/* Tabs for Election Summary / Results */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "overview" | "results")}
        className="space-y-6">
        {/* Tab Buttons */}
        <TabsList className="grid w-full grid-cols-2 mb-4 mt-2">
          <TabsTrigger value="elections">Elections</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        {/* Elections Tab */}
        <TabsContent value="elections">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 mb-6">
            {apiElections.map((election) => {
              const now = new Date();
              const start = new Date(election.startdate);
              const end = new Date(election.enddate);

              let status = "Upcoming";
              let badgeClass =
                "bg-blue-100 text-blue-700 border border-blue-200"; // default Upcoming
              if (start <= now && end >= now) {
                status = "Active";
                badgeClass =
                  "bg-green-100 text-green-700 border border-green-200";
              } else if (end < now) {
                status = "Completed";
                badgeClass = "bg-red-100 text-red-700 border border-red-200";
              }

              return (
                <Card key={election.electionid} className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-blue-900 text-lg">
                      {election.electionname}
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <Badge className={badgeClass}>{status}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Start:</span>{" "}
                      {new Date(election.startdate).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">End:</span>{" "}
                      {new Date(election.enddate).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </section>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results">
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
                        {new Date(election.enddate || "").toLocaleDateString()}
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
                                    ((runnerUp.votes ?? 0) / totalVotes) * 100
                                  )}
                                  className="h-3 mt-2 bg-red-200"
                                />
                              </div>
                            </motion.div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No candidates</p>
                      )}
                    </motion.div>
                  );
                })}
            </CardContent>
          </Card>

          {/* End winner */}
        </TabsContent>
      </Tabs>

      {/* Tab end */}
      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <User className="h-5 w-5 mr-2" />
                  Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-blue-900">{user.name}</p>
                    <p className="text-sm text-gray-600">Voter ID: {user.id}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge
                      variant="outline"
                      className={
                        hasVoted || tokenStatus === "invalid"
                          ? "text-red-600 border-red-200"
                          : "text-green-600 border-green-200"
                      }>
                      {hasVoted || tokenStatus === "invalid"
                        ? "Not Eligible"
                        : "Eligible to Vote"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Votes Cast:</span>
                    <span className="text-sm font-medium">
                      {hasVoted ? "1" : "0"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* QR Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900">QR Token</CardTitle>
              </CardHeader>
              <CardContent>
                {tokenStatus === "valid" ? (
                  <p className="text-green-600 font-medium">
                    ✅ Token Verified
                  </p>
                ) : tokenStatus === "invalid" ? (
                  <p className="text-red-600 font-medium">
                    ❌ Invalid / Already Used
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Upload your QR token image to enable voting
                  </p>
                )}

                <div className="mt-4">
                  <label className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow cursor-pointer hover:bg-blue-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload QR Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Voting Status */}
            <CardContent>
              {hasVoted ? (
                <div className="text-center py-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="font-semibold text-green-600">Vote Recorded</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Thank you for participating!
                  </p>
                </div>
              ) : tokenStatus === "valid" ? (
                <div className="text-center py-4">
                  <Clock className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                  <p className="font-semibold text-blue-600">Ready to Vote</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Select your candidate below
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="mb-0">&copy; Prashant Pawar @2025</p>
                </div>
              )}
            </CardContent>
          </div>

          {/* Voting Section */}
          <div className="lg:col-span-2">
            {activeElection ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-blue-900">
                        {activeElection.electionname}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {activeElection.description}
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      <Calendar className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Candidate List */}
                    <div className="grid gap-4">
                      {candidates.map((candidate) => (
                        <Card
                          key={candidate.id}
                          className={`cursor-pointer transition-all duration-200 ${
                            selectedCandidate === candidate.id
                              ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200"
                              : "hover:shadow-md border-gray-200"
                          } ${hasVoted ? "opacity-60 cursor-not-allowed" : ""}`}
                          onClick={() => !hasVoted && handleVote(candidate.id)}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  checked={selectedCandidate === candidate.id}
                                  onChange={() => handleVote(candidate.id)}
                                  disabled={hasVoted}
                                  className="w-4 h-4 accent-blue-600"
                                />
                                <div>
                                  <p className="font-semibold text-blue-900">
                                    {candidate.candidatename}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {candidate.party?.partyname}
                                  </p>
                                </div>
                              </div>
                              {hasVoted &&
                                selectedCandidate === candidate.id && (
                                  <Badge className="bg-green-100 text-green-700">
                                    Your Vote
                                  </Badge>
                                )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Confirm Vote */}
                    {!hasVoted && selectedCandidate && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-blue-900">
                              Confirm Your Vote
                            </p>
                            <p className="text-sm text-blue-600">
                              You selected:{" "}
                              {
                                candidates.find(
                                  (c) => c.id === selectedCandidate
                                )?.candidatename
                              }
                            </p>
                          </div>
                          <Button
                            onClick={confirmVote}
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={tokenStatus !== "valid"}>
                            <Vote className="h-4 w-4 mr-2" />
                            Cast Vote
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Vote className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No Active Elections
                  </h3>
                  <p className="text-gray-500">
                    There are currently no elections available for voting.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
