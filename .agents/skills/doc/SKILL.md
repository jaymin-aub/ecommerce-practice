---
name: doc
description: >-
  Audits the current codebase state, git commits, and file modifications against all
  project documentation (PROGRESS.md, LOGS.md, MILESTONES.md) and updates them
  accurately and quickly. Use whenever the user executes /doc or asks to synchronize
  documentation with code.
---

# Documentation Sync Skill (`/doc`)

This skill synchronizes all documentation in `docs/workflow/` with the actual state of the codebase. It ensures tracking documents never drift from reality.

---

## Execution Workflow

Whenever `/doc` is invoked, execute these steps sequentially:

### Step 1: Inspect Current Project State
1. Run `git status` to identify modified, untracked, and staged files.
2. Run `git log -n 5 --oneline` to inspect the most recent commits.
3. Check the file tree of key areas (`backend/src/`, `frontend/src/app/`, `shared/src/`).

### Step 2: Update `docs/workflow/PROGRESS.md`
1. Read the active milestone section in `docs/workflow/PROGRESS.md`.
2. For each task:
   - Check if the corresponding files exist and compile cleanly.
   - If the task is finished, update `- [ ]` to `- [x]` and set `Status: Completed`.
   - Update pending/in-progress tasks according to the active working branch.

### Step 3: Update `docs/workflow/LOGS.md`
1. Identify any architectural decision, configuration, or feature committed or completed that lacks a log entry.
2. Append a clean entry to `docs/workflow/LOGS.md` using the standard format:
   - **Context & What Was Achieved**
   - **Decision & Rationale**
   - **Code References:** Exact file paths and line numbers (e.g., `backend/app.ts#L15-L25`)
   - **Git Commit Hash**

### Step 4: Update `docs/workflow/MILESTONES.md`
1. Check the active milestone's **Definition of Done** checklist.
2. Check off items that have been verified on disk.
3. If all items in a milestone are completed, mark the milestone as completed.

### Step 5: Present Brief Summary to Developer
Output a concise summary highlighting:
- Tasks marked completed in `PROGRESS.md`.
- Decisions logged in `LOGS.md`.
- Clickable markdown links to all modified docs.
