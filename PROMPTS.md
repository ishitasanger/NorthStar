# AI Usage Log — The Interview Agent

This file documents the AI-assisted development process used during the hackathon.

The log contains prompts, requirements, debugging requests, and implementation guidance used while developing the project. Some entries are lightly cleaned for readability while preserving the original development intent.
Where applicable, prompts are reproduced from the development conversation. Some entries have been lightly organized or cleaned for readability.


## ANNU'S PROMPTS

> 1. Please go through this. My part is to make the frontend. I have attached how the pages should look like. I need to make an interactive frontend within 2 hours, and then the FastAPI connection with JS will be done by my teammate. I want good UI/UX design, dark mode, and an interactive SaaS look.

> 2. Give me the CSS files of all the things so that I can just copy-paste the code. The interface should be darker in nature and should look good with bright colors and good SaaS quality. I want a glass effect, colorful gradients, interactive hover buttons, and a modern UI/UX design. I previously used flying/glowing particles behind the website, but this time I don't want exactly the same thing. Add a similar type of interesting background/design through CSS.

> 3. Start with JS now.

> 4. How do I check the overall workflow in the terminal when I currently only have the frontend code and FastAPI/backend is not ready?

> 5. Give me the codes of all the HTML files so I can check the complete frontend because I have done the HTML, CSS and JS but I am not able to see everything correctly.

> 6. The frontend is looking very bad. I want glassmorphism, moving/flying particles in the background, colorful gradients, a SaaS-style website, hover buttons, and a good mix of colors instead of everything being white. Please improve the UI.

> 7. Give me the remaining CSS files also because they are still looking the same as the earlier page. Make the styling consistent across all pages.

> 8. I am still facing the same issue. Give me all the HTML files again except the dashboard.

> 9. Give me the HTML and CSS files simultaneously for the interview page and the remaining pages. Increase the font size a little and make sure the interface looks good.

> 10. The project structure has changed. We are no longer using the bookmark and archive concept.

>The first page of the Interview Agent should look like a modern SaaS product with:
>- Dark but not excessively dark design
>- Glassmorphism
>- Gradient colors
>- Glowing effects
>- Flying/glowing particles in the background
>- Modern UI/UX

>The first page should explain the website itself and include feature cards for:
>- Technical Interview
>- Performance Report
>- Context-aware interviewer
>- Adaptive difficulty
>- Personalized interviews
>- Intelligent follow-ups
>- What a strong answer includes

>The second page should be a candidate selection page. Candidate information will come from a JSON file. It should contain:
>- Candidate names
>- A human-like but abstract/blurred profile image
>- Glassmorphism
>- Gradient styling
>- Flying particles
>- Clickable candidate cards

>Clicking a candidate should take the user to the interview page.

>11. Give me the interview HTML and CSS file along with the JS file, and the report CSS, HTML and JS files.

>12. The candidate ID is opening the wrong interview path. Help me fix the navigation and file paths between the candidate page and interview page.

>13. I am not able to see the report section on the site. However, if I click report.html through Live Server, it opens correctly. Is it not connected to the dashboard/interview page?

>14. I have not added the JS files yet because my friend will do that part. Why is the report not visible in the sidebar?

>15. Give me a complete README for the project. It should explain:
- What the Interview Agent does
- The technology stack used
- The major features

>The README should not be unnecessarily large.

>16. Give me the prompts that I asked you to be written in prompts.log.

## Ishita's prompts

# PROMPTS.md — AI Interviewer Development Prompt Log

## 1. Understanding and Working With the Existing Project

### Prompt 1

> Review my existing project structure properly before making any changes.

### Prompt 2

> Use my final project structure as the sole source of truth. Do not invent or assume files that aren't part of my project.

### Prompt 3

> I will give you my existing code. Read it properly first and then make the requested changes without breaking the existing functionality.

### Prompt 4

> Whenever you update a file, preserve the functionality that is already working and only add/fix what is required.

### Prompt 5

> Give me the complete updated file so I can directly replace my existing file.

### Prompt 6

> Don't just give me a snippet. Update my existing code with the new changes while keeping the rest of the code intact.

### Prompt 7

> Check the current implementation before telling me what needs to be changed.

---

## 2. Updating Existing Backend / Agent Code

### Prompt 8

> Update the existing interviewer-related agent code according to the new interview requirements while keeping the current architecture.

### Prompt 9

> Integrate the updated agent code with the rest of my existing backend instead of creating a separate implementation.

### Prompt 10

> Update the existing interview logic so that the generated questions and responses work correctly with the current frontend flow.

### Prompt 11

> Make the required changes to the existing backend files without changing the overall project structure.

### Prompt 12

> Make sure the updated backend components continue working together after the changes.

### Prompt 13

> Check all the related backend files together before making the changes because changing one file may affect the interview flow.

---

## 3. FastAPI Integration

### Prompt 14

> Connect my existing AI interviewer backend to the frontend using FastAPI.

### Prompt 15

> Integrate the interview frontend with the FastAPI backend instead of handling the interview logic entirely in JavaScript.

### Prompt 16

> Connect the JavaScript interview page to the FastAPI API and make the complete request-response flow work.

### Prompt 17

> Make the frontend send the candidate's answer to FastAPI and receive the next AI-generated question.

### Prompt 18

> Make sure the response returned by FastAPI is correctly received and displayed by the JavaScript frontend.

### Prompt 19

> Check the FastAPI request and response flow and fix the integration if the frontend isn't receiving the backend output.

### Prompt 20

> Debug why the LLM output is not appearing on the frontend even though the backend is working.

---

## 4. Single Endpoint Approach

### Prompt 21

> Keep the interview communication through one endpoint instead of creating multiple endpoints for every interview action.

### Prompt 22

> Use only one interview endpoint for the frontend-backend communication and handle the interview flow through that endpoint.

### Prompt 23

> Don't create separate endpoints unnecessarily. Take the existing interview endpoint and integrate the required functionality through it.

### Prompt 24

> Modify the existing single endpoint to support the updated interview flow instead of adding another API endpoint.

### Prompt 25

> Make the JavaScript work with the one existing interview endpoint and correctly send/receive the required interview data.

### Prompt 26

> Check that the frontend is calling the correct single FastAPI endpoint and that the backend is returning the expected response.

---

## 5. JavaScript ↔ FastAPI Connection

### Prompt 27

> Update my interview JavaScript so it communicates with the FastAPI backend.

### Prompt 28

> Send the candidate's answer from JavaScript to the backend and use the returned response to display the next question.

### Prompt 29

> Fix the JavaScript request so it matches the FastAPI endpoint and expected request format.

### Prompt 30

> Fix the JavaScript response handling so the backend-generated question actually appears on the page.

### Prompt 31

> Check my existing JavaScript carefully and update it instead of replacing the whole interview flow unnecessarily.

### Prompt 32

> Give me the complete updated interview JavaScript that includes the new backend integration.

### Prompt 33

> Debug the frontend-backend communication without breaking the existing interview UI.

---

## 6. Interview Flow / Controls

### Prompt 34

> Right now the interview starts automatically when I reach the page. Add a Start Interview button so it doesn't start automatically.

### Prompt 35

> Put Start Interview alongside Pause Interview and End Interview.

### Prompt 36

> Make the Start Interview button actually control when the interview begins.

### Prompt 37

> Add Pause Interview functionality while preserving the current interview state.

### Prompt 38

> There was an End Interview button before but now I'm unable to reach/find it. Restore the End Interview button above alongside Pause Interview.

### Prompt 39

> Make End Interview properly terminate the interview and preserve the interview results.

### Prompt 40

> Check the interview controls after the other frontend changes and make sure existing functionality hasn't disappeared.

---

## 7. Report Integration

### Prompt 41

> Connect the completed interview data to the Report page.

### Prompt 42

> Save the interview feedback so that the Report page can retrieve it after the interview ends.

### Prompt 43

> Update report.js to retrieve the saved interview feedback and candidate information.

### Prompt 44

> Make the Report page display the actual interview results instead of static information.

### Prompt 45

> Connect the End Interview flow with the Report page so the candidate can see the results after completing the interview.

### Prompt 46

> Check why the interview feedback isn't appearing correctly on the Report page and fix the data flow.

---

## 8. Smart Analysis — Core Feature

### Prompt 47

> Create a Smart Analysis feature for the completed interview.

### Prompt 48

> I have created Smart Analysis HTML, CSS and JavaScript files. What should I do next to integrate them into the project?

### Prompt 49

> Give me the JavaScript for Smart Analysis based on my existing project and interview data.

### Prompt 50

> Connect Smart Analysis to the actual completed interview data rather than using static information.

### Prompt 51

> Make Smart Analysis analyze the candidate's actual interview answers and evaluations.

### Prompt 52

> Add meaningful candidate performance analysis including strengths, weaknesses, and areas for improvement.

---

## 9. Smart Analysis — Missing Points

### Prompt 53

> Add a Missing Points feature to Smart Analysis that identifies important points the candidate failed to mention in their answer.

### Prompt 54

> Make Missing Points based on the expected/ideal answer rather than generic feedback.

### Prompt 55

> Show the candidate what important concepts were missing from their answer.

---

## 10. Smart Analysis — Ideal Answer

### Prompt 56

> Add an Ideal Answer section to Smart Analysis showing what a strong answer to the interview question should have looked like.

### Prompt 57

> Generate the ideal answer based on the actual interview question and expected content.

### Prompt 58

> Compare the candidate's answer with the ideal answer so the candidate understands what a better response could look like.

---

## 11. Smart Analysis — Additional Points

### Prompt 59

> Add an Additional Points section to Smart Analysis showing useful points the candidate could have included.

### Prompt 60

> Make Additional Points provide useful concepts or details that would strengthen the candidate's answer.

### Prompt 61

> Show additional information that the candidate should know beyond what they actually answered.

---

## 12. Question-by-Question Smart Analysis

### Prompt 62

> Make Smart Analysis evaluate the candidate's answers question-by-question instead of only giving an overall interview summary.

### Prompt 63

> For each interview question, show the candidate's answer and the analysis associated with that answer.

### Prompt 64

> Compare the candidate's answer with the expected answer and identify missing and additional points.

### Prompt 65

> Make the Smart Analysis feedback actionable so the candidate knows exactly how to improve their answer.

---

## 13. Smart Analysis Navigation / Integration

### Prompt 66

> Add Smart Analysis to the application's sidebar.

### Prompt 67

> Smart Analysis appears in the sidebar but not on the Interview and Report pages. Add it there too.

### Prompt 68

> There are two Smart Analysis buttons. Find the duplicate and remove it.

### Prompt 69

> When I click the pink Smart Analysis button no page appears. Fix the navigation.

### Prompt 70

> Make the Smart Analysis sidebar button correctly open the Smart Analysis page.

### Prompt 71

> Keep Smart Analysis navigation consistent across the Interview, Report, and other relevant pages.

### Prompt 72

> Remove Learning Mode from the interface.

---

## 14. HTML / CSS Debugging

### Prompt 73

> I think only the HTML code is appearing and the CSS isn't loading even though the CSS file exists. Why?

### Prompt 74

> Check the HTML and CSS connection and find out why the stylesheet isn't being applied.

### Prompt 75

> Fix the CSS loading issue without changing the existing page functionality.

### Prompt 76

> Check the file paths and stylesheet references in my HTML.

---

## 15. Repeated Code Updates / Debugging

### Prompt 77

> I am sending you my current code. Update this exact code with the new changes.

### Prompt 78

> Take this existing file and add the requested functionality without removing anything that is already working.

### Prompt 79

> Check this file properly before giving me the updated version.

### Prompt 80

> Give me the entire updated code so I can replace my current file directly.

### Prompt 81

> Something that was working before has disappeared after the latest changes. Find what broke and restore it.

### Prompt 82

> Don't fix one feature by breaking another existing feature.

### Prompt 83

> Check the interaction between the HTML, CSS, and JavaScript before making the change.

### Prompt 84

> Check the integration across the relevant files rather than assuming the problem is only in one file.

### Prompt 85

> Tell me what files you need from me so you can correctly update the implementation.

---

## 16. End-to-End Debugging

### Prompt 86

> Check the complete flow from the Interview page to the backend and then to the Report and Smart Analysis pages.

### Prompt 87

> Make sure the interview data isn't lost between the interview, Report, and Smart Analysis pages.

### Prompt 88

> Debug the complete frontend-backend flow after the latest changes.

### Prompt 89

> Check whether the latest changes have broken any previously working functionality.

### Prompt 90

> Tell me what I should test after implementing these changes.

## 17. Adaptive Difficulty Parameter

### Prompt 91

> Add a difficulty parameter to the interview request so that the backend can keep track of the current interview difficulty.

### Prompt 92

> Pass the current difficulty between the frontend and FastAPI along with the interview session data.

### Prompt 93

> Make sure the difficulty value is updated based on the candidate's answer and is used when generating the next question.

### Prompt 94

> Integrate the difficulty parameter into the existing single interview endpoint instead of creating another endpoint.

### Prompt 95

> Check that the current difficulty is preserved throughout the interview and changes correctly when the candidate performs strongly, weakly, or at an average level.


## NIKITA'S PROMPTS

# PROMPTS LOG

## Key Project Prompts & Requirements

### 1. Core AI Interviewer

**Prompt:**

> Build an AI technical interviewer that can conduct an interview dynamically based on the candidate's profile and learning journey. Don't use a fixed list of questions. The interviewer should decide the next question based on the candidate's previous answer and the available curriculum/context.

**Purpose:** Define the core behavior of the AI interviewer.

---

### 2. Context-Aware Interview

**Prompt:**

> Make sure the interviewer keeps track of the questions that were already asked, the candidate's answers, and the previous evaluation. The next question should use this context instead of behaving like a completely new interview question.

**Purpose:** Maintain conversation and interview context across multiple questions.

---

### 3. Adaptive Difficulty

**Prompt:**

> Make the interview difficulty adaptive based on the candidate's answer. If the answer is strong, move towards a harder question. If the candidate is struggling or gives an incorrect answer, reduce the difficulty or ask a simpler follow-up. If the answer is partially correct, ask a follow-up that checks the missing understanding.

**Purpose:** Dynamically adjust question difficulty based on candidate performance.

---

### 4. Candidate Personalization

**Prompt:**

> Use the candidate's profile, curriculum, learning history, and topics they have already studied when generating interview questions. Don't ask questions that are unrelated to the candidate's learning journey.

**Purpose:** Personalize the interview according to the candidate's background and learning history.

---

### 5. Intelligent Follow-Up Questions

**Prompt:**

> The interviewer should generate follow-up questions from the candidate's actual answer. Identify what the candidate understood, what they missed, or where their explanation is unclear, and use that information to decide what to ask next.

**Purpose:** Make follow-up questions meaningful instead of following a predefined question sequence.

---

### 6. Answer Evaluation

**Prompt:**

> Evaluate each candidate answer for correctness, technical understanding, completeness, reasoning, and clarity. Identify what the candidate got right, what is missing, and whether the answer shows strong, average, or weak understanding.

**Purpose:** Provide structured evaluation that can be used by the interviewer to decide the next step.

---

### 7. Interview State and Context

**Prompt:**

> Maintain the interview state throughout the session, including the current question, candidate answer, previous questions, evaluations, topic, and current difficulty. Make this information available when generating the next question.

**Purpose:** Keep the different parts of the interview connected across multiple turns.

---

### 8. Next Question Generation

**Prompt:**

> Based on the candidate's latest answer, evaluation, current difficulty, and interview context, generate the next appropriate technical question. The question should either continue the topic, ask a relevant follow-up, or move to another topic when appropriate.

**Purpose:** Make next-question generation depend on the actual interview state.

---

### 9. Knowledge Gap Detection

**Prompt:**

> Identify concepts or important points that the candidate appears to be missing from their answer. Use these gaps to decide whether the interviewer should ask a follow-up question or move to a different difficulty level.

**Purpose:** Detect gaps in the candidate's technical understanding.

---

### 10. Performance Report

**Prompt:**

> After the interview is completed, generate a performance report based on the candidate's actual questions, answers, and evaluations. Include technical performance, communication, problem-solving, strengths, weaknesses, knowledge gaps, topic-wise performance, and areas for improvement.

**Purpose:** Generate useful post-interview feedback from the actual interview.

---

### 11. Strong Answer / Ideal Answer Guidance

**Prompt:**

> For each technical question, determine what a good or complete answer should contain. Use this to identify which important concepts the candidate covered and which concepts they missed.

**Purpose:** Provide a reference for evaluating the candidate's response.

---

### 12. Personalized Feedback

**Prompt:**

> Generate feedback based on the candidate's actual performance rather than generic interview advice. Explain what they did well, what they misunderstood or missed, and what they should revise or practice next.

**Purpose:** Make the final feedback personalized and actionable.

---

## Interview Flow

The interviewer should follow this general flow:

Candidate Selection
↓
Load Candidate Profile + Curriculum
↓
Generate Initial Question
↓
Candidate Gives Answer
↓
Evaluate Answer
↓
Identify Understanding / Knowledge Gaps
↓
Determine Difficulty
↓
Generate Follow-Up or Next Question
↓
Update Interview Context
↓
Repeat Until Interview Ends
↓
Generate Final Performance Report

## Design Requirements

* The interviewer should not follow a fixed questionnaire.
* The next question should depend on the candidate's previous answer.
* Previous questions, answers, and evaluations should be retained as interview context.
* Difficulty should adapt according to candidate performance.
* Follow-up questions should address gaps or unclear parts of the candidate's response.
* Questions should be relevant to the candidate's profile and curriculum.
* The system should identify strengths and knowledge gaps during the interview.
* The final report should be based on the actual interview rather than generic feedback.
* Feedback should help the candidate understand what they need to improve.
* The system should maintain the interview state throughout the session.
