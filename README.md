# AI Interview Agent

An AI-powered technical interview platform designed to conduct personalized, adaptive, and context-aware interviews based on a candidate's learning journey throughout the AI Cohort.

## Overview

The AI Interview Agent goes beyond a traditional fixed question-and-answer format. It analyzes each candidate's response and dynamically determines what to ask next based on their understanding, performance, current difficulty, and learning context.

The system combines candidate profiles, curriculum data, completed topics, previous responses, interview state, and real-time answer analysis to create a personalized interview experience.

### Core Interview Loop

**Answer → Analyze → Adapt → Follow-up**

Instead of following a predefined questionnaire, the interviewer continuously adapts to the candidate's responses, allowing different candidates to experience different interview paths.

---

# Key Features

## Context-Aware Interviewer

Maintains context from previous questions, answers, and evaluations throughout the interview. This enables the AI to build on the candidate's previous responses and conduct a more natural technical conversation.

The interview state maintains relevant information such as:

* Current question
* Candidate response
* Previous questions and answers
* Evaluation history
* Current topic
* Current difficulty

## Adaptive Difficulty

Dynamically adjusts question difficulty based on the quality of the candidate's responses.

* **Strong answers** → More challenging questions
* **Partial answers** → Targeted follow-up questions
* **Weak answers** → Conceptual or simplified questions
* **Knowledge gaps** → Focused questions on weaker areas

The current difficulty is maintained as a **difficulty parameter** within the interview flow and is updated according to candidate performance. This parameter is used when generating the next question so that the interview remains appropriately challenging.

## Personalized Interviews

Uses candidate-specific information to make the interview relevant to the candidate's actual learning journey, including:

* Candidate profile
* Curriculum
* Completed topics
* Learning history
* Previous interview responses

## Intelligent Follow-Ups

Generates follow-up questions based on what the candidate actually says rather than following a fixed question sequence.

The system can identify:

* Incomplete explanations
* Missing concepts
* Misconceptions
* Areas requiring deeper evaluation

## Smart Analysis

Provides detailed analysis of candidate responses and helps candidates understand how their answers could be improved.

Smart Analysis includes:

* Candidate response analysis
* Missing Points
* Ideal Answer
* Additional Points
* Question-by-question analysis
* Actionable improvement feedback

### Missing Points

Identifies important concepts or points that the candidate failed to mention in their response.

### Ideal Answer

Shows what a strong answer to the interview question could contain and provides a reference for comparison.

### Additional Points

Highlights useful concepts, details, or explanations that could have strengthened the candidate's answer.

## Performance Report

Generates a comprehensive post-interview report based on the candidate's actual interview performance.

The report can cover:

* Technical performance
* Communication skills
* Problem-solving ability
* Topic-wise performance
* Strengths
* Knowledge gaps
* Areas for improvement
* Recommended revision topics

## Strong Answer Guidance

Provides insight into the important concepts expected in a strong technical answer. This helps candidates understand what they covered, what they missed, and how they could improve their responses.

---

# Interview Flow

```text
Candidate Selection
        ↓
Candidate Profile + Curriculum
        ↓
AI Generates Question
        ↓
Candidate Answers
        ↓
Response Analysis
        ↓
Update Difficulty Parameter
        ↓
Adaptive Difficulty / Follow-up
        ↓
Next Question
        ↓
Update Interview Context
        ↓
Repeat
        ↓
Performance Report / Smart Analysis
```

---

# Adaptive Interview Approach

```text
Candidate Context
       +
Previous Responses
       +
Current Answer
       +
Current Difficulty
       ↓
Response Analysis
       ↓
Determine Understanding
       ↓
Update Difficulty / Select Follow-up
       ↓
Generate Next Question
       ↓
Update Interview Context
       ↓
Repeat
```

The interview therefore does not require every candidate to follow the same sequence of questions. The next question is determined using the candidate's current performance and accumulated interview context.

---

# Frontend–Backend Integration

The frontend communicates with the AI interviewer through JavaScript and FastAPI.

The interview uses a **single interview endpoint** for the main interview communication rather than creating separate endpoints for every interview action.

The frontend sends the required interview information, including the interview session and candidate response, along with the current difficulty parameter when required.

```text
JavaScript Frontend
        ↓
Session / Candidate Response
        +
Difficulty Parameter
        ↓
POST /api/interview
        ↓
FastAPI Backend
        ↓
Interview / AI Logic
        ↓
AI-Generated Response
        ↓
JavaScript Frontend
        ↓
Display Next Question
```

The session information allows the backend to maintain the interview state across multiple requests.

---

# Performance Evaluation

The system evaluates the candidate across multiple dimensions.

## Technical Knowledge

* Conceptual understanding
* Correctness
* Depth of knowledge
* Ability to explain technical concepts

## Problem Solving

* Logical reasoning
* Approach to technical problems
* Ability to break down problems
* Quality of the solution

## Communication

* Clarity of explanation
* Structure of responses
* Completeness
* Ability to communicate technical concepts effectively

## Topic Performance

Identifies topics where the candidate demonstrates strong understanding as well as areas that require further revision.

---

# Tech Stack

## Frontend

* HTML5
* CSS3
* JavaScript
* Responsive UI
* Modern SaaS-inspired interface

## Backend

* Python
* FastAPI
* REST API
* Single interview endpoint
* Session-based interview state

## AI & Interview Intelligence

* Large Language Models (LLMs)
* Prompt Engineering
* Context-aware question generation
* Adaptive difficulty
* Difficulty parameter/state management
* Intelligent follow-up generation
* Candidate-specific evaluation
* Response analysis

## Data & AI Concepts

* JSON-based Candidate Profiles
* Curriculum Data
* Agentic AI


---

# Project Architecture

```text
                    Candidate
                        │
                        ▼
              Candidate Selection
                        │
                        ▼
             Candidate Context
          ┌─────────────┴─────────────┐
          │                           │
          ▼                           ▼
   Candidate Profile             Curriculum
          │                           │
          └─────────────┬─────────────┘
                        ▼
                Interview Engine
                        │
                        ▼
               Question Generation
                        │
                        ▼
                  Candidate Answer
                        │
                        ▼
                Response Analysis
                        │
              ┌─────────┴─────────┐
              │                   │
              ▼                   ▼
       Difficulty              Follow-up
       Adjustment              Generation
              │                   │
              └─────────┬─────────┘
                        ▼
                  Next Question
                        │
                        ▼
                Interview History
                        │
              ┌─────────┴─────────┐
              │                   │
              ▼                   ▼
       Smart Analysis       Performance Report
              │                   │
              └─────────┬─────────┘
                        ▼
                 Candidate Feedback
```

---

# Core Design Principles

## Personalization

Questions are generated according to the candidate's profile and learning context.

## Adaptability

The difficulty and direction of the interview can change based on candidate performance.

## Context Preservation

Previous questions, answers, evaluations, and interview state are retained to maintain continuity throughout the interview.

## Targeted Evaluation

The system focuses on understanding why an answer is strong, incomplete, or incorrect rather than evaluating only the final response.

## Actionable Feedback

Smart Analysis and the final report highlight strengths, missing concepts, knowledge gaps, and areas that the candidate can revise.

---

# Project Goals

The AI Interview Agent aims to build an interview experience that can:

1. Understand a candidate's learning context.
2. Conduct personalized technical interviews.
3. Adapt questions based on candidate performance.
4. Maintain a difficulty parameter throughout the interview.
5. Generate meaningful follow-up questions.
6. Identify technical strengths and knowledge gaps.
7. Evaluate technical knowledge, communication, and problem-solving.
8. Provide question-level Smart Analysis.
9. Provide actionable post-interview feedback.
10. Make technical interview preparation more interactive and personalized.

---

# Future Scope

Potential improvements include:

* Voice-based interviews
* Real-time speech analysis
* Coding interview support
* Multi-domain interview tracks
* Advanced candidate profiling
* Long-term learning progress tracking
* Improved difficulty calibration using historical interview data
* Personalized learning recommendations

---

# Project Status

The AI Interview Agent is being developed as part of the AI Cohort / NorthStar project.

The current implementation focuses on:

* Personalized technical interviews
* Context-aware question generation
* Adaptive difficulty
* Intelligent follow-up questions
* Candidate response analysis
* FastAPI-based interview integration
* JavaScript ↔ FastAPI communication
* Question-level Smart Analysis
* Performance reporting
* Actionable candidate feedback

---

# Contributors

Built collaboratively as part of the NorthStar project.
