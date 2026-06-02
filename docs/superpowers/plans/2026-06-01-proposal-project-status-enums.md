# Proposal and Project Status Enums API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restrict proposal and project persistence and API payloads to separate canonical status enums.

**Architecture:** Define domain enums and matching Prisma enums, validate request payloads at the controller boundary, then migrate legacy database values before casting columns to PostgreSQL enum types. Repositories, seeds, and tests use the canonical enum values end to end.

**Tech Stack:** TypeScript, Express, Prisma, PostgreSQL, Vitest

---

### Task 1: Add Domain Status Enums and Project Controller Validation

**Files:**
- Create: `src/domain/models/Status.ts`
- Modify: `src/domain/models/Project.ts`
- Modify: `src/domain/repositories/ProjectRepository.ts`
- Modify: `src/presentation/controllers/ProjectController.ts`
- Test: `src/presentation/controllers/ProjectController.spec.ts`

- [ ] **Step 1: Write failing project controller tests**

Add tests proving canonical values are accepted and invalid values are rejected:

```ts
it("should reject an invalid project status", async () => {
  const createProject = { execute: vi.fn() };
  const controller = new ProjectController(createProject, { execute: vi.fn() });
  const req = { body: {
    title: "Campus Mobility Platform",
    description: "Build a prototype",
    status: "ACTIVE",
    courseId: "course-id",
    proposalId: "proposal-id",
  } } as Request;
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as unknown as Response;

  await controller.create(req, res);

  expect(createProject.execute).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(400);
});
```

Change the existing successful create test to send and expect `ProjectStatus.IN_DEVELOPMENT`.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `pnpm vitest run src/presentation/controllers/ProjectController.spec.ts`

Expected: FAIL because `ACTIVE` is still forwarded and `ProjectStatus` does not exist.

- [ ] **Step 3: Add domain enums and validation helpers**

Create `src/domain/models/Status.ts`:

```ts
export enum ProposalStatus {
  PRE_APPROVED = "PRE_APPROVED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  IN_REVIEW = "IN_REVIEW",
}

export enum ProjectStatus {
  IN_DEVELOPMENT = "IN_DEVELOPMENT",
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
}

export const isProposalStatus = (value: unknown): value is ProposalStatus =>
  typeof value === "string" && Object.values(ProposalStatus).includes(value as ProposalStatus);

export const isProjectStatus = (value: unknown): value is ProjectStatus =>
  typeof value === "string" && Object.values(ProjectStatus).includes(value as ProjectStatus);
```

Use `ProjectStatus` instead of `string` in the project model, repository parameter types, controller request types, and controller contracts. In `ProjectController.create` and `ProjectController.update`, reject a provided invalid status:

```ts
if (!isProjectStatus(status)) {
  throw new InvalidPayloadError("Invalid project status");
}
```

For updates, run the check only when `status !== undefined`.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `pnpm vitest run src/presentation/controllers/ProjectController.spec.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/domain/models/Status.ts src/domain/models/Project.ts src/domain/repositories/ProjectRepository.ts src/presentation/controllers/ProjectController.ts src/presentation/controllers/ProjectController.spec.ts
git commit -m "feat: validate project status enum"
```

### Task 2: Add Proposal Controller Validation

**Files:**
- Modify: `src/domain/models/Proposal.ts`
- Modify: `src/domain/repositories/ProposalRepository.ts`
- Modify: `src/presentation/controllers/ProposalController.ts`
- Modify: `src/main/factories/makeProposalController.ts`
- Test: `src/presentation/controllers/ProposalController.spec.ts`

- [ ] **Step 1: Write failing proposal controller tests**

Add one create test and one update test with invalid status:

```ts
it("rejects an invalid proposal status on update", async () => {
  const updateProposal = { execute: vi.fn() };
  const controller = new ProposalController(
    { execute: vi.fn() },
    { execute: vi.fn() },
    { execute: vi.fn() },
    updateProposal,
  );
  const req = { params: { id: "proposal-id" }, body: { status: "atribuida" } } as unknown as Request;
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as unknown as Response;

  await controller.update(req, res);

  expect(updateProposal.execute).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(400);
});
```

Update successful fixtures to use `ProposalStatus.IN_REVIEW`, `ProposalStatus.PRE_APPROVED`, `ProposalStatus.APPROVED`, or `ProposalStatus.REJECTED`.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `pnpm vitest run src/presentation/controllers/ProposalController.spec.ts`

Expected: FAIL because arbitrary strings are still accepted.

- [ ] **Step 3: Type and validate proposal statuses**

Use `ProposalStatus` from `src/domain/models/Status.ts` in the proposal model, repository parameter types, request types, and response types. In create validation and update handling, enforce:

```ts
if (!isProposalStatus(status)) {
  throw new InvalidProposalPayloadError("Invalid proposal status");
}
```

For updates, run the check only when `status !== undefined`.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `pnpm vitest run src/presentation/controllers/ProposalController.spec.ts src/presentation/controllers/ProjectController.spec.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/domain/models/Proposal.ts src/domain/repositories/ProposalRepository.ts src/presentation/controllers/ProposalController.ts src/main/factories/makeProposalController.ts src/presentation/controllers/ProposalController.spec.ts
git commit -m "feat: validate proposal status enum"
```

### Task 3: Update Prisma Schema and Add Legacy Data Migration

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/20260601000000_add_status_enums/migration.sql`
- Modify: `src/infra/repositories/PrismaProjectRepository.ts`
- Modify: `src/infra/repositories/PrismaProposalRepository.ts`

- [ ] **Step 1: Add Prisma enums to the schema**

Add:

```prisma
enum ProposalStatus {
  PRE_APPROVED
  APPROVED
  REJECTED
  IN_REVIEW

  @@map("proposal_status")
}

enum ProjectStatus {
  IN_DEVELOPMENT
  PENDING
  COMPLETED

  @@map("project_status")
}
```

Change `Proposal.status` to `ProposalStatus` and `Project.status` to `ProjectStatus`.

- [ ] **Step 2: Add SQL that normalizes legacy rows before casting**

Create the migration with:

```sql
CREATE TYPE "proposal_status" AS ENUM ('PRE_APPROVED', 'APPROVED', 'REJECTED', 'IN_REVIEW');
CREATE TYPE "project_status" AS ENUM ('IN_DEVELOPMENT', 'PENDING', 'COMPLETED');

UPDATE "proposals"
SET "status" = CASE UPPER("status")
  WHEN 'PRE_APPROVED' THEN 'PRE_APPROVED'
  WHEN 'PRE_APROVADO' THEN 'PRE_APPROVED'
  WHEN 'APPROVED' THEN 'APPROVED'
  WHEN 'APROVADA' THEN 'APPROVED'
  WHEN 'APROVADO' THEN 'APPROVED'
  WHEN 'REJECTED' THEN 'REJECTED'
  WHEN 'REJEITADA' THEN 'REJECTED'
  WHEN 'REJEITADO' THEN 'REJECTED'
  WHEN 'ASSIGNED' THEN 'APPROVED'
  WHEN 'ATRIBUIDA' THEN 'APPROVED'
  ELSE 'IN_REVIEW'
END;

UPDATE "projects"
SET "status" = CASE UPPER("status")
  WHEN 'ACTIVE' THEN 'IN_DEVELOPMENT'
  WHEN 'IN_DEVELOPMENT' THEN 'IN_DEVELOPMENT'
  WHEN 'EM_DESENVOLVIMENTO' THEN 'IN_DEVELOPMENT'
  WHEN 'COMPLETED' THEN 'COMPLETED'
  WHEN 'CLOSED' THEN 'COMPLETED'
  WHEN 'CONCLUIDO' THEN 'COMPLETED'
  ELSE 'PENDING'
END;

ALTER TABLE "proposals"
  ALTER COLUMN "status" TYPE "proposal_status" USING ("status"::"proposal_status");
ALTER TABLE "projects"
  ALTER COLUMN "status" TYPE "project_status" USING ("status"::"project_status");
```

- [ ] **Step 3: Regenerate Prisma and fix repository boundary types**

Run: `pnpm prisma generate`

Import Prisma-generated enum types under aliases in both Prisma repositories and use them in `ProjectRecord`, `ProposalRecord`, and `PrismaClientLike` data fields:

```ts
import {
  ProjectStatus as PrismaProjectStatus,
  ProposalStatus as PrismaProposalStatus,
} from "@prisma/client";
```

Cast only at the Prisma boundary where domain enums are assigned to generated Prisma enum fields.

- [ ] **Step 4: Build and verify generated type compatibility**

Run: `pnpm run build`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/20260601000000_add_status_enums/migration.sql src/infra/repositories/PrismaProjectRepository.ts src/infra/repositories/PrismaProposalRepository.ts
git commit -m "feat: persist proposal and project status enums"
```

### Task 4: Update Seeds, Fixtures, and API Verification

**Files:**
- Modify: `prisma/seed.mjs`
- Modify: `prisma/seed.js`
- Modify: `src/presentation/controllers/ProjectController.spec.ts`
- Modify: `src/infra/repositories/PrismaProjectRepository.spec.ts`
- Modify: `src/infra/repositories/PrismaProposalRepository.spec.ts`
- Modify: `src/main/router/routes.integration.spec.ts`
- Modify: `src/test/integration/fixtures.ts`

- [ ] **Step 1: Replace legacy fixtures with canonical enum values**

Use these substitutions:

```text
Proposal: SUBMITTED -> IN_REVIEW
Proposal: IN_REVIEW -> IN_REVIEW
Proposal: APPROVED -> APPROVED
Proposal: REJECTED -> REJECTED
Project: ACTIVE -> IN_DEVELOPMENT
Project: PLANNING -> PENDING
Project: open -> PENDING
Project: closed -> COMPLETED
```

In TypeScript tests, import `ProposalStatus` or `ProjectStatus` and use enum members when the production contract is exercised.

- [ ] **Step 2: Run unit tests**

Run: `pnpm test`

Expected: PASS.

- [ ] **Step 3: Run lint**

Run: `pnpm run lint`

Expected: PASS.

- [ ] **Step 4: Run migration and integration tests against Docker PostgreSQL**

Run: `pnpm run test:docker`

Expected: migrations deploy successfully and integration tests PASS.

- [ ] **Step 5: Commit**

```bash
git add prisma/seed.mjs prisma/seed.js src/presentation/controllers/ProjectController.spec.ts src/infra/repositories/PrismaProjectRepository.spec.ts src/infra/repositories/PrismaProposalRepository.spec.ts src/main/router/routes.integration.spec.ts src/test/integration/fixtures.ts
git commit -m "test: align fixtures with status enums"
```

