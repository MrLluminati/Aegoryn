# Versioning and Release Policy

This document defines the official versioning, tagging, release, and rollback system for AegorynOS.

AegorynOS must be version controlled through Git tags and changelog entries, not only through file names or informal notes.

---

## 1. Authoritative Versioning System

The authoritative versioning system for AegorynOS is:

1. Git commits;
2. Git tags;
3. changelog entries;
4. release notes, when applicable.

A plain version file may be used later for display inside the app, but it is not the rollback authority.

---

## 2. Version Format

AegorynOS should use semantic-style versions with project-stage labels when useful.

Recommended format:

```text
vMAJOR.MINOR.PATCH-stage
```

Examples:

```text
v0.0.1-planning
v0.0.2-docs
v0.1.0-mvp-start
v0.1.1-auth
v0.1.2-dashboard
v0.2.0-private-alpha
v0.3.0-private-beta
v1.0.0-public-release
```

---

## 3. Meaning of Version Numbers

### MAJOR

Increment for major product milestones or breaking architecture changes.

Example:

```text
v1.0.0-public-release
v2.0.0-enterprise-architecture
```

### MINOR

Increment when a meaningful feature group is added.

Examples:

```text
v0.1.0-mvp-start
v0.2.0-private-alpha
v0.3.0-private-beta
```

### PATCH

Increment for smaller updates, fixes, documentation improvements, and incremental feature work.

Examples:

```text
v0.1.1-auth
v0.1.2-dashboard
v0.1.3-account-ledger
```

---

## 4. Project Stage Labels

Suggested stage labels:

| Label | Meaning |
|---|---|
| planning | Documentation and project setup stage |
| docs | Documentation-focused update |
| mvp-start | Initial app scaffold / MVP work begins |
| alpha | Private experimental version |
| private-alpha | Owner-only or small internal testing |
| private-beta | Limited trusted-user testing |
| beta | Broader testing stage |
| rc | Release candidate |
| public-release | Public stable launch |

---

## 5. When to Create a Tag

Create a Git tag when the repository reaches a stable checkpoint that may need rollback later.

Tag-worthy events include:

- initial planning documentation complete;
- app scaffold created;
- authentication working;
- database schema stable;
- dashboard working;
- chat parser working;
- account-management flow working;
- usage-credit system working;
- private alpha deployed;
- private beta deployed;
- public launch candidate.

Do not tag every small commit. Tags should mark meaningful rollback points.

---

## 6. Changelog Requirement

Every tagged version must have a matching changelog entry.

Example:

```md
## [v0.0.1-planning] - 2026-05-08

### Added
- Initial project documentation.
- Project rulebook and AI agent guidelines.
- Versioning and release policy.
```

If a version is tagged but not documented in `CHANGELOG.md`, the release is incomplete.

---

## 7. Git Tag Commands

### Create an annotated tag

```powershell
git tag -a v0.0.1-planning -m "AegorynOS planning baseline"
```

### Push the tag to GitHub

```powershell
git push origin v0.0.1-planning
```

### Push all tags

```powershell
git push origin --tags
```

---

## 8. Rollback Commands

### View available tags

```powershell
git tag
```

### Inspect a tagged version

```powershell
git checkout v0.0.1-planning
```

This puts the repo into detached HEAD mode for inspection.

### Create a rollback branch from a tag

```powershell
git checkout -b rollback/v0.0.1-planning v0.0.1-planning
```

### Restore main branch to a previous tag

This should only be done with owner approval:

```powershell
git checkout main
git reset --hard v0.0.1-planning
git push origin main --force-with-lease
```

Force-push rollback should be used carefully because it rewrites branch history.

---

## 9. Release Notes

For important tagged versions, create release notes summarizing:

1. version tag;
2. date;
3. summary;
4. added features;
5. changed behaviour;
6. fixed issues;
7. known limitations;
8. rollback notes.

Release notes may be stored in:

```text
docs/releases/
```

Example:

```text
docs/releases/v0.0.1-planning.md
```

---

## 10. Suggested Early Tags

Recommended early version checkpoints:

| Version | Meaning |
|---|---|
| v0.0.1-planning | Documentation and governance baseline |
| v0.0.2-repo-foundation | Setup docs, security docs, backlog, env template |
| v0.1.0-mvp-start | Next.js/Tailwind/Supabase scaffold begins |
| v0.1.1-auth | Authentication implemented |
| v0.1.2-dashboard | Dashboard shell implemented |
| v0.1.3-account-ledger | Account and transaction module implemented |
| v0.1.4-ai-parser | AI parser endpoint implemented |
| v0.1.5-usage-credits | AI usage-credit gate implemented |
| v0.2.0-private-alpha | Owner-only private usable alpha |

---

## 11. AI Agent Rule

Any AI agent working on this repository must:

1. check the current changelog before suggesting a version;
2. suggest a new tag only for meaningful checkpoints;
3. update `CHANGELOG.md` before a tag is created;
4. create release notes for important versions;
5. never create rollback or force-push commands without warning the owner;
6. provide manual PowerShell commands if it cannot create tags directly.

---

## 12. Current Version Target

The current intended baseline tag is:

```text
v0.0.1-planning
```

This should represent the project planning and documentation baseline before actual app code begins.
