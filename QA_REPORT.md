# Aurora Team Manager — Final QA Report

## Validation completed in the artifact environment

- TypeScript/TSX source files scanned: **95**
- TypeScript/TSX syntax/transpile diagnostics: **0 errors**
- Missing internal `@/`, relative `.ts/.tsx` import targets: **0**
- Seed/mock referential-integrity issues: **0**
- Project/task source-of-truth review: passed
- Project progress no longer depends on a hard-coded `Done` title
- Dynamic completion uses `isCompletedColumn`
- Assignment requirements reviewed against all 8 stages
- Multiple Workspace source: intentionally absent
- Browser Push Notification source: intentionally absent
- English/Persian literal translation audit: all literal `t(...)` UI keys have Persian entries
- RTL/LTR shell review: sidebar, header, drawers, notification panel, mobile navigation and calendar direction logic updated
- Dark-mode background: CSS-only subtle starfield; no browser push or external visual dependency

## Runtime/build environment note

The final source is prepared for normal npm installation and the package versions are pinned. A complete dependency install could not be finished inside this artifact runtime because direct access to the public npm registry timed out. Therefore a full `npm run qa` cannot be truthfully claimed as executed inside this environment.

This is an environment/network limitation, not a recorded application build failure.

## Required final machine verification

On the target Windows machine run:

```powershell
npm install
npm run qa
npm run dev
```

`npm run qa` performs:

```text
TypeScript typecheck → ESLint → production Vite build
```

## Runtime smoke-test sequence

After the app starts, verify the following in one pass:

1. Login with the demo manager account.
2. Create/edit a team member and toggle account activity.
3. Create a project and select an icon/color.
4. Create a task from a Task Template.
5. Edit/delete a task and confirm success toast behavior.
6. Search/filter/sort the task list.
7. Drag an assigned task across Kanban columns.
8. Rename/reorder a column and verify progress remains correct.
9. Open Calendar and Timeline/Gantt views.
10. Add checklist items, subtasks, dependencies and a custom field.
11. Add a comment, nested reply and `@mention`.
12. Upload a small local attachment and avatar image.
13. Verify My Tasks, Dashboard, Activity and Notification Center.
14. Archive and restore a project/task.
15. Export CSV/JSON and open printable PDF report.
16. Refresh/reopen the browser and verify persisted data.
17. Login as a Member and confirm restricted project/action permissions.

## Demo credentials

```text
Email: manager@aurora.local
Password: 123456
```
