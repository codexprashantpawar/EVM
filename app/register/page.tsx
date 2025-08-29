// "use client"

// import type React from "react"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { UserPlus, ArrowLeft, Copy, Check } from "lucide-react"

// export default function RegisterPage() {
//   const [voterID, setVoterID] = useState("")
//   const [name, setName] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [generatedCredentials, setGeneratedCredentials] = useState<{
//     username: string
//     password: string
//   } | null>(null)
//   const [copiedField, setCopiedField] = useState<string | null>(null)

//   const generateCredentials = () => {
//     // Generate username from name and voter ID
//     const cleanName = name.toLowerCase().replace(/\s+/g, "")
//     const username = `${cleanName}_${voterID.slice(-4)}`

//     // Generate random password
//     const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
//     let password = ""
//     for (let i = 0; i < 8; i++) {
//       password += chars.charAt(Math.floor(Math.random() * chars.length))
//     }

//     return { username, password }
//   }

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const credentials = generateCredentials();

//       const response = await fetch("http://localhost:8081/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           fullName: name,
//           voterId: voterID,
//           username: credentials.username,
//           password: credentials.password,
//         }),
//       });

//       const result = await response.text();

//       if (result === "1") {
//         // success → show generated credentials
//         setGeneratedCredentials(credentials);
//       } else if (result === "-1") {
//         alert("User with this name already exists!");
//       } else {
//         alert("Registration failed! Error code: " + result);
//       }

//       setIsLoading(false);
//     } catch (error) {
//       console.error("Registration failed:", error);
//       alert("Registration failed! Please try again.");
//       setIsLoading(false);
//     }
//   };
//   const copyToClipboard = async (text: string, field: string) => {
//     try {
//       await navigator.clipboard.writeText(text)
//       setCopiedField(field)
//       setTimeout(() => setCopiedField(null), 2000)
//     } catch (err) {
//       console.error("Failed to copy:", err)
//     }
//   }

//   if (generatedCredentials) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center p-4">
//         <div className="w-full max-w-md">
//           <Card className="shadow-xl border-0">
//             <CardHeader className="text-center space-y-4">
//               <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-green-100">
//                 <Check className="h-8 w-8 text-green-600" />
//               </div>
//               <div>
//                 <CardTitle className="text-2xl text-blue-900">Registration Successful!</CardTitle>
//                 <CardDescription className="text-base mt-2">
//                   Your account has been created. Please save these credentials securely.
//                 </CardDescription>
//               </div>
//             </CardHeader>

//             <CardContent className="space-y-6">
//               <div className="space-y-4">
//                 <div className="p-4 bg-blue-50 rounded-lg">
//                   <Label className="text-blue-900 font-medium">Username</Label>
//                   <div className="flex items-center justify-between mt-2">
//                     <code className="text-lg font-mono bg-white px-3 py-2 rounded border flex-1">
//                       {generatedCredentials.username}
//                     </code>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="ml-2"
//                       onClick={() => copyToClipboard(generatedCredentials.username, "username")}
//                     >
//                       {copiedField === "username" ? (
//                         <Check className="h-4 w-4 text-green-600" />
//                       ) : (
//                         <Copy className="h-4 w-4" />
//                       )}
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="p-4 bg-pink-50 rounded-lg">
//                   <Label className="text-blue-900 font-medium">Password</Label>
//                   <div className="flex items-center justify-between mt-2">
//                     <code className="text-lg font-mono bg-white px-3 py-2 rounded border flex-1">
//                       {generatedCredentials.password}
//                     </code>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="ml-2"
//                       onClick={() => copyToClipboard(generatedCredentials.password, "password")}
//                     >
//                       {copiedField === "password" ? (
//                         <Check className="h-4 w-4 text-green-600" />
//                       ) : (
//                         <Copy className="h-4 w-4" />
//                       )}
//                     </Button>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                 <p className="text-sm text-yellow-800">
//                   <strong>Important:</strong> Please save these credentials securely. You will need them to login and
//                   vote.
//                 </p>
//               </div>

//               <Button
//                 className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-pink-600 transition-colors"
//                 onClick={() => (window.location.href = "/login")}
//               >
//                 Continue to Login
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Back Button */}
//         <Button
//           variant="ghost"
//           className="mb-6 text-blue-600 hover:text-pink-600"
//           onClick={() => (window.location.href = "/")}
//         >
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back to Home
//         </Button>

//         <Card className="shadow-xl border-0">
//           <CardHeader className="text-center space-y-4">
//             <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-pink-100">
//               <UserPlus className="h-8 w-8 text-pink-600" />
//             </div>
//             <div>
//               <CardTitle className="text-2xl text-blue-900">Voter Registration</CardTitle>
//               <CardDescription className="text-base mt-2">
//                 Register as a new voter to participate in elections
//               </CardDescription>
//             </div>
//             <Badge variant="outline" className="text-pink-600 border-pink-200">
//               New Voter Registration
//             </Badge>
//           </CardHeader>

//           <CardContent>
//             <form onSubmit={handleRegister} className="space-y-6">
//               <div className="space-y-2">
//                 <Label htmlFor="voterID" className="text-blue-900 font-medium">
//                   Voter ID Number
//                 </Label>
//                 <Input
//                   id="voterID"
//                   type="text"
//                   placeholder="Enter your Voter ID"
//                   value={voterID}
//                   onChange={(e) => setVoterID(e.target.value)}
//                   required
//                   className="h-12 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="name" className="text-blue-900 font-medium">
//                   Full Name
//                 </Label>
//                 <Input
//                   id="name"
//                   type="text"
//                   placeholder="Enter your full name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                   className="h-12 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
//                 />
//               </div>

//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                 <p className="text-sm text-blue-800">
//                   <strong>Note:</strong> Your username and password will be automatically generated after registration.
//                 </p>
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full h-12 text-lg font-semibold bg-pink-600 hover:bg-blue-600 transition-colors"
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Creating Account..." : "Register"}
//               </Button>
//             </form>

//             <div className="mt-6 text-center">
//               <p className="text-sm text-gray-600 mb-2">Already have an account?</p>
//               <Button
//                 variant="link"
//                 className="text-blue-600 hover:text-pink-600 p-0"
//                 onClick={() => (window.location.href = "/login")}
//               >
//                 Sign In Here
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

"use client";

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
import { UserPlus, ArrowLeft, Copy, Check } from "lucide-react";

export default function RegisterPage() {
  const [voterID, setVoterID] = useState("");
  const [name, setName] = useState("");
  const [idImage, setIdImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    username: string;
    password: string;
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const generateCredentials = () => {
    const cleanName = name.toLowerCase().replace(/\s+/g, "");
    const username = `${cleanName}_${voterID.slice(-4)}`;
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 8; i++)
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    return { username, password };
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const credentials = generateCredentials();
      const formData = new FormData();
      formData.append("fullName", name);
      formData.append("voterId", voterID);
      formData.append("username", credentials.username);
      formData.append("password", credentials.password);
      if (idImage) formData.append("idImage", idImage);

      const response = await fetch("http://localhost:8081/register", {
        method: "POST",
        body: formData,
      });

      const result = await response.text();

      if (result === "1") setGeneratedCredentials(credentials);
      else if (result === "-1") alert("User with this name already exists!");
      else alert("Registration failed! Error code: " + result);

      setIsLoading(false);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed! Please try again.");
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // --- Render Generated Credentials or Registration Form ---
  if (generatedCredentials) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-green-100">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-blue-900">
                Registration Successful!
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Your account has been created. Please save these credentials
                securely.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Username */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <Label className="text-blue-900 font-medium">Username</Label>
                <div className="flex items-center justify-between mt-2">
                  <code className="text-lg font-mono bg-white px-3 py-2 rounded border flex-1">
                    {generatedCredentials.username}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2"
                    onClick={() =>
                      copyToClipboard(generatedCredentials.username, "username")
                    }>
                    {copiedField === "username" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Password */}
              <div className="p-4 bg-pink-50 rounded-lg">
                <Label className="text-blue-900 font-medium">Password</Label>
                <div className="flex items-center justify-between mt-2">
                  <code className="text-lg font-mono bg-white px-3 py-2 rounded border flex-1">
                    {generatedCredentials.password}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2"
                    onClick={() =>
                      copyToClipboard(generatedCredentials.password, "password")
                    }>
                    {copiedField === "password" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Please save these credentials
                  securely.
                </p>
              </div>

              <Button
                className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-pink-600 transition-colors"
                onClick={() => (window.location.href = "/login")}>
                Continue to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // --- Registration Form ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-6 text-blue-600 hover:text-pink-600"
          onClick={() => (window.location.href = "/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-pink-100">
              <UserPlus className="h-8 w-8 text-pink-600" />
            </div>
            <CardTitle className="text-2xl text-blue-900">
              Voter Registration
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Register as a new voter to participate in elections
            </CardDescription>
            <Badge variant="outline" className="text-pink-600 border-pink-200">
              New Voter Registration
            </Badge>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="voterID" className="text-blue-900 font-medium">
                  Voter ID Number
                </Label>
                <Input
                  id="voterID"
                  type="text"
                  placeholder="Enter your Voter ID"
                  value={voterID}
                  onChange={(e) => setVoterID(e.target.value)}
                  required
                  className="h-12 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-blue-900 font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="idImage" className="text-blue-900 font-medium">
                  Upload Aadhaar / Voter ID
                </Label>
                <Input
                  id="idImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files && setIdImage(e.target.files[0])
                  }
                  className="h-12 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Your username and password will be
                  automatically generated after registration.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg font-semibold bg-pink-600 hover:bg-blue-600 transition-colors"
                disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Register"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">
                Already have an account?
              </p>
              <Button
                variant="link"
                className="text-blue-600 hover:text-pink-600 p-0"
                onClick={() => (window.location.href = "/login")}>
                Sign In Here
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
