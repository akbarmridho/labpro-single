CREATE TABLE IF NOT EXISTS "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" text NOT NULL,
	"alamat" text NOT NULL,
	"no_telp" text NOT NULL,
	"kode" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" text,
	"harga" integer,
	"stok" integer DEFAULT 0,
	"perusahaan_id" uuid,
	"kode" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "kode_index" ON "companies" ("kode");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "kode_index" ON "items" ("kode");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "username_index" ON "users" ("username");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items" ADD CONSTRAINT "items_perusahaan_id_companies_id_fk" FOREIGN KEY ("perusahaan_id") REFERENCES "companies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
