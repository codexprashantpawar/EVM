# 🗳️ EVM System

A full-stack **Electronic Voting Machine (EVM)** system built with:

- **Backend:** Spring Boot (Java)
- **Frontend:** Next.js (React)
- **Database:** MySQL

The system ensures secure, one-time voting, with real-time vote tracking and full election lifecycle management.

---

## 🎯 Project Purpose

This EVM system is designed to bring modern, digital efficiency and security to the voting process. Its core goals include:

✅ Ensure transparent, secure, and efficient voting  
✅ Allow each voter to vote only once per election  
✅ Provide voters a seamless experience and admins full control  

---

## ✨ Key Features

- ✅ Voter registration with system-generated credentials  
- ✅ Admin dashboard to manage elections, parties, and candidates  
- ✅ QR-based one-time voting for added security  
- ✅ Real-time polling and live results with charts  
- ✅ Full election lifecycle: _upcoming → active → completed_  

---

## 🔁 System Flow

1️⃣ **Admin verifies voters** → assigns unique QR codes and tokens  
2️⃣ **Voter logs in**, scans QR, and casts vote securely  
3️⃣ **Vote is recorded**, QR is invalidated, results updated in real-time  

---

## 🛠️ Tech Stack

| Layer      | Technology     |
|------------|----------------|
| Frontend   | Next.js (React)|
| Backend    | Spring Boot    |
| Database   | MySQL          |
| Auth       | Custom / QR Code Token Auth |

---

## 🚀 How to Run the Project Locally

### 📦 1. Clone the Repository

```bash
git clone https://github.com/codexprashantpawar/EVM.git
cd EVM
