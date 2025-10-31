Project Brief: User Authentication & Onboarding Web App
Core Functionality:
A web application that implements user authentication with social login options via Supabase, followed by a one-time onboarding questionnaire for new users.
Key Components:

Authentication Layer

Supabase integration for user management
Social login provider (Google)
Session management and protected routes


First-Time User Flow

Detection of new user accounts (check if questionnaire completed)
3-question form with text input fields
Data persistence to link responses to user profile
Flag/marker in database to indicate questionnaire completion


User Experience Flow

Login → Check if first-time user → Questionnaire (if new) → Landing page
Returning users bypass questionnaire directly to landing page
Landing page displays static informational content


Technical Requirements:

Supabase project setup with authentication enabled
Database table for storing questionnaire responses
User metadata or separate table to track questionnaire completion status
Frontend framework (React/Next.js/Vue recommended for Supabase compatibility)
Route guards to enforce questionnaire completion before accessing main content

Database Schema Needs:

Users table (managed by Supabase Auth)
Questionnaire responses table (user_id, question_1, question_2, question_3, submitted_at)
Or alternatively: user profile table with questionnaire_completed boolean flag

This creates a streamlined onboarding experience where new users complete setup once, while returning users have frictionless access to the application content.