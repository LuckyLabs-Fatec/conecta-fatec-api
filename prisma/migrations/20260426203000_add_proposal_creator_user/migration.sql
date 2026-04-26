ALTER TABLE "proposals"
ADD COLUMN "created_by_user_id" UUID;

UPDATE "proposals"
SET "created_by_user_id" = (
  SELECT "id"
  FROM "users"
  ORDER BY "createdAt" ASC
  LIMIT 1
)
WHERE "created_by_user_id" IS NULL;

ALTER TABLE "proposals"
ALTER COLUMN "created_by_user_id" SET NOT NULL;

ALTER TABLE "proposals"
ADD CONSTRAINT "proposals_created_by_user_id_fkey"
FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "proposals_created_by_user_id_idx" ON "proposals"("created_by_user_id");
