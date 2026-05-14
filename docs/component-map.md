# SAA Component Map

## Component Hierarchy

```
App
├── AuthProvider
│   └── ToastProvider
│       └── BrowserRouter
│           └── AppRoutes
│               ├── Public Pages
│               │   ├── HomePage → PublicNavbar, Footer
│               │   ├── LoginPage → FormInput, Button
│               │   └── RegisterPage → FormInput, Button
│               │
│               ├── Student Pages (wrapped in ProtectedRoute + DashboardLayout)
│               │   ├── DashboardPage → StatCard, Card
│               │   ├── ProfileBuilderPage → FormInput, FormSelect, MultiSelect, ProgressBar, Button
│               │   ├── UniversitiesPage → FilterPanel, UniversityCard, LoadingSpinner, EmptyState, ErrorAlert
│               │   ├── ScholarshipsPage → FilterPanel, ScholarshipCard, LoadingSpinner, EmptyState, ErrorAlert
│               │   ├── ShortlistPage → EmptyState, Card
│               │   ├── HowToApplyPage → Card
│               │   ├── WritingAssistantPage → DocumentTypeSelector, PromptContextForm, GeneratedDocumentEditor
│               │   ├── TemplatesPage → Card, LoadingSpinner, ErrorAlert
│               │   └── RoadmapPage → RoadmapProgress, MilestoneItem, LoadingSpinner, ErrorAlert
│               │
│               └── Admin Pages (wrapped in ProtectedRoute[admin] + DashboardLayout)
│                   ├── AdminLoginPage → FormInput, Button
│                   ├── AdminDashboardPage → StatCard, Card
│                   ├── ManageUniversitiesPage → AdminTable, UniversityForm, Modal, Button
│                   ├── ManageScholarshipsPage → AdminTable, ScholarshipForm, Modal, Button
│                   └── ManageStudentsPage → AdminTable
```

## Shared Components

| Component | Used By |
|-----------|---------|
| Button | All forms, modals, pages |
| Card | Dashboard, Shortlist, Templates, Roadmap |
| LoadingSpinner | All data-fetching pages |
| ErrorAlert | All data-fetching pages |
| EmptyState | Universities, Scholarships, Shortlist |
| Modal | Admin CRUD pages |
| ProgressBar | Profile Builder, Roadmap |
| StatCard | Dashboard, Admin Dashboard |
| FormInput | Login, Register, Profile, Admin forms, Writing |
| FormSelect | Profile, Admin forms, Filters |
| DashboardLayout + Sidebar | All authenticated pages |
| PublicNavbar | HomePage |
| Footer | HomePage |

## Service → Page Mapping

| Service | Pages |
|---------|-------|
| authService | LoginPage, RegisterPage, AdminLoginPage |
| profileService | DashboardPage, ProfileBuilderPage |
| recommendationService | UniversitiesPage, ScholarshipsPage |
| shortlistService | UniversitiesPage, ScholarshipsPage, ShortlistPage |
| roadmapService | RoadmapPage |
| writingService | WritingAssistantPage |
| templateService | TemplatesPage |
| adminService | AdminDashboardPage, ManageUniversitiesPage, ManageScholarshipsPage, ManageStudentsPage |
