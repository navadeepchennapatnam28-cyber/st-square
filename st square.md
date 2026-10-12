Act as a senior frontend engineer, UI/UX designer, and
full-stack application architect.

Build a premium, modern, responsive web application named:

byteXL STUDENT GROWTH HUB

PROJECT PURPOSE:
Help college students analyze academic performance, identify
weaknesses, improve placement readiness, practice coding,
discover projects, and explore startup opportunities.

IMPORTANT DEVELOPMENT REQUIREMENTS:
- Build an actual working React application.
- Do not create only a static screenshot.
- Every navigation link, button, card, tab, and interactive
  component must work.
- The frontend must work independently without a backend.
- Keep the architecture ready for future backend integration.
- Use reusable components and clean code.
- Do not leave buttons with empty click handlers.
- Do not implement fake backend requests.
- Use demo data until a real API is connected.

==================================================
1. TECHNOLOGY STACK
==================================================

Frontend:
- React.js
- Vite
- TypeScript
- Tailwind CSS
- Lucide React icons
- Recharts for charts
- React Router for navigation
- Framer Motion for animations

Backend:
Do not build or require the backend yet.

Prepare a clean API service layer so I can connect a backend
later using Node.js/Express, FastAPI, or another REST API.

Use environment variables for the future API base URL.

==================================================
2. PREMIUM UI DESIGN SYSTEM
==================================================

Create an exceptional futuristic dark dashboard using:

PRIMARY COLORS:
- Deep black: #08090C
- Dark charcoal: #111318
- Burnt orange: #FF6A00
- Bright orange: #FF8A00
- Amber: #FFB347
- White: #F5F7FA
- Muted text: #A1A7B3

VISUAL STYLE:
- Orange and black gradients.
- Premium liquid glass effects.
- Frosted glass cards.
- Semi-transparent dark panels.
- backdrop-filter blur.
- Subtle orange glowing borders.
- Soft ambient orange lighting.
- Glass-like reflections.
- Thin translucent borders.
- Beautiful gradient buttons.
- Rounded cards with consistent spacing.
- Smooth hover and click animations.
- Subtle background particles or blurred gradient blobs.
- Premium typography and excellent visual hierarchy.

Create a dark cinematic background with subtle orange
gradient waves around the edges.

Avoid excessive neon effects, clutter, and too many colors.
Maintain excellent readability and accessibility.

The final design should look like a premium modern SaaS
product, not a basic student project.

Use the supplied orange-and-black dashboard screenshot
as the main visual reference if available.

IMPORTANT:
Implement the design using real HTML, CSS, and React
components. Do not use the screenshot as the website background.

==================================================
3. MAIN LAYOUT
==================================================

Create a premium top navigation bar.

Left:
- byteXL logo-style text with orange lightning icon.
- Student Growth Hub subtitle.
- Search bar.

Center/right navigation:
- Dashboard
- My Projects
- Pro Code
- Startup Desk

Right:
- Notifications button
- Student avatar
- Student profile dropdown

Create a collapsible left sidebar with:

1. Overview
2. Academic Performance
3. Attendance
4. LMS Activity
5. Engagement
6. Placement Readiness
7. Skills & Feedback
8. ST Point
9. My Projects
10. Pro Code
11. Startup Desk
12. Settings

Every item must navigate to its respective page or section.

Use React Router for proper page navigation.
Highlight the currently active navigation item.

On mobile, replace the sidebar with a working slide-out menu.

==================================================
4. DASHBOARD OVERVIEW
==================================================

Create a welcome section:

"Welcome back, Student"
"Small steps every day lead to big results."

Add a visible DEMO MODE indicator.

Create four premium metric cards:

1. CGPA
2. Attendance
3. Placement Readiness
4. Technical Skills Score

Each card should include:
- Icon
- Metric value
- Progress or trend indicator
- Small chart or sparkline
- Hover animation
- Clickable interaction

Use realistic sample values for demonstration only.

When a card is clicked, navigate to the corresponding
detailed analytics page.

Do not claim that demo values represent actual student data.

==================================================
5. ST POINT — PERSONAL IMPROVEMENT ENGINE
==================================================

Create a dedicated ST Point section.

Display:
- Student performance comparison chart
- Academic trends
- Coding performance
- Aptitude performance
- Communication score
- Key insights
- Improvement priorities
- Personalized action plan

Example demo insight:

"Your coding score is lower than your other assessed skills."

Suggested actions:
- Practice DSA regularly.
- Complete coding challenges.
- Build portfolio projects.
- Take mock placement assessments.

Each insight card must have:
- Identified improvement area
- Supporting metric
- Explanation
- Recommended action
- Start Improving button
- Progress tracking

The Start Improving button must navigate to the relevant
learning resource, coding challenge, or project page.

Implement a transparent rule-based recommendation engine
using demo data.

Keep the analysis logic separate from the UI so a backend
or AI recommendation service can replace it later.

Never label students as failures or make unsupported claims.

==================================================
6. PERFORMANCE ANALYTICS
==================================================

Use Recharts to create:
- Semester-wise CGPA chart
- Attendance trend
- Placement readiness chart
- Coding, aptitude, and communication comparison
- Skill progress over time

Provide tooltips, legends, labels, and responsive sizing.

Clearly distinguish CGPA from percentage-based scores.

Use sample data only.

Each chart section should have working time-range filters
where applicable.

==================================================
7. PRO CODE
==================================================

Create a dedicated Pro Code page.

Features:

A. Coding Problems
- Search problems
- Filter by difficulty
- Filter by topic
- View problem details
- Display sample inputs and outputs
- Display constraints
- Provide hints
- Show solution explanations

B. MULTIPLE APPROACHES

Example problem:
"Find the Maximum Sum Subarray"

Display approaches such as:
- Brute Force
- Improved Approach
- Kadane's Algorithm

For every approach show:
- Explanation
- Algorithm steps
- Time complexity
- Space complexity
- Code examples

Support Java, Python, and C++ code display.

Add working tabs to switch languages and approaches.

Include a code editor interface if feasible.

If actual code execution is not implemented, clearly state
that the editor is in demo mode. Do not claim that code is
being executed.

C. CODING PROGRESS
- Solved problems
- Attempted problems
- Difficulty breakdown
- Recent activity

Every problem card must be clickable and open its detail page.

Use local demo data until backend integration.

==================================================
8. MY PROJECTS
==================================================

Create a premium project discovery and tracking page.

Include these example projects:

1. Student Attendance Analytics Dashboard
2. Placement Preparation Tracker
3. Campus Event Finder
4. College Bus Tracking System
5. Student Skill Assessment Platform
6. Personal Portfolio Website
7. Student Expense Tracker
8. AI-Powered Study Planner

Each project card must show:
- Project title
- Description
- Difficulty
- Technology stack
- Skills learned
- Estimated duration
- Project progress
- View Details button
- Start Project button
- Save Project button

Implement functional:
- Search
- Category filters
- Difficulty filters
- Sorting
- Saved projects
- Project detail pages
- Progress tracking

When the user clicks Start Project:
Open a detailed project page with:
- Project overview
- Problem statement
- Features
- Suggested tech stack
- Development milestones
- Learning resources
- GitHub repository field
- Progress checklist

Use placeholder links only when real resources are unavailable.
Clearly identify placeholders and do not invent real repositories.

==================================================
9. STARTUP DESK
==================================================

Build an attractive Startup Desk page with orange glass cards.

Main heading:
"Have an idea? Build it!"

Features:
- Explore startup ideas
- Submit an idea
- View idea details
- Create a startup team
- Browse team opportunities
- Find collaborators by skill
- Track prototype milestones
- Save ideas
- View upcoming opportunities

Create a working idea submission form with:
- Idea title
- Problem statement
- Proposed solution
- Domain
- Required skills
- Current stage
- Team requirements

Validate all required fields.

Allow submitted ideas to appear immediately in the local
demo interface.

Add filters for domain and development stage.

Use local storage to persist demo submissions.

Keep private contact details hidden by default.

==================================================
10. SUGGESTED DATA
==================================================

Create a Suggested Data section.

Categories:

ACADEMIC:
CGPA, marks, backlogs, subject performance.

ATTENDANCE:
Overall attendance, subject-wise attendance.

LMS:
Login frequency, assignment completion.

ENGAGEMENT:
Events, clubs, hackathons, certifications.

PLACEMENT:
Aptitude score, coding score, mock interviews.

SKILLS:
Technical and soft-skill assessments.

FEEDBACK:
Student satisfaction and faculty feedback.

Each category must be clickable and open a detailed page
or modal explaining the available metrics.

Add search and category filters where useful.

Use demo data only.

==================================================
11. CLICKABLE UI REQUIREMENTS
==================================================

This requirement is extremely important.

Every visible interactive element must work.

Implement:
- Sidebar navigation
- Header navigation
- Search functionality
- Profile dropdown
- Notification dropdown
- Metric card navigation
- Chart filters
- Tabs
- Modal windows
- Forms
- Form validation
- Save buttons
- Project filters
- Project detail navigation
- Coding problem navigation
- Language selector
- Approach selector
- Startup idea submission
- Team discovery navigation
- Progress checklist
- Toast notifications
- Back navigation
- Mobile navigation menu

Do not use href="#" for navigation.

Use React Router for internal pages.

For external links, use meaningful valid destinations
only when verified.

For unavailable external resources, show a clear
"Coming Soon" or "Resource not configured" message.

Use appropriate accessible button and link elements.

==================================================
12. BACKEND-READY ARCHITECTURE
==================================================

Prepare the project for future backend integration.

Create a structure similar to:

src/
  components/
    layout/
    dashboard/
    charts/
    st-point/
    pro-code/
    projects/
    startup-desk/
    ui/

  pages/
    DashboardPage.tsx
    AcademicPage.tsx
    AttendancePage.tsx
    PlacementPage.tsx
    SkillsPage.tsx
    STPointPage.tsx
    ProjectsPage.tsx
    ProjectDetailsPage.tsx
    ProCodePage.tsx
    ProblemDetailsPage.tsx
    StartupDeskPage.tsx
    SettingsPage.tsx

  services/
    apiClient.ts
    dashboardService.ts
    studentService.ts
    stPointService.ts
    projectService.ts
    codingService.ts
    startupService.ts

  data/
    demoDashboard.ts
    demoProjects.ts
    demoProblems.ts
    demoStartupIdeas.ts

  hooks/
  types/
  utils/
  App.tsx
  main.tsx

Create an API client using an environment variable:

VITE_API_BASE_URL

Provide an .env.example containing:

VITE_API_BASE_URL=http://localhost:5000/api

Create typed service functions for future endpoints.

For now, service functions should use local demo data
and must not make unnecessary network requests.

Use a clear configuration switch to select DEMO mode
or API mode.

When API mode is enabled, use the configured API base URL.

Handle loading, empty, success, and error states.

Do not hardcode backend URLs across components.

Do not build a fake backend or pretend that data has been
saved to a real database.

Use localStorage only for appropriate demo preferences,
saved projects, progress, and demo-created startup ideas.

==================================================
13. PERFORMANCE AND RESPONSIVENESS
==================================================

Ensure:
- Desktop layout matches the visual reference.
- Tablet layout adapts correctly.
- Mobile layout is fully usable.
- No horizontal overflow.
- Charts resize correctly.
- Components remain readable.
- Animations are smooth and not excessive.
- Use reusable components.
- Avoid unnecessary dependencies.

Respect reduced-motion preferences.

==================================================
14. FINAL IMPLEMENTATION AND TESTING
==================================================

First inspect the current workspace.

Preserve existing project files where appropriate.

Install and configure required dependencies.

Implement the full frontend.

Run the development server and resolve build errors.

Test:
- Every route
- Sidebar and top navigation
- Search and filters
- All main buttons
- Project details
- Coding problem details
- Startup idea submission
- Demo persistence
- Responsive layouts

Do not stop after generating a plan.

Do not deliver only a dashboard screenshot.

Create the actual application and explain:
1. Files created
2. Features implemented
3. How to run the application
4. How to configure the API URL later
5. Any features that remain in demo mode

FINAL GOAL:

Deliver an exceptional orange-and-black liquid-glass
Student Growth Hub with functional navigation, working
interactive components, personalized demo insights,
coding practice, project discovery, and Startup Desk.

The application must be backend-ready without requiring
a backend to run the frontend today.