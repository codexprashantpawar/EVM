// "use client"
// import { useState, useRef } from "react"
// import type React from "react"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Camera, Upload, CheckCircle, XCircle, User, CreditCard, ArrowLeft, RefreshCw } from "lucide-react"
// import Link from "next/link"

// export default function VoterVerificationPage() {
//   const [activeTab, setActiveTab] = useState("verify")
//   const [verificationData, setVerificationData] = useState({
//     fullName: "",
//     aadhaarNumber: "",
//     voterID: "",
//   })
//   const [faceImage, setFaceImage] = useState<string | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [verificationResult, setVerificationResult] = useState<any>(null)
//   const [tokenGenerated, setTokenGenerated] = useState(false)
//   const fileInputRef = useRef<HTMLInputElement>(null)
//   const videoRef = useRef<HTMLVideoElement>(null)
//   const canvasRef = useRef<HTMLCanvasElement>(null)
//   const [cameraActive, setCameraActive] = useState(false)

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true })
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream
//         setCameraActive(true)
//       }
//     } catch (err) {
//       console.error("Error accessing camera:", err)
//     }
//   }

//   const capturePhoto = () => {
//     if (videoRef.current && canvasRef.current) {
//       const canvas = canvasRef.current
//       const video = videoRef.current
//       canvas.width = video.videoWidth
//       canvas.height = video.videoHeight
//       const ctx = canvas.getContext("2d")
//       ctx?.drawImage(video, 0, 0)
//       const imageData = canvas.toDataURL("image/jpeg")
//       setFaceImage(imageData)
//       stopCamera()
//     }
//   }

//   const stopCamera = () => {
//     if (videoRef.current?.srcObject) {
//       const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
//       tracks.forEach((track) => track.stop())
//       setCameraActive(false)
//     }
//   }

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onload = (e) => {
//         setFaceImage(e.target?.result as string)
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleVerification = async () => {
//     setLoading(true)
//     try {
//       // API call placeholder - user will implement
//       const response = await fetch("/api/admin/verify-voter", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...verificationData,
//           faceImage,
//         }),
//       })

//       const result = await response.json()
//       setVerificationResult(result)

//       if (result.verified) {
//         setActiveTab("generate-token")
//       }
//     } catch (err) {
//       console.error("Verification failed:", err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const generateToken = async () => {
//     setLoading(true)
//     try {
//       // API call placeholder - user will implement
//       const response = await fetch("/api/admin/generate-token", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           voterID: verificationData.voterID,
//           aadhaarNumber: verificationData.aadhaarNumber,
//         }),
//       })

//       const result = await response.json()
//       if (result.success) {
//         setTokenGenerated(true)
//       }
//     } catch (err) {
//       console.error("Token generation failed:", err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 p-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-blue-900">Voter Verification</h1>
//             <p className="text-gray-600">Verify voter identity and generate voting tokens</p>
//           </div>
//           <Link href="/dashboard/admin">
//             <Button variant="outline" className="border-blue-200 bg-transparent">
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back to Dashboard
//             </Button>
//           </Link>
//         </div>

//         <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="verify">Voter Verification</TabsTrigger>
//             <TabsTrigger value="generate-token" disabled={!verificationResult?.verified}>
//               Generate Token
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="verify" className="space-y-6">
//             <div className="grid md:grid-cols-2 gap-6">
//               {/* Voter Details */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center text-blue-900">
//                     <User className="h-5 w-5 mr-2" />
//                     Voter Details
//                   </CardTitle>
//                   <CardDescription>Enter voter information for verification</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="fullName">Full Name</Label>
//                     <Input
//                       id="fullName"
//                       value={verificationData.fullName}
//                       onChange={(e) => setVerificationData({ ...verificationData, fullName: e.target.value })}
//                       className="border-blue-200"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="voterID">Voter ID/Aadhar ID</Label>
//                     <Input
//                       id="voterID"
//                       value={verificationData.voterID}
//                       onChange={(e) => setVerificationData({ ...verificationData, voterID: e.target.value })}
//                       className="border-blue-200"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Face Recognition */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center text-blue-900">
//                     <Camera className="h-5 w-5 mr-2" />
//                     Face Recognition
//                   </CardTitle>
//                   <CardDescription>Capture or upload voter's photo for AI verification</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   {!faceImage ? (
//                     <div className="space-y-4">
//                       {!cameraActive ? (
//                         <div className="space-y-2">
//                           <Button onClick={startCamera} className="w-full bg-blue-600 hover:bg-blue-700">
//                             <Camera className="h-4 w-4 mr-2" />
//                             Start Camera
//                           </Button>

//                           <Button
//                             variant="outline"
//                             onClick={() => fileInputRef.current?.click()}
//                             className="w-full border-blue-200"
//                           >
//                             <Upload className="h-4 w-4 mr-2" />
//                             Upload Photo
//                           </Button>

//                           <input
//                             ref={fileInputRef}
//                             type="file"
//                             accept="image/*"
//                             onChange={handleFileUpload}
//                             className="hidden"
//                           />
//                         </div>
//                       ) : (
//                         <div className="space-y-2">
//                           <video ref={videoRef} autoPlay className="w-full rounded-lg border" />
//                           <div className="flex gap-2">
//                             <Button onClick={capturePhoto} className="flex-1 bg-green-600 hover:bg-green-700">
//                               Capture Photo
//                             </Button>
//                             <Button
//                               variant="outline"
//                               onClick={stopCamera}
//                               className="border-red-200 text-red-600 bg-transparent"
//                             >
//                               Cancel
//                             </Button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <div className="space-y-2">
//                       <img
//                         src={faceImage || "/placeholder.svg"}
//                         alt="Captured face"
//                         className="w-full rounded-lg border"
//                       />
//                       <Button variant="outline" onClick={() => setFaceImage(null)} className="w-full border-blue-200">
//                         <RefreshCw className="h-4 w-4 mr-2" />
//                         Retake Photo
//                       </Button>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Verification Results */}
//             {verificationResult && (
//               <Card className={verificationResult.verified ? "border-green-200" : "border-red-200"}>
//                 <CardHeader>
//                   <CardTitle
//                     className={`flex items-center ${verificationResult.verified ? "text-green-900" : "text-red-900"}`}
//                   >
//                     {verificationResult.verified ? (
//                       <CheckCircle className="h-5 w-5 mr-2" />
//                     ) : (
//                       <XCircle className="h-5 w-5 mr-2" />
//                     )}
//                     Verification Result
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between">
//                       <span>Identity Match:</span>
//                       <Badge variant={verificationResult.identityMatch ? "default" : "destructive"}>
//                         {verificationResult.identityMatch ? "Verified" : "Failed"}
//                       </Badge>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span>Face Recognition:</span>
//                       <Badge variant={verificationResult.faceMatch ? "default" : "destructive"}>
//                         {verificationResult.faceMatch ? "Match" : "No Match"}
//                       </Badge>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span>Document Validity:</span>
//                       <Badge variant={verificationResult.documentValid ? "default" : "destructive"}>
//                         {verificationResult.documentValid ? "Valid" : "Invalid"}
//                       </Badge>
//                     </div>
//                   </div>

//                   {verificationResult.message && (
//                     <Alert className="mt-4">
//                       <AlertDescription>{verificationResult.message}</AlertDescription>
//                     </Alert>
//                   )}
//                 </CardContent>
//               </Card>
//             )}

//             <Button
//               onClick={handleVerification}
//               disabled={
//                 !verificationData.fullName ||
//                 !verificationData.aadhaarNumber ||
//                 !verificationData.voterID ||
//                 !faceImage ||
//                 loading
//               }
//               className="w-full bg-blue-600 hover:bg-pink-600 transition-colors"
//             >
//               {loading ? "Verifying..." : "Verify Voter"}
//             </Button>
//           </TabsContent>

//           <TabsContent value="generate-token" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center text-blue-900">
//                   <CreditCard className="h-5 w-5 mr-2" />
//                   Generate Voting Token
//                 </CardTitle>
//                 <CardDescription>Issue unique voting token for verified voter</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {!tokenGenerated ? (
//                   <div className="space-y-4">
//                     <Alert>
//                       <AlertDescription>
//                         Voter has been successfully verified. Click below to generate their unique voting token.
//                       </AlertDescription>
//                     </Alert>

//                     <div className="bg-blue-50 p-4 rounded-lg space-y-2">
//                       <div>
//                         <strong>Name:</strong> {verificationData.fullName}
//                       </div>
//                       <div>
//                         <strong>Voter ID:</strong> {verificationData.voterID}
//                       </div>
//                       <div>
//                         <strong>Aadhaar:</strong> {verificationData.aadhaarNumber}
//                       </div>
//                     </div>

//                     <Button
//                       onClick={generateToken}
//                       disabled={loading}
//                       className="w-full bg-green-600 hover:bg-green-700"
//                     >
//                       {loading ? "Generating Token..." : "Generate Voting Token"}
//                     </Button>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     <Alert>
//                       <CheckCircle className="h-4 w-4" />
//                       <AlertDescription>
//                         Voting token has been successfully generated and assigned to the voter's account.
//                       </AlertDescription>
//                     </Alert>

//                     <Button
//                       onClick={() => {
//                         setVerificationData({ fullName: "", aadhaarNumber: "", voterID: "" })
//                         setFaceImage(null)
//                         setVerificationResult(null)
//                         setTokenGenerated(false)
//                         setActiveTab("verify")
//                       }}
//                       className="w-full bg-blue-600 hover:bg-pink-600"
//                     >
//                       Verify Another Voter
//                     </Button>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>

//         <canvas ref={canvasRef} className="hidden" />
//       </div>
//     </div>
//   )
// }

//new code

"use client";
import { useEffect, useRef, useState } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Camera,
  Upload,
  CheckCircle,
  XCircle,
  User,
  CreditCard,
  ArrowLeft,
  RefreshCw,
  Copy,
  Download,
} from "lucide-react";
import Link from "next/link";
import {QRCodeCanvas }from "qrcode.react";

type Election = {
  electionid: number;
  electionname: string;
  recordstatus: string;
  startdate: string; // ISO
  enddate: string; // ISO
};

export default function VoterVerificationPage() {
  const [activeTab, setActiveTab] = useState("verify");

  const [verificationData, setVerificationData] = useState({
    fullName: "",
    voterId: "",
  });

  const [faceImage, setFaceImage] = useState<string | null>(null); // UI only
  const [cameraActive, setCameraActive] = useState(false);

  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<null | {
    verified: boolean;
    message?: string;
  }>(null);

  const [elections, setElections] = useState<Election[]>([]);
  const [activeElections, setActiveElections] = useState<Election[]>([]);
  const [selectedElection, setSelectedElection] = useState<number | "">("");

  const [tokenGenerated, setTokenGenerated] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qrWrapRef = useRef<HTMLDivElement>(null);

  // --- Camera (UI only) ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      alert("Error accessing camera: " + (err as Error).message);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg");
      setFaceImage(imageData);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
      setCameraActive(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFaceImage(ev.target?.result as string);
    reader.readAsDataURL(f);
  };

  // --- Elections: fetch and filter active (start <= now <= end) ---
  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await fetch("http://localhost:8081/GetActiveElection");
        const data: Election[] = await res.json();
        setElections(data || []);
        const now = new Date();
        const active = (data || []).filter((e) => {
          const s = new Date(e.startdate);
          const ed = new Date(e.enddate);
          return s <= now && now <= ed;
        });
        setActiveElections(active);
      } catch (e) {
        console.error("Failed to load elections", e);
        setElections([]);
        setActiveElections([]);
      }
    };
    fetchElections();
  }, []);

  // --- Verify (only fullName + voterId via form-urlencoded) ---
  const handleVerification = async () => {
    if (!verificationData.fullName.trim() || !verificationData.voterId.trim()) {
      alert("Please enter Full Name and Voter ID");
      return;
    }
    setLoading(true);
    setVerificationResult(null);

    try {
      const body = new URLSearchParams();
      body.append("fullName", verificationData.fullName.trim());
      body.append("voterId", verificationData.voterId.trim());

      const res = await fetch("http://localhost:8081/verify-voter", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      // Spring may return number JSON or plain number; try json -> fallback text
      let code: number;
      try {
        const j = await res.json();
        code = typeof j === "number" ? j : Number.NaN;
      } catch {
        const t = await res.text();
        code = parseInt(t, 10);
      }

      if (code === 1) {
        setVerificationResult({
          verified: true,
          message: "Voter verified successfully.",
        });
        setActiveTab("generate-token");
      } else if (code === 0) {
        setVerificationResult({
          verified: false,
          message: "No voter found with provided details.",
        });
      } else {
        setVerificationResult({
          verified: false,
          message: "Server error during verification.",
        });
      }
    } catch (error) {
      alert("Verification failed: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // --- Generate token (form-urlencoded) ---
  const generateToken = async () => {
    if (!selectedElection) {
      alert("Please select an active election");
      return;
    }
    setLoading(true);
    try {
      const body = new URLSearchParams();
      body.append("voterId", verificationData.voterId.trim());
      body.append("electionId", String(selectedElection));

      const res = await fetch("http://localhost:8081/generate-voting-token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      const result = await res.json();

      if (result?.success) {
        setGeneratedToken(result.token);
        setTokenGenerated(true);
      } else {
        alert(result?.message || "Token generation failed");
      }
    } catch (e) {
      alert("Token generation failed: " + (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // --- QR helpers ---
  const copyToken = async () => {
    if (!generatedToken) return;
    try {
      await navigator.clipboard.writeText(generatedToken);
      alert("Token copied to clipboard");
    } catch {
      alert("Copy failed");
    }
  };

  const downloadQR = () => {
    const canvas = qrWrapRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `voting-token-${verificationData.voterId}-${selectedElection}.png`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">
              Voter Verification
            </h1>
            <p className="text-gray-600">
              Verify voter identity and generate voting tokens
            </p>
          </div>
          <Link href="/dashboard/admin">
            <Button
              variant="outline"
              className="border-blue-200 bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="verify">Voter Verification</TabsTrigger>
            <TabsTrigger
              value="generate-token"
              disabled={!verificationResult?.verified}>
              Generate Token
            </TabsTrigger>
          </TabsList>

          {/* VERIFY TAB */}
          <TabsContent value="verify" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Voter Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-900">
                    <User className="h-5 w-5 mr-2" />
                    Voter Details
                  </CardTitle>
                  <CardDescription>
                    Enter voter information for verification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={verificationData.fullName}
                      onChange={(e) =>
                        setVerificationData({
                          ...verificationData,
                          fullName: e.target.value,
                        })
                      }
                      className="border-blue-200"
                      autoComplete="off"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="voterId">Voter ID</Label>
                    <Input
                      id="voterId"
                      value={verificationData.voterId}
                      onChange={(e) =>
                        setVerificationData({
                          ...verificationData,
                          voterId: e.target.value,
                        })
                      }
                      className="border-blue-200"
                      autoComplete="off"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Face (UI only) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-900">
                    <Camera className="h-5 w-5 mr-2" />
                    Face Recognition (UI only)
                  </CardTitle>
                  <CardDescription>
                    Capture or upload voter's photo (not sent to server)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!faceImage ? (
                    !cameraActive ? (
                      <div className="space-y-2">
                        <Button
                          onClick={startCamera}
                          className="w-full bg-blue-600 hover:bg-blue-700">
                          <Camera className="h-4 w-4 mr-2" />
                          Start Camera
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full border-blue-200">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Photo
                        </Button>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <video
                          ref={videoRef}
                          autoPlay
                          className="w-full rounded-lg border"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={capturePhoto}
                            className="flex-1 bg-green-600 hover:bg-green-700">
                            Capture Photo
                          </Button>
                          <Button
                            variant="outline"
                            onClick={stopCamera}
                            className="border-red-200 text-red-600 bg-transparent">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="space-y-2">
                      <img
                        src={faceImage}
                        alt="Captured face"
                        className="w-full rounded-lg border"
                      />
                      <Button
                        variant="outline"
                        onClick={() => setFaceImage(null)}
                        className="w-full border-blue-200">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retake Photo
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Verification Results */}
            {verificationResult && (
              <Card
                className={
                  verificationResult.verified
                    ? "border-green-200"
                    : "border-red-200"
                }>
                <CardHeader>
                  <CardTitle
                    className={`flex items-center ${
                      verificationResult.verified
                        ? "text-green-900"
                        : "text-red-900"
                    }`}>
                    {verificationResult.verified ? (
                      <CheckCircle className="h-5 w-5 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 mr-2" />
                    )}
                    Verification Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Identity Match:</span>
                      <Badge
                        variant={
                          verificationResult.verified
                            ? "default"
                            : "destructive"
                        }>
                        {verificationResult.verified ? "Verified" : "Failed"}
                      </Badge>
                    </div>
                  </div>

                  {verificationResult.message && (
                    <Alert className="mt-4">
                      <AlertDescription>
                        {verificationResult.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            <Button
              onClick={handleVerification}
              disabled={
                !verificationData.fullName.trim() ||
                !verificationData.voterId.trim() ||
                loading
              }
              className="w-full bg-blue-600 hover:bg-pink-600 transition-colors">
              {loading ? "Verifying..." : "Verify Voter"}
            </Button>
          </TabsContent>

          {/* GENERATE TOKEN TAB */}
          <TabsContent value="generate-token" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Generate Voting Token
                </CardTitle>
                <CardDescription>
                  Select an active election and issue a unique voting token
                  (with QR)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!tokenGenerated ? (
                  <>
                    <Label>Active Elections</Label>
                    <select
                      className="w-full border rounded p-2"
                      value={selectedElection}
                      onChange={(e) =>
                        setSelectedElection(
                          e.target.value ? Number(e.target.value) : ""
                        )
                      }>
                      <option value="">-- Select Active Election --</option>
                      {activeElections.map((e) => (
                        <option key={e.electionid} value={e.electionid}>
                          {e.electionname}
                        </option>
                      ))}
                    </select>

                    {activeElections.length === 0 && (
                      <Alert>
                        <AlertDescription>
                          No active elections right now (based on start/end
                          date).
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                      <div>
                        <strong>Name:</strong> {verificationData.fullName}
                      </div>
                      <div>
                        <strong>Voter ID:</strong> {verificationData.voterId}
                      </div>
                    </div>

                    <Button
                      onClick={generateToken}
                      disabled={loading || !selectedElection}
                      className="w-full bg-green-600 hover:bg-green-700">
                      {loading ? "Generating..." : "Generate Token"}
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4 text-center">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Token generated successfully!
                      </AlertDescription>
                    </Alert>

                    {generatedToken && (
                      <div className="flex flex-col items-center space-y-4">
                        <div
                          ref={qrWrapRef}
                          className="p-3 bg-white rounded-lg shadow">
                          <QRCodeCanvas
                            value={generatedToken}
                            size={220}
                            includeMargin
                          />
                        </div>
                        <p className="font-mono break-all text-sm">
                          {generatedToken}
                        </p>

                        <div className="flex gap-2">
                          <Button variant="outline" onClick={copyToken}>
                            <Copy className="h-4 w-4 mr-2" /> Copy Token
                          </Button>
                          <Button variant="outline" onClick={downloadQR}>
                            <Download className="h-4 w-4 mr-2" /> Download QR
                          </Button>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={() => {
                        setSelectedElection("");
                        setGeneratedToken(null);
                        setTokenGenerated(false);
                        setActiveTab("verify");
                        setVerificationData({ fullName: "", voterId: "" });
                        setVerificationResult(null);
                        setFaceImage(null);
                      }}
                      className="w-full bg-blue-600 hover:bg-pink-600">
                      Verify Another Voter
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
