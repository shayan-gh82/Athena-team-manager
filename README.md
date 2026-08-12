# Athena Team Manager

Athena is a polished **frontend-only team project management application** built with React + TypeScript. It fulfills the university Team Task Manager assignment and extends it with Trello/Asana-inspired workflows, analytics, collaboration UX, templates, customization, and a reusable design system.

There is intentionally **no backend**. Authentication, users, projects, tasks, notifications, comments, preferences, templates and collaboration data are stored locally in the browser.

> Local authentication is for coursework/demo purposes. It is not a production security model.

## Demo account

- Email: `manager@aurora.local`
- Password: `123456`

Seeded member accounts also use `123456` for local demo login.

## Assignment coverage

All required assignment areas are implemented:

- Team member management with Manager / Member roles
- Project creation and project list
- Project-level task management
- Task title, description, priority, workflow status, due date and assignee
- Add / Edit / Delete / Change status
- Search by title
- Filter by status, priority, assignee and due-date range
- Separate project, task, user and form experiences
- Browser persistence for users, projects, tasks and extended data
- Registration, login, logout, protected routes and active-user information
- Required due-date reminders and in-app notifications/toasts

See `SUBMISSION_CHECKLIST.md` for the requirement-by-requirement matrix.

## Extended product features

### Project & task workflow

- Project CRUD, archive, favorites, icon selector, accent color and templates
- Dynamic project progress derived from tasks in completed columns
- Task CRUD with edit/delete UI and success toasts
- Customizable Kanban columns using `columnId` as the single source of workflow status
- Rename, recolor and reorder columns
- Mark columns as completed without relying on the title `Done`
- Drag & drop Kanban
- Responsive List view with desktop table and mobile cards
- Pagination
- Calendar view
- Timeline / Gantt-style view
- Milestones and task dependency context
- Project analytics dashboard
- Global workspace dashboard
- My Tasks: Today / Upcoming / Overdue / Completed
- Shared search, filters and sorting across task views
- Task and Project archive/restore

### Collaboration & task details

- Labels
- Checklists
- Subtasks
- Threaded comments and nested replies
- Lightweight `@mention` notifications
- Reply notifications
- Small local attachments
- Dependencies
- Milestones
- Custom fields: Text / Number / Date / Select with configurable options
- Activity log
- Time tracking and team workload
- Recurring tasks
- Assignment notifications

### Templates & automation

- Project templates
- Built-in task templates
- Manager-created custom task templates
- Simple Trigger → Action automation rules
- Due-tomorrow and task-completed automation scenarios

### Accounts, roles & profile

- Register / Login / Logout
- Optional “Keep me signed in”
- Password visibility on login and registration
- Protected routes
- Manager / Member role-aware permissions
- Project membership access control
- Members can update/move tasks assigned to them
- Managers control project/task creation, team management, columns, archive and automations
- Active / inactive team accounts
- Avatar upload, resize and local persistence

### Product polish

- Athena semantic design system
- Full English / Persian localization with persistent language preference
- Automatic LTR / RTL layout switching, including navigation, drawers, forms and calendar behavior
- Light / Dark / System theme
- Premium dark palette with subtle CSS-only starfield and ambient violet/blue lighting
- Responsive icon and touch-target sizing across desktop, tablet and mobile
- Responsive desktop / tablet / mobile layouts
- Desktop collapsible sidebar + mobile navigation
- Command palette (`Ctrl/Cmd + K`)
- Reusable UI primitives
- Tooltip / Dropdown / Popover / Switch / Radio components
- Skeleton loading states
- Lazy-loaded routes and code splitting
- Application Error Boundary
- Notification center + toast host
- Empty states and confirmation dialogs
- Prettier and ESLint configuration

### Local data tools

- JSON backup / restore
- Tasks CSV import
- Tasks CSV export
- Projects CSV export
- Printable workspace report for browser “Save as PDF”

## Deliberately excluded from this version

Two previously discussed ideas are intentionally **not** included:

1. **Multiple Workspaces**
2. **Browser Push Notifications**

They were excluded by project decision. The app still has a full in-app notification center, reminder engine and toast notifications.

## Tech stack

- React 19
- TypeScript (strict)
- Vite
- Redux Toolkit + React Redux
- React Router
- Tailwind CSS v4 + semantic CSS variables
- React Hook Form
- Lucide React
- Recharts
- LocalStorage
- ESLint + Prettier

## Run locally

Node.js `>=20.19` is required.

```bash
npm install
npm run qa
npm run dev
```

`npm run qa` runs TypeScript checking, ESLint and a production Vite build.

Vite prints the local URL in the terminal, normally `http://127.0.0.1:5173/`.

## Useful scripts

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
npm run qa
npm run format
npm run format:check
npm run preview
```

## Architecture

```text
src/
├── components/
│   ├── layout/
│   ├── project/
│   ├── shared/
│   ├── task/
│   └── ui/
├── data/
├── pages/
├── store/
├── styles/
├── types/
└── utils/
```

### State model

Redux Toolkit is the application state source of truth. LocalStorage is only the persistence layer.

```text
UI → Redux Toolkit → persistence subscriber → LocalStorage
```

Components do not directly own the canonical project/task datasets.

### Task status / Kanban model

Tasks do **not** store a hard-coded status string. They store:

```ts
columnId: string
```

Board columns are independent project entities and can be renamed/reordered. Completion is expressed with `isCompletedColumn`, so renaming a completed column does not break progress calculations.

### Project progress

Progress is derived rather than stored:

```text
Tasks in completed columns / Total active project tasks × 100
```

### Persistence

The final compatible application snapshot is stored under:

```text
aurora-team-manager:v3
```

Older incompatible snapshots are intentionally not loaded into this final schema. Use **Settings → JSON backup** for portable local backups.

## Main routes

```text
/login
/register
/dashboard
/projects
/projects/new
/projects/:projectId/board
/projects/:projectId/list
/projects/:projectId/calendar
/projects/:projectId/timeline
/projects/:projectId/dashboard
/my-tasks
/team
/activity
/automations
/archive
/settings
```

