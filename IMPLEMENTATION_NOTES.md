# Integration & Refactor Notes

## Important fixes applied to the teammate foundation

1. Project progress reads the current Redux task state rather than `taskMock`.
2. Completion is based on `BoardColumn.isCompletedColumn`, not a column title equal to `Done`.
3. Task status uses `columnId`; board columns are separate and customizable entities.
4. Task filter state supports search, priority, status/column, assignee, due-date range and sorting.
5. Task edit/delete actions are connected to both desktop and mobile UI.
6. Project and Task models include timestamps and metadata used by the extended application.
7. Project deletion removes project tasks and their task-level collaboration records.
8. LocalStorage access is centralized through a versioned persistence layer.
9. Shared UI and semantic design tokens are centralized.
10. Authentication, protected routes, active-user UI and role-aware controls were added.

## Architecture decisions

- Redux Toolkit is the canonical application state.
- One versioned LocalStorage snapshot stores the application state.
- No backend or cloud database is used.
- Small attachments are stored as Data URLs and limited to 1 MB per attachment.
- HTML5 drag/drop is used for the Kanban board to keep the dependency surface small.
- Project progress is derived data and is never manually persisted as a percentage.
- `isArchived` is the only project archive flag; project lifecycle status remains planning/active/completed.
- User-facing IDs are strings generated with `crypto.randomUUID()` when available.

## Product hardening and extensions

11. Added required due-soon reminders independent from optional automation rules.
12. Added task archive and archive restore flows.
13. Added list pagination and responsive TaskCard rendering on mobile.
14. Added Kanban column reordering while keeping `columnId` as the workflow source of truth.
15. Added assignment/reassignment notifications.
16. Added role protection to create/edit routes and manager-only organizational controls.
17. Timeline surfaces milestones and dependency context.
18. Project analytics includes Pie, Bar and Line charts.
19. Settings includes CSV import/export, JSON backup/restore and printable PDF reporting.
20. Added optional “Keep me signed in” behavior.
21. Added built-in and manager-created Task Templates.
22. Added threaded comment replies with recursive rendering/deletion and reply notifications.
23. Completed Custom Fields for text, number, date and select fields with configurable options.
24. Added project icon selection and icon rendering across project UI.
25. Added avatar upload/removal with client-side resize to 256×256 before LocalStorage persistence.
26. Hardened Manager/Member access so members only access projects they belong to and only update/move their assigned tasks.
27. Added Active/Inactive team account state and blocked inactive users from login.
28. Added reusable Skeleton, Tooltip, Switch, Radio, Dropdown and Popover components.
29. Added lazy route loading/code splitting and an application Error Boundary.
30. Added Prettier configuration and project formatting scripts.
31. Upgraded persistence compatibility to `aurora-team-manager:v3` and reject structurally incompatible backups.
32. Added date validation to project/task forms and required task assignee + due date in the UI.
33. Added password visibility to registration.
34. Added success notifications/toasts for project/task create, update and delete flows.
35. Pinned package versions rather than relying on broad version ranges for more reproducible installs.

## Explicitly excluded

The final version intentionally does not implement:

- Multiple Workspaces
- Browser Push Notifications

These are the only two discussed product extensions deliberately left outside the final scope.
