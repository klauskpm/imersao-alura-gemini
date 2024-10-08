import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
 

export const users = pgTable(
    'users',
    {
      id: serial('id').primaryKey(),
      name: text('name').notNull(),
      email: text('email').notNull(),
      image: text('image'),
      createdAt: timestamp('createdAt').defaultNow().notNull(),
    },
    (users) => {
      return {
        uniqueIdx: uniqueIndex('unique_idx').on(users.email),
      };
    },
  );