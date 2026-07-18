import { relations } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

// Auth.js adapter tables
export const users = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified'),
  image: text('image'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: { unique: true, columns: [account.provider, account.providerAccountId] },
    userIdIdx: index('account_userId_idx').on(account.userId),
  })
)

export const sessions = pgTable(
  'session',
  {
    sessionToken: text('sessionToken').primaryKey(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expires: timestamp('expires').notNull(),
  },
  (session) => ({
    userIdIdx: index('session_userId_idx').on(session.userId),
  })
)

export const verificationTokens = pgTable(
  'verification_token',
  {
    email: text('email').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires').notNull(),
  },
  (vt) => ({
    compoundKey: { unique: true, columns: [vt.email, vt.token] },
  })
)

// App tables
export const projects = pgTable(
  'projects',
  {
    id: serial('id').primaryKey(),
    userId: text('userId').notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    topic: varchar('topic', { length: 255 }),
    channels: text('channels').default('[]'),
    status: varchar('status', { length: 50 }).default('draft'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('projects_userId_idx').on(table.userId),
    statusIdx: index('projects_status_idx').on(table.status),
  })
)

export const pipelineSteps = pgTable(
  'pipeline_steps',
  {
    id: serial('id').primaryKey(),
    projectId: integer('projectId')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    userId: text('userId').notNull(),
    stepName: varchar('stepName', { length: 255 }).notNull(),
    status: varchar('status', { length: 50 }).default('pending'),
    agent: varchar('agent', { length: 255 }),
    content: text('content'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  },
  (table) => ({
    projectIdIdx: index('pipelineSteps_projectId_idx').on(table.projectId),
    userIdIdx: index('pipelineSteps_userId_idx').on(table.userId),
  })
)

export const approvals = pgTable(
  'approvals',
  {
    id: serial('id').primaryKey(),
    projectId: integer('projectId')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    pipelineStepId: integer('pipelineStepId')
      .notNull()
      .references(() => pipelineSteps.id, { onDelete: 'cascade' }),
    userId: text('userId').notNull(),
    status: varchar('status', { length: 50 }).default('pending'),
    feedback: text('feedback'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  },
  (table) => ({
    projectIdIdx: index('approvals_projectId_idx').on(table.projectId),
    userIdIdx: index('approvals_userId_idx').on(table.userId),
    statusIdx: index('approvals_status_idx').on(table.status),
  })
)

export const analytics = pgTable(
  'analytics',
  {
    id: serial('id').primaryKey(),
    projectId: integer('projectId')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    userId: text('userId').notNull(),
    channel: varchar('channel', { length: 50 }),
    views: integer('views').default(0),
    engagement: integer('engagement').default(0),
    shares: integer('shares').default(0),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
  },
  (table) => ({
    projectIdIdx: index('analytics_projectId_idx').on(table.projectId),
    userIdIdx: index('analytics_userId_idx').on(table.userId),
  })
)

export const userSettings = pgTable('user_settings', {
  userId: text('userId').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  theme: varchar('theme', { length: 20 }).default('dark'),
  emailNotifications: boolean('emailNotifications').default(true),
  twoFactorEnabled: boolean('twoFactorEnabled').default(false),
  preferredChannels: text('preferredChannels').default('[]'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const apiKeys = pgTable(
  'api_keys',
  {
    id: serial('id').primaryKey(),
    userId: text('userId').notNull(),
    key: varchar('key', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 255 }),
    lastUsedAt: timestamp('lastUsedAt'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('apiKeys_userId_idx').on(table.userId),
  })
)

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: serial('id').primaryKey(),
    userId: text('userId').notNull(),
    action: varchar('action', { length: 255 }).notNull(),
    category: varchar('category', { length: 50 }).default('system'),
    resource: varchar('resource', { length: 255 }),
    resourceId: integer('resourceId'),
    description: text('description'),
    metadata: text('metadata'),
    ipAddress: varchar('ipAddress', { length: 45 }),
    userAgent: text('userAgent'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('auditLogs_userId_idx').on(table.userId),
    actionIdx: index('auditLogs_action_idx').on(table.action),
    categoryIdx: index('auditLogs_category_idx').on(table.category),
  })
)

export const notifications = pgTable(
  'notifications',
  {
    id: serial('id').primaryKey(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 50 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    message: text('message').notNull(),
    actionUrl: varchar('actionUrl', { length: 500 }),
    icon: varchar('icon', { length: 100 }),
    read: boolean('read').default(false),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('notifications_userId_idx').on(table.userId),
    readIdx: index('notifications_read_idx').on(table.read),
  })
)

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  projects: many(projects),
  pipelineSteps: many(pipelineSteps),
  approvals: many(approvals),
  analytics: many(analytics),
  settings: one(userSettings),
  apiKeys: many(apiKeys),
  auditLogs: many(auditLogs),
  notifications: many(notifications),
}))

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, { fields: [projects.userId], references: [users.id] }),
  pipelineSteps: many(pipelineSteps),
  approvals: many(approvals),
  analytics: many(analytics),
}))

export const pipelineStepsRelations = relations(pipelineSteps, ({ one, many }) => ({
  project: one(projects, { fields: [pipelineSteps.projectId], references: [projects.id] }),
  approvals: many(approvals),
}))

export const approvalsRelations = relations(approvals, ({ one }) => ({
  project: one(projects, { fields: [approvals.projectId], references: [projects.id] }),
  pipelineStep: one(pipelineSteps, {
    fields: [approvals.pipelineStepId],
    references: [pipelineSteps.id],
  }),
}))

export const analyticsRelations = relations(analytics, ({ one }) => ({
  project: one(projects, { fields: [analytics.projectId], references: [projects.id] }),
}))

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}))
