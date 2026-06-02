# Proposal and Project Status Enums

## Objective

Restrict proposal and project statuses to separate domain enums. Proposals represent the review flow. Projects represent approved work that can be assigned to a student group and tracked through delivery.

## Domain Rules

Proposal statuses:

- `PRE_APPROVED`
- `APPROVED`
- `REJECTED`
- `IN_REVIEW`

Project statuses:

- `IN_DEVELOPMENT`
- `PENDING`
- `COMPLETED`

A proposal is never assigned directly. An approved proposal may originate a project. Group assignment belongs exclusively to the project.

## API Design

Add `ProposalStatus` and `ProjectStatus` Prisma enums and use them in the corresponding models. Mirror those enums in the TypeScript domain layer so controller contracts, repository contracts, models, and Prisma repository mappings do not accept arbitrary strings.

Controllers validate incoming create and update payloads before invoking repository operations. Invalid status values return HTTP `400`.

The migration converts existing stored values to the new canonical enum values before changing the column types. Legacy proposal values map to the nearest review state, and legacy project values map to the nearest delivery state. Seeds use only canonical enum values.

## Compatibility Mapping

Proposal values:

- `SUBMITTED`, `PENDING`, `pendente`, and `aguardando_info` become `IN_REVIEW`.
- `IN_REVIEW`, `ANALYSIS`, `UNDER_REVIEW`, and `em_analise` become `IN_REVIEW`.
- `PRE_APPROVED` and `pre_aprovado` become `PRE_APPROVED`.
- `APPROVED`, `aprovada`, and `aprovado` become `APPROVED`.
- `REJECTED`, `rejeitada`, and `rejeitado` become `REJECTED`.
- `ASSIGNED` and `atribuida` become `APPROVED`, because assignment is no longer a proposal state.

Project values:

- `ACTIVE`, `IN_DEVELOPMENT`, and `em_desenvolvimento` become `IN_DEVELOPMENT`.
- `COMPLETED`, `CLOSED`, `concluido`, and `closed` become `COMPLETED`.
- All other legacy project values become `PENDING`.

## Testing

Add controller tests proving that invalid proposal and project statuses are rejected with HTTP `400`. Update repository and integration fixtures to use canonical enum values. Run the API test suite after migration and Prisma client generation.

## Scope

This change does not add the endpoint that converts an approved proposal into a project. It establishes the status model required for that flow and keeps existing project group assignment behavior.
