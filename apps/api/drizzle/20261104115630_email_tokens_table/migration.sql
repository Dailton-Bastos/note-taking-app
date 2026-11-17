CREATE TABLE "email_tokens" (
	"id" text PRIMARY KEY,
	"user_id" integer NOT NULL,
	"email" text NOT NULL,
	"purpose" text NOT NULL,
	"fingerprint" text,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "email_tokens_user_id_purpose_idx" ON "email_tokens" ("user_id","purpose");--> statement-breakpoint
CREATE INDEX "email_tokens_expires_at_idx" ON "email_tokens" ("expires_at");--> statement-breakpoint
ALTER TABLE "email_tokens" ADD CONSTRAINT "email_tokens_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;