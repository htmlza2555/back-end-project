-- CreateTable
CREATE TABLE "Blacklist" (
    "token" VARCHAR(512) NOT NULL,
    "exp" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "Blacklist_token_key" ON "Blacklist"("token");

-- CreateIndex
CREATE INDEX "Blacklist_exp_idx" ON "Blacklist"("exp" ASC);
