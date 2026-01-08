# 📄 Contract Analysis Web Application

**Project Requirements & Technical Specification**

---

## 1. Overview

This project is a **secure, AI-powered contract analysis web application** that enables users to upload legal contracts (PDF/DOCX), analyze them using AI, and review results in an **intuitive, color-coded interface**.

Each user has a private workspace where previously uploaded contracts are stored, analyzed, and revisited.

The system focuses on:

* Clarity over complexity
* Traceability over automation hype
* Practical UX for real document review

---

## 2. Core Objectives

* Enable users to **upload, store, and revisit contracts**
* Extract **clauses, risks, and summaries** using AI
* Present insights via **clear visual indicators**
* Allow **human-in-the-loop review** with notes
* Enforce **strict access control per user**

---

## 3. User Authentication & Access Control

### 3.1 Why Authentication Is Mandatory

Authentication is required to:

* Associate contracts with users
* Display previously uploaded documents on the home page
* Prevent unauthorized document access
* Support future scalability (sharing, billing, teams)

---

### 3.2 Authentication Strategy

* Email + password authentication
* JWT-based authorization
* Password hashing using bcrypt
* JWT stored in HTTP-only cookies (preferred)

---

### 3.3 Auth Flow

1. User signs up / logs in
2. Server issues JWT
3. JWT required for all document-related APIs
4. Each request is scoped to `userId`

---

## 4. Application Features

---

### 4.1 Contract Upload

* Supported formats:

  * PDF
  * DOCX
* Client-side validation:

  * File type
  * File size
* Backend handling:

  * Multer for uploads
  * Files stored using MongoDB GridFS

Each uploaded contract is immediately associated with the authenticated user.

---

### 4.2 Contract Storage & Processing

* **MongoDB**

  * GridFS → original files
  * Collections → parsed text, AI results, notes
* Document lifecycle states:

  * `uploaded`
  * `processing`
  * `completed`
  * `failed`

AI processing is **asynchronous** and results are persisted.

---

### 4.3 AI-Based Contract Analysis

Using **Google Gemini API**, the system performs:

#### Clause Extraction

* Identify logical clauses
* Preserve clause numbering when possible
* Return structured clause data

#### Risk Identification

* Detect risky clauses (e.g., indemnity, termination, liability)
* Assign risk levels:

  * `low`
  * `medium`
  * `high`
* Provide short risk explanations

#### Contract Summary

* Plain-English overview
* Key obligations and red flags
* Non-legal, readable tone

> AI responses must be structured JSON and stored permanently.

---

## 5. User Interface & Experience (UX)

### 5.1 Core UX Principles

* **Scanability over density**
* **Visual hierarchy**
* **Minimal cognitive load**
* Human remains the decision-maker

---

### 5.2 Risk-Based Color Coding (Key UI Feature)

Contracts are visually annotated using **risk severity colors**:

| Risk Level | Color           | Meaning                    |
| ---------- | --------------- | -------------------------- |
| Low        | Green           | Standard / minimal concern |
| Medium     | Yellow / Orange | Needs attention            |
| High       | Red             | Critical risk              |

Color coding is applied to:

* Clause highlights
* Clause list indicators
* Risk summary sections

This allows users to **instantly identify problem areas** without reading the full document.

---

### 5.3 Contract Viewer

* Built using **Draft.js**
* Features:

  * Read-only contract text
  * Highlighted clauses
  * Hover / click to view risk explanation
* Original text is never modified

---

### 5.4 Notes & Annotations

* Users can add notes per clause
* Notes are:

  * Editable
  * Private to the user
  * Stored separately from contract text

This supports **human judgment layered on top of AI output**.

---

### 5.5 Home / Dashboard Page

After login:

* Show list of previously uploaded contracts
* Display:

  * Filename
  * Upload date
  * Processing status
  * Quick “Open” action

This page is the user’s **primary workspace**.

---

## 6. Technology Stack

### Frontend

* React.js
* Draft.js
* Responsibilities:

  * Authentication UI
  * File upload
  * Contract rendering
  * Clause highlighting
  * Notes interface

---

### Backend

* Node.js
* Express.js
* Multer
* Responsibilities:

  * Auth APIs
  * File uploads
  * AI orchestration
  * Document & notes APIs

---

### Database

* MongoDB
* GridFS
* Responsibilities:

  * Store original files
  * Store parsed text
  * Store AI results
  * Store user notes

---

### AI Layer

* Google Gemini API
* Low temperature (deterministic)
* Structured JSON output only

---

## 7. High-Level System Flow

1. User logs in
2. User uploads contract
3. Backend stores file in GridFS
4. Text is extracted
5. Text sent to Gemini API
6. AI returns clauses, risks, summary
7. Results saved in MongoDB
8. Frontend displays annotated contract
9. User adds notes as needed

---

## 8. Data Model (Simplified)

### User

```json
{
  "_id": "ObjectId",
  "email": "string",
  "passwordHash": "string",
  "createdAt": "ISODate"
}
```

### Contract

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "filename": "contract.pdf",
  "status": "completed",
  "uploadedAt": "ISODate",
  "summary": "string",
  "clauses": [
    {
      "id": "clause_1",
      "text": "string",
      "riskLevel": "high",
      "riskReason": "string",
      "notes": "string"
    }
  ]
}
```

All queries **must be filtered by `userId`**.

---

## 9. Non-Functional Requirements

* **Security**

  * Auth-protected routes
  * No cross-user document access
* **Performance**

  * Async AI processing
  * Cached results
* **Reliability**

  * Retry AI calls
  * Clear failure states
* **Scalability**

  * Stateless backend
  * Horizontal scaling ready

---

## 10. Explicitly Out of Scope

* Legal advice or compliance guarantees
* OAuth / social login
* Team collaboration
* Real-time editing
* Contract versioning

