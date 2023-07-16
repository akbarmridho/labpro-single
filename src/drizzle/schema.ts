import {
  integer,
  pgTable,
  text,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { InferModel, relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    username: text('username').notNull(),
    password: text('password').notNull(),
  },
  (users) => {
    return {
      usernameIndex: uniqueIndex('username_index').on(users.username),
    };
  },
);

export type User = InferModel<typeof users>;

export const insertUserSchema = createInsertSchema(users);

export const selectUserSchema = createSelectSchema(users);

export const companies = pgTable(
  'companies',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    nama: text('nama').notNull(),
    alamat: text('alamat').notNull(),
    no_telp: text('no_telp').notNull(),
    kode: varchar('kode', { length: 255 }).notNull(),
  },
  (companies) => ({
    kodeIndex: uniqueIndex('kode_index').on(companies.kode),
  }),
);

export const companiesRelations = relations(companies, ({ many }) => {
  return {
    items: many(items),
  };
});

export type Company = InferModel<typeof companies>;

export const insertCompanySchema = createInsertSchema(companies, {
  kode: (schema) => schema.kode.length(3).toUpperCase(),
  no_telp: (schema) => schema.no_telp.min(6).max(16),
}).omit({ id: true });

export const selectCompanySchema = createSelectSchema(companies);

export const items = pgTable(
  'items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    nama: text('nama').notNull(),
    harga: integer('harga').notNull(),
    stok: integer('stok').default(0).notNull(),
    perusahaan_id: uuid('perusahaan_id')
      .references(() => companies.id)
      .notNull(),
    kode: varchar('kode', { length: 255 }).notNull(),
  },
  (items) => ({
    kodeIndex: uniqueIndex('kode_index').on(items.kode),
  }),
);

export const itemsRelations = relations(items, ({ one }) => {
  return {
    company: one(companies, {
      fields: [items.perusahaan_id],
      references: [companies.id],
    }),
  };
});

export type Item = InferModel<typeof items>;

export const insertItemSchema = createInsertSchema(items, {
  stok: (schema) => schema.stok.gte(0),
  harga: (schema) => schema.harga.gt(0),
}).omit({ id: true });

export const selectItemSchema = createSelectSchema(items);
