# NEXUS – Presentation Script

## Slide 1 – Title
**NEXUS – A Unified Multi-Domain Digital Platform**
Java Full Stack Development Capstone
Student ID: 24EG107D60

Say: “NEXUS is one website that connects people from different fields such as education, agriculture, healthcare, business, technology and community services. The goal is to reduce information fragmentation by providing one secure digital ecosystem.”

## Slide 2 – Problem Statement
People currently depend on separate websites for learning resources, jobs, events, agriculture information, services and communities. This creates information gaps and poor discoverability.

Say: “Our problem is not lack of information; it is that information is scattered.”

## Slide 3 – Proposed Solution
NEXUS provides one common platform with field selection, personalized dashboards, resource sharing, opportunities, events and community discussions.

## Slide 4 – Users
- Students
- Faculty
- Farmers
- Professionals
- Admins

Explain that all use the same website and database, but their role/domain controls what they can access.

## Slide 5 – Technology Stack
Frontend: React + Vite + Axios
Backend: Java 17 + Spring Boot
Database: MySQL
Security: Spring Security + JWT + BCrypt
AI: REST-based LLM integration + RAG retrieval
Testing: JUnit / Spring Boot Test
DevOps: Direct Java/Maven + MySQL setup
API documentation: Swagger / OpenAPI

## Slide 6 – Architecture
Browser → React UI → Axios → Spring Boot REST API → Service Layer → JPA Repository → MySQL

AI flow:
User question → retrieval from NEXUS resources → context → optional LLM → answer

## Slide 7 – Authentication
Explain registration, password validation, BCrypt hashing, JWT token generation, protected routes and role-based access.

Important demo: enter a password with fewer than 6 characters and show the exact incorrect-password validation.

## Slide 8 – CRUD
Demonstrate creating a post/resource/event/opportunity, reading it from MySQL, updating where supported, and deleting it.

## Slide 9 – JPA / Database
Entities include User, Post, Event, Resource and Opportunity. Repositories provide database access and controllers expose REST APIs.

## Slide 10 – AI + RAG
NEXUS Assistant retrieves relevant resource information and uses it as context. The project has a local fallback so the demo works without an API key. An OpenAI-compatible API can be enabled through environment variables.

## Slide 11 – Testing + Swagger
Open Swagger UI and show the endpoint groups. Explain that the Spring Boot context test verifies the application can start and that APIs can be tested through Postman.

## Slide 12 – Docker
Explain that Docker Compose starts MySQL, Spring Boot backend and Nginx frontend as separate services.

## Slide 13 – Deployment
Frontend → Vercel/Netlify
Backend → Render/Railway
Database → managed MySQL
Environment variables connect the deployed services.

## Slide 14 – Future Scope
Vector database, embeddings, multilingual support, real-time chat, mobile app, notifications and AI recommendations.

## Slide 15 – Conclusion
“NEXUS demonstrates a complete production-oriented Java full-stack application covering frontend, backend, database, security, AI integration, testing, containerization and deployment.”
