# FACTORYX AI --- Smart Factory Dashboard

FACTORYX AI is a full-stack Smart Factory Management Dashboard designed
to provide a centralized platform for monitoring production operations,
machines, maintenance, inventory, quality, incidents, documents,
reports, and AI-assisted factory knowledge management.

The application combines a modern React frontend with a Spring Boot
backend, JWT authentication, MySQL database integration, Spring AI, Groq
LLM integration, and a Retrieval-Augmented Generation (RAG) workflow for
document-based AI assistance.

------------------------------------------------------------------------

## Table of Contents

-   [Project Overview](#project-overview)
-   [Objectives](#objectives)
-   [Core Modules](#core-modules)
-   [Key Features](#key-features)
-   [Technology Stack](#technology-stack)
-   [System Architecture](#system-architecture)
-   [Project Structure](#project-structure)
-   [Frontend](#frontend)
-   [Backend](#backend)
-   [Authentication and Security](#authentication-and-security)
-   [AI Assistant](#ai-assistant)
-   [RAG Document Knowledge Base](#rag-document-knowledge-base)
-   [Database](#database)
-   [API Overview](#api-overview)
-   [Environment Variables](#environment-variables)
-   [Local Development Setup](#local-development-setup)
-   [Frontend Deployment](#frontend-deployment)
-   [Backend Deployment](#backend-deployment)
-   [Docker](#docker)
-   [Current RAG Limitations](#current-rag-limitations)
-   [Future Improvements](#future-improvements)
-   [Project Scope](#project-scope)
-   [Author](#author)

------------------------------------------------------------------------

## Project Overview

FACTORYX AI provides a single dashboard for managing and analyzing
smart-factory operations.

The system is built around the following workflow:

``` text
Factory Operations
       |
       v
+-----------------------------+
|      FACTORYX AI            |
+-----------------------------+
| Dashboard                   |
| Machines                    |
| Production                  |
| Maintenance                 |
| Inventory                   |
| Quality                     |
| Incidents                   |
| AI Assistant                |
| Documents / Knowledge Base  |
| Reports                     |
+-----------------------------+
       |
       +-------------------+
       |                   |
       v                   v
 Spring Boot API       AI / RAG Layer
       |                   |
       v                   v
     MySQL             Groq + Embeddings
```

The platform is intended to demonstrate full-stack Java development,
REST API development, JWT-based authentication, database integration, AI
integration, and RAG-based knowledge retrieval.

------------------------------------------------------------------------

## Objectives

The main objectives of FACTORYX AI are:

1.  Provide a centralized smart-factory management dashboard.
2.  Monitor machines and operational status.
3.  Manage production plans and production information.
4.  Track maintenance activities.
5.  Manage inventory and stock information.
6.  Track quality-related information.
7.  Record and manage factory incidents.
8.  Provide an AI assistant for factory-related questions.
9.  Upload factory documents and build a searchable knowledge base.
10. Use RAG to provide AI responses using relevant document content.
11. Provide reports and operational insights.
12. Secure application APIs using JWT authentication.
13. Demonstrate a scalable full-stack architecture using React, Spring
    Boot, MySQL, Spring AI, and Groq.

------------------------------------------------------------------------

# Core Modules

## 1. Dashboard

The Dashboard provides a centralized overview of factory operations.

Main dashboard capabilities include:

-   Overall factory KPIs
-   Machine status
-   Production information
-   Maintenance information
-   Inventory-related information
-   Quality information
-   Incident/alert information
-   Performance information
-   AI-generated insights
-   Notifications
-   User profile menu
-   Logout
-   Refresh functionality
-   Navigation to all major modules

The dashboard uses a dark industrial interface with teal/cyan panels and
yellow/gold accents.

------------------------------------------------------------------------

## 2. Machines

The Machines module provides machine-level operational information.

Capabilities include:

-   Machine listing
-   Machine status
-   Machine information
-   Machine monitoring view
-   Sensor-related information
-   Machine performance indicators
-   Operational status indicators

Machine states can be represented using statuses such as:

-   Running
-   Attention Required

------------------------------------------------------------------------

## 3. Production

The Production module manages production-related information.

Capabilities include:

-   Production plans
-   Production data
-   Create Production Plan
-   View production records
-   View All
-   Show Less
-   Backend API integration
-   Database persistence

Production plans can be created from the frontend using a dedicated
modal.

------------------------------------------------------------------------

## 4. Maintenance

The Maintenance module provides functionality for managing
maintenance-related operations.

Capabilities include:

-   Maintenance records
-   Maintenance status
-   Maintenance information
-   Machine maintenance tracking
-   Maintenance workflow management

------------------------------------------------------------------------

## 5. Inventory

The Inventory module provides inventory and stock management
functionality.

Capabilities include:

-   Inventory records
-   Stock information
-   Item information
-   Inventory monitoring
-   Database-backed inventory data

------------------------------------------------------------------------

## 6. Quality

The Quality module provides quality-management functionality for factory
operations.

Capabilities include:

-   Quality records
-   Quality information
-   Quality status
-   Factory quality monitoring

------------------------------------------------------------------------

## 7. Incidents

The Incidents module is used to track operational incidents.

Capabilities include:

-   Incident records
-   Incident information
-   Incident status
-   Operational issue tracking
-   Dashboard alert integration

------------------------------------------------------------------------

## 8. AI Assistant

The AI Assistant provides an AI-powered interface for factory-related
questions.

The assistant is integrated with:

-   Spring AI
-   Groq API
-   OpenAI-compatible Groq API
-   RAG document retrieval

The AI assistant can work with factory knowledge stored in uploaded
documents.

------------------------------------------------------------------------

## 9. Documents / Knowledge Base

The Documents module provides the foundation for the factory knowledge
base.

Capabilities include:

-   Document upload
-   Document listing
-   Document processing
-   PDF text extraction
-   Document chunking
-   Embedding generation
-   Vector-like similarity search
-   Document-based AI questions
-   RAG integration

The current RAG indexing workflow is primarily implemented for PDF
documents.

The frontend also supports document types such as:

-   PDF
-   DOCX
-   TXT

However, the current automatic RAG indexing workflow is PDF-focused.

------------------------------------------------------------------------

## 10. Reports

The Reports module provides a dedicated area for factory reporting and
operational information.

The module is included in the application navigation and is designed to
provide consolidated factory information and reporting capabilities.

------------------------------------------------------------------------

# Key Features

## Full-Stack Architecture

FACTORYX AI uses:

-   React + Vite for the frontend
-   Spring Boot for the backend
-   MySQL for persistent data
-   JWT for authentication
-   Spring AI for AI integration
-   Groq for LLM-powered responses
-   RAG for document-based knowledge retrieval

## Responsive Industrial UI

The frontend follows a dark industrial dashboard design.

Primary visual characteristics:

-   Dark teal/black background
-   Cyan highlights
-   Yellow/gold accents
-   Dashboard cards
-   Responsive layouts
-   Sidebar navigation
-   Top navigation bar
-   Status indicators
-   Data tables and cards
-   Interactive modals
-   Factory-oriented visual language

Primary accent color:

``` text
#FFD54F
```

Main background:

``` text
#031a1d
```

The UI uses fonts such as:

``` text
Inter
Arial
```

------------------------------------------------------------------------

# Technology Stack

## Frontend

-   React
-   Vite
-   JavaScript
-   React Router
-   Lucide React
-   CSS
-   REST API integration
-   JWT token handling

## Backend

-   Java
-   Spring Boot
-   Spring Web
-   Spring Data JPA
-   Hibernate
-   Spring Security
-   JWT
-   REST APIs
-   Maven
-   Apache PDFBox

## Database

-   MySQL
-   JDBC
-   Hibernate / JPA

## AI

-   Spring AI
-   Groq API
-   OpenAI-compatible API interface
-   `openai/gpt-oss-20b`

## RAG

-   PDFBox text extraction
-   Document chunking
-   Text embeddings
-   JSON-based embedding storage
-   Cosine similarity
-   Top-K retrieval
-   Context-aware AI responses

## Deployment

Frontend:

``` text
Vercel
```

Backend:

``` text
Render
```

Database:

``` text
MySQL
```

Development database configuration can be provided through environment
variables.

------------------------------------------------------------------------

# System Architecture

``` text
                         +----------------------+
                         |       Vercel         |
                         |   React + Vite UI    |
                         +----------+-----------+
                                    |
                                    | HTTPS / REST API
                                    v
                         +----------------------+
                         |       Render         |
                         |   Spring Boot API    |
                         +----------+-----------+
                                    |
                  +-----------------+------------------+
                  |                                    |
                  v                                    v
        +------------------+                 +-------------------+
        |      MySQL       |                 |    Spring AI      |
        | Database Layer   |                 |    AI Layer       |
        +------------------+                 +---------+---------+
                                                     |
                                                     v
                                               +-----------+
                                               |   Groq    |
                                               |    LLM    |
                                               +-----------+

Document Flow:

User
 |
 v
Upload PDF
 |
 v
PDFBox Text Extraction
 |
 v
Text Chunking
 |
 v
Embedding Generation
 |
 v
Embedding Storage
 |
 v
Cosine Similarity Search
 |
 v
Top-K Relevant Chunks
 |
 v
Spring AI / Groq
 |
 v
AI Response
```

------------------------------------------------------------------------

# Project Structure

The repository uses a combined frontend/backend structure:

``` text
factoryx/
│
├── .gitignore
│
├── factoryx-frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Machines.jsx
│   │   │   ├── Production.jsx
│   │   │   ├── Maintenance.jsx
│   │   │   ├── Inventory.jsx
│   │   │   ├── Quality.jsx
│   │   │   ├── Incidents.jsx
│   │   │   ├── AIAssistant.jsx
│   │   │   ├── Documents.jsx
│   │   │   └── Reports.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── CSS files
│   │
│   ├── package.json
│   └── vite.config.js
│
└── factoryx-backend/
    ├── src/
    │   └── main/
    │       └── java/
    │           └── com/
    │               └── factoryx/
    │                   └── factoryx_backend/
    │                       ├── config/
    │                       ├── controller/
    │                       ├── dto/
    │                       ├── entity/
    │                       ├── repository/
    │                       ├── service/
    │                       └── FactoryxBackendApplication.java
    │
    ├── Dockerfile
    ├── pom.xml
    └── application.properties
```

------------------------------------------------------------------------

# Frontend

The frontend is implemented using React with Vite.

## Main frontend responsibilities

-   UI rendering
-   Routing
-   Authentication state
-   JWT token storage
-   API communication
-   Forms
-   Modals
-   Dashboard visualization
-   Notifications
-   AI Assistant interface
-   Document upload interface
-   Reports interface

## Routing

The frontend contains routes for:

``` text
/login
/register
/dashboard
/machines
/production
/maintenance
/inventory
/quality
/incidents
/ai-assistant
/documents
/reports
```

The exact route names may vary according to the final router
configuration.

------------------------------------------------------------------------

# Backend

The backend is implemented using Spring Boot.

Package structure:

``` text
com.factoryx.factoryx_backend
```

Main layers:

### Controller

Handles HTTP requests and exposes REST APIs.

### Service

Contains business logic and processing workflows.

### Repository

Provides database access using Spring Data JPA.

### Entity

Represents database entities.

### DTO

Provides request and response data-transfer objects.

### Config

Contains application configuration, security configuration, and related
setup.

------------------------------------------------------------------------

# Authentication and Security

FACTORYX AI uses JWT-based authentication.

The authentication flow is:

``` text
User
 |
 v
Login / Register
 |
 v
Spring Boot Authentication API
 |
 v
JWT Token
 |
 v
Frontend localStorage
 |
 v
Authorization Header
 |
 v
Protected Backend APIs
```

Protected API requests use:

``` http
Authorization: Bearer <JWT_TOKEN>
```

The backend uses stateless Spring Security configuration.

Authentication APIs are available under:

``` text
/api/auth/**
```

The application also handles unauthorized responses such as:

``` text
401 Unauthorized
403 Forbidden
```

The frontend can redirect users back to the login page when the
authentication token is invalid or missing.

------------------------------------------------------------------------

# AI Assistant

The AI Assistant is integrated using Spring AI and the Groq API.

Current configuration uses the OpenAI-compatible Groq endpoint:

``` properties
spring.ai.model.chat=openai
spring.ai.openai.api-key=${GROQ_API_KEY}
spring.ai.openai.base-url=https://api.groq.com/openai/v1
spring.ai.openai.chat.model=openai/gpt-oss-20b
```

The API key must never be committed to GitHub.

It should be provided through an environment variable:

``` text
GROQ_API_KEY
```

------------------------------------------------------------------------

# RAG Document Knowledge Base

FACTORYX AI contains a document-based RAG workflow.

## RAG Pipeline

``` text
PDF Upload
    |
    v
PDFBox Extraction
    |
    v
Extracted Text
    |
    v
Chunking
    |
    v
Text Chunks
    |
    v
Embedding Generation
    |
    v
Embedding Storage
    |
    v
Similarity Search
    |
    v
Top-K Relevant Chunks
    |
    v
AI Prompt Context
    |
    v
Groq LLM
    |
    v
AI Answer
```

## Current Chunking Configuration

Chunk size:

``` text
1000 characters
```

Chunk overlap:

``` text
200 characters
```

## Similarity Search

The application uses cosine similarity to compare the query embedding
with stored document embeddings.

The most relevant chunks are selected using a Top-K retrieval approach.

## Document API

A document's chunks can be retrieved using:

``` http
GET /api/documents/{id}/chunks
```

AI chat can use a document context through:

``` http
POST /api/ai/chat
```

with the relevant document identifier.

------------------------------------------------------------------------

# Database

FACTORYX AI uses MySQL with Spring Data JPA/Hibernate.

The application is configured to read database configuration from
environment variables.

Example:

``` properties
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
```

Hibernate configuration:

``` properties
spring.jpa.hibernate.ddl-auto=${SPRING_JPA_HIBERNATE_DDL_AUTO:update}
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

For production, database credentials should be stored securely in the
hosting provider's environment variable system.

------------------------------------------------------------------------

# API Overview

The backend follows a REST-based architecture.

Major API groups include:

``` text
/api/auth/**
/api/machines
/api/production
/api/maintenance
/api/inventory
/api/quality
/api/incidents
/api/documents/**
/api/ai/**
/api/reports/**
```

The exact endpoints can evolve as additional backend functionality is
added.

## Example Production APIs

``` http
GET /api/production
POST /api/production
```

## Example Document APIs

``` http
GET /api/documents/{id}/chunks
```

## Example AI API

``` http
POST /api/ai/chat
```

------------------------------------------------------------------------

# Environment Variables

## Backend

The backend expects environment variables similar to:

``` text
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD
SPRING_JPA_HIBERNATE_DDL_AUTO
GROQ_API_KEY
PORT
```

Example:

``` text
SPRING_DATASOURCE_URL=jdbc:mysql://<MYSQL_HOST>:<MYSQL_PORT>/<DATABASE>?sslMode=REQUIRED
SPRING_DATASOURCE_USERNAME=<MYSQL_USERNAME>
SPRING_DATASOURCE_PASSWORD=<MYSQL_PASSWORD>
SPRING_JPA_HIBERNATE_DDL_AUTO=update
GROQ_API_KEY=<GROQ_API_KEY>
PORT=10000
```

Do not put real credentials in:

-   GitHub
-   README files
-   source code
-   screenshots
-   public documentation

------------------------------------------------------------------------

## Frontend

The frontend uses a Vite environment variable for the backend API.

Example:

``` text
VITE_API_URL=https://<backend-domain>
```

For local development:

``` text
VITE_API_URL=http://localhost:8081
```

The actual variable name must match the one used by the frontend source
code.

------------------------------------------------------------------------

# Local Development Setup

## Prerequisites

Install:

-   Java 21
-   Maven or Maven Wrapper
-   Node.js
-   npm
-   MySQL
-   Git

Optional for local AI embeddings:

-   Ollama

------------------------------------------------------------------------

## Clone Repository

``` bash
git clone https://github.com/chaurasiayaravi93483-debug/factoryx.git
cd factoryx
```

------------------------------------------------------------------------

# Backend Setup

Go to the backend:

``` bash
cd factoryx-backend
```

Build the backend:

### Windows

``` powershell
.\mvnw.cmd clean package -DskipTests
```

### Linux / macOS

``` bash
./mvnw clean package -DskipTests
```

Run the Spring Boot application:

``` bash
.\mvnw.cmd spring-boot:run
```

The backend uses:

``` text
http://localhost:8081
```

when running with the local default port.

------------------------------------------------------------------------

# Frontend Setup

Open another terminal:

``` bash
cd factoryx-frontend
```

Install dependencies:

``` bash
npm install
```

Run the development server:

``` bash
npm run dev
```

Vite will provide the local development URL in the terminal.

------------------------------------------------------------------------

# Frontend Production Build

Before deployment, verify the frontend build:

``` bash
npm run build
```

The build output is generated in:

``` text
dist/
```

------------------------------------------------------------------------

# Backend Production Build

Verify the backend package:

``` powershell
.\mvnw.cmd clean package -DskipTests
```

A successful build produces the Spring Boot JAR inside:

``` text
target/
```

------------------------------------------------------------------------

# Docker

The backend includes a Dockerfile for deployment.

Current Dockerfile architecture:

``` dockerfile
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

RUN chmod +x mvnw

COPY src src

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
```

This uses a multi-stage Docker build:

``` text
Maven + Java 21
      |
      v
Build JAR
      |
      v
Java 21 JRE image
      |
      v
Run Spring Boot application
```

------------------------------------------------------------------------

# Frontend Deployment

The intended frontend deployment platform is Vercel.

Repository:

``` text
factoryx
```

Frontend root directory:

``` text
factoryx-frontend
```

Build command:

``` text
npm run build
```

Install command:

``` text
npm install
```

Output directory:

``` text
dist
```

The frontend must use the deployed backend URL instead of:

``` text
http://localhost:8081
```

For example:

``` text
VITE_API_URL=https://<factoryx-backend-domain>
```

------------------------------------------------------------------------

# Backend Deployment

The intended backend deployment platform is Render.

Repository:

``` text
factoryx
```

Backend root directory:

``` text
factoryx-backend
```

Dockerfile:

``` text
factoryx-backend/Dockerfile
```

The application is configured to support a hosting-provider port using:

``` properties
server.port=${PORT:8081}
```

For Render, the environment can provide:

``` text
PORT=10000
```

The backend also requires database and Groq environment variables.

------------------------------------------------------------------------

# Deployment Architecture

The planned production architecture is:

``` text
                         GitHub
                           |
             +-------------+-------------+
             |                           |
             v                           v
          Vercel                       Render
      React Frontend              Spring Boot Backend
                                         |
                                         |
                                         v
                                       MySQL
                                         |
                                         v
                                      Groq AI
```

The frontend communicates with the backend through REST APIs.

The backend communicates with MySQL for application data and with Groq
for AI responses.

------------------------------------------------------------------------

# Current RAG Limitations

The current implementation has the following production considerations:

## Embedding Provider

The current embedding configuration uses Ollama:

``` properties
spring.ai.model.embedding=ollama
spring.ai.ollama.base-url=http://localhost:11434
spring.ai.ollama.embedding.model=mxbai-embed-large
```

This is suitable for local development where Ollama is running locally.

For cloud deployment, the embedding provider needs to be changed to a
cloud-accessible embedding service or another production-compatible
solution.

## File Storage

Uploaded documents are currently stored using a filesystem directory:

``` properties
file.upload-dir=uploads/documents
```

Cloud hosting filesystems may be ephemeral.

For production-scale document persistence, object storage such as
S3-compatible storage or another persistent storage solution should be
considered.

## Document Formats

The frontend supports PDF, DOCX, and TXT upload options, but the current
automatic RAG extraction/indexing implementation is primarily PDF-based
using Apache PDFBox.

------------------------------------------------------------------------

# File Upload Configuration

Current upload configuration:

``` properties
file.upload-dir=uploads/documents

spring.servlet.multipart.max-file-size=20MB
spring.servlet.multipart.max-request-size=20MB
```

Maximum configured request/file size:

``` text
20 MB
```

------------------------------------------------------------------------

# Git and Repository

The project uses a single GitHub repository containing both frontend and
backend:

``` text
factoryx
```

Repository structure:

``` text
factoryx/
├── factoryx-frontend/
└── factoryx-backend/
```

Build artifacts and local environment files are excluded using
`.gitignore`.

Examples include:

``` text
node_modules/
dist/
.env
.env.local
.env.production
target/
.idea/
*.log
```

Sensitive credentials must never be committed.

------------------------------------------------------------------------

# Development Workflow

A typical development workflow is:

``` text
1. Develop frontend
        |
        v
2. Develop REST APIs
        |
        v
3. Connect MySQL
        |
        v
4. Implement authentication
        |
        v
5. Integrate Spring AI + Groq
        |
        v
6. Implement document processing
        |
        v
7. Implement RAG retrieval
        |
        v
8. Test frontend + backend
        |
        v
9. Build frontend
        |
        v
10. Build backend
        |
        v
11. Push to GitHub
        |
        v
12. Deploy frontend and backend
```

------------------------------------------------------------------------

# Project Scope

FACTORYX AI intentionally focuses on the following modules:

``` text
1. Dashboard
2. Machines
3. Production
4. Maintenance
5. Inventory
6. Quality
7. Incidents
8. AI Assistant
9. Documents / Knowledge Base
10. Reports
11. Login / Register + JWT
12. Spring AI + Groq
13. RAG-based Document Knowledge Base
```

The project does not require unnecessary additional modules such as:

-   IoT simulator
-   WebSocket-based real-time simulation
-   Energy management
-   Factory hierarchy management
-   ML-based predictive maintenance
-   Unrelated enterprise modules

This keeps the project focused on its main full-stack, AI, and RAG
objectives.

------------------------------------------------------------------------

# Future Improvements

Potential future improvements include:

-   Production-ready cloud embedding provider
-   Persistent object storage for uploaded documents
-   DOCX and TXT text extraction for RAG
-   Better vector database integration
-   Advanced semantic search
-   RAG source citations in AI responses
-   Role-based access control
-   More detailed reports
-   Advanced analytics
-   Pagination and filtering
-   Audit logs
-   Automated testing
-   CI/CD pipeline
-   Production monitoring and logging
-   API documentation using OpenAPI/Swagger

------------------------------------------------------------------------

# Security Considerations

The following security practices should be followed:

1.  Never commit API keys.
2.  Never commit database passwords.
3.  Never expose JWT secrets publicly.
4.  Use environment variables for production credentials.
5.  Use HTTPS in production.
6.  Configure CORS for the deployed frontend domain.
7.  Use secure database credentials.
8.  Rotate credentials if they are accidentally exposed.
9.  Do not store sensitive credentials directly in frontend source code.

------------------------------------------------------------------------

# Testing Checklist

Before final deployment, verify:

### Frontend

``` text
[ ] npm install
[ ] npm run build
[ ] All routes load
[ ] Login works
[ ] Register works
[ ] JWT token is stored correctly
[ ] Logout works
[ ] API URL points to deployed backend
```

### Backend

``` text
[ ] Maven build succeeds
[ ] Application starts
[ ] MySQL connection works
[ ] JWT authentication works
[ ] REST APIs respond correctly
[ ] Groq API works
[ ] Document upload works
[ ] PDF extraction works
[ ] RAG search works
[ ] AI chat works
```

### Deployment

``` text
[ ] GitHub repository is updated
[ ] Vercel build succeeds
[ ] Render build succeeds
[ ] Database is reachable
[ ] Environment variables are configured
[ ] Frontend can communicate with backend
[ ] CORS is configured
[ ] AI API key is configured
```

------------------------------------------------------------------------

# Author

## Ravi Kumar

B.Tech Computer Science and Engineering

Project:

**FACTORYX AI --- Smart Factory Dashboard**

Technology focus:

``` text
Full-Stack Java Development
Spring Boot
React
MySQL
JWT
Spring AI
Generative AI
RAG
REST APIs
Docker
Cloud Deployment
```

------------------------------------------------------------------------

# License

This project is developed as an academic and portfolio project.

If you plan to publish or distribute the project commercially, add an
appropriate open-source or proprietary license before distribution.
