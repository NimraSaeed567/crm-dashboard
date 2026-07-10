-- CRM Dashboard schema + seed data for Supabase
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query)

create table if not exists customers (
  id bigint generated always as identity primary key,
  name text not null,
  company text not null,
  email text not null,
  source text not null,
  status text not null,
  deal_value numeric not null default 0,
  last_contact date not null,
  created_at timestamptz not null default now()
);

create table if not exists activities (
  id bigint generated always as identity primary key,
  customer_name text not null,
  type text not null,
  note text not null,
  date date not null
);

create table if not exists tasks (
  id bigint generated always as identity primary key,
  title text not null,
  due_date date not null,
  done boolean not null default false
);

-- revenue_by_month is no longer read by the app: Revenue Over Time / Revenue This
-- Month are now computed live from Won customers' deal_value + last_contact instead
-- of static seed rows. The table can be left as-is or dropped; nothing queries it.
create table if not exists revenue_by_month (
  id bigint generated always as identity primary key,
  month text not null,
  revenue numeric not null
);

-- Demo app, no login screen, so allow the public anon key to read and write.
alter table customers enable row level security;
alter table activities enable row level security;
alter table tasks enable row level security;
alter table revenue_by_month enable row level security;

create policy "public read customers" on customers for select using (true);
create policy "public write customers" on customers for insert with check (true);
create policy "public update customers" on customers for update using (true);
create policy "public delete customers" on customers for delete using (true);

create policy "public read activities" on activities for select using (true);
create policy "public write activities" on activities for insert with check (true);
create policy "public update activities" on activities for update using (true);
create policy "public delete activities" on activities for delete using (true);

create policy "public read tasks" on tasks for select using (true);
create policy "public write tasks" on tasks for insert with check (true);
create policy "public update tasks" on tasks for update using (true);
create policy "public delete tasks" on tasks for delete using (true);

create policy "public read revenue_by_month" on revenue_by_month for select using (true);

insert into customers (name, company, email, source, status, deal_value, last_contact) values
  ('Henry Clarke', 'Zenith Traders', 'henry.clarke@zenithtraders.com', 'Referral', 'Won', 3200, '2026-06-28'),
  ('Sophie Turner', 'BrightWave Solutions', 'sophie.turner@brightwave.io', 'Website', 'Proposal', 5400, '2026-07-01'),
  ('George Palmer', 'Nova Retailers', 'george.palmer@novaretail.co.uk', 'Cold Outreach', 'Contacted', 1500, '2026-06-25'),
  ('Grace Mitchell', 'Pulse Fitness', 'grace.mitchell@pulsefit.com', 'Referral', 'Qualified', 2800, '2026-07-02'),
  ('William Stone', 'Skyline Logistics', 'william.stone@skylinelog.com', 'Website', 'Lost', 0, '2026-06-20'),
  ('Isabella Shaw', 'GreenLeaf Organics', 'isabella.shaw@greenleaf.co.uk', 'Cold Outreach', 'New', 900, '2026-07-04'),
  ('Oliver Bennett', 'Bennett & Co Consulting', 'oliver.bennett@bennettco.co.uk', 'Referral', 'Won', 4100, '2026-06-30'),
  ('Charlotte Hughes', 'Hughes Interiors', 'charlotte.hughes@hughesinteriors.co.uk', 'Website', 'Proposal', 3600, '2026-07-03'),
  ('James Whitfield', 'Whitfield & Sons', 'james.whitfield@whitfieldsons.co.uk', 'Cold Outreach', 'New', 1200, '2026-07-05'),
  ('Emily Carter', 'Carter Design Studio', 'emily.carter@carterdesign.co.uk', 'Referral', 'Qualified', 2950, '2026-07-01'),
  ('Thomas Reed', 'Reed Logistics Group', 'thomas.reed@reedlogistics.co.uk', 'Social Media', 'Contacted', 1800, '2026-06-27'),
  ('Amelia Foster', 'Foster & Wright Solicitors', 'amelia.foster@fosterwright.co.uk', 'Website', 'Lost', 0, '2026-06-18');

insert into activities (customer_name, type, note, date) values
  ('Sophie Turner', 'Email', 'Sent proposal draft', '2026-07-01'),
  ('Grace Mitchell', 'Call', 'Discussed pricing options', '2026-07-02'),
  ('Isabella Shaw', 'Meeting', 'Intro call scheduled', '2026-07-04'),
  ('George Palmer', 'Email', 'Follow-up on quote', '2026-06-25'),
  ('Charlotte Hughes', 'Email', 'Sent revised proposal', '2026-07-03'),
  ('Emily Carter', 'Call', 'Walked through package options', '2026-07-01'),
  ('James Whitfield', 'Meeting', 'Discovery call scheduled', '2026-07-05'),
  ('Oliver Bennett', 'Email', 'Sent signed contract confirmation', '2026-06-30');

insert into tasks (title, due_date, done) values
  ('Call Sophie Turner re: proposal', '2026-07-06', false),
  ('Send contract to Henry Clarke', '2026-07-07', false),
  ('Follow up with George Palmer', '2026-07-08', false),
  ('Follow up with Charlotte Hughes on proposal', '2026-07-09', false),
  ('Prepare onboarding pack for Oliver Bennett', '2026-07-10', false);

insert into revenue_by_month (month, revenue) values
  ('Feb', 9200),
  ('Mar', 11800),
  ('Apr', 10500),
  ('May', 14300),
  ('Jun', 16700),
  ('Jul', 18450);

-- Soft delete + audit log: "delete" in the app no longer removes a row,
-- it stamps deleted_at and the record disappears from every list (all
-- reads filter deleted_at is null). Every delete also writes a row to
-- audit_log with a full snapshot of the record at the time it was removed.
alter table customers add column if not exists deleted_at timestamptz;
alter table tasks add column if not exists deleted_at timestamptz;
alter table activities add column if not exists deleted_at timestamptz;

create table if not exists audit_log (
  id bigint generated always as identity primary key,
  table_name text not null,
  record_id bigint not null,
  action text not null,
  record_snapshot jsonb,
  created_at timestamptz not null default now()
);

alter table audit_log enable row level security;
create policy "public read audit_log" on audit_log for select using (true);
create policy "public write audit_log" on audit_log for insert with check (true);

-- Invoices: a real billing flow. A "Paid" invoice IS the receipt of payment —
-- there's no separate receipts table. Dashboard revenue is computed from these
-- (sum of Paid amounts grouped by issue_date month) instead of guessing from
-- customer status.
create table if not exists invoices (
  id bigint generated always as identity primary key,
  invoice_number text not null,
  customer_name text not null,
  amount numeric not null default 0,
  status text not null default 'Draft',
  issue_date date not null,
  due_date date not null,
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);

alter table invoices enable row level security;
create policy "public read invoices" on invoices for select using (true);
create policy "public write invoices" on invoices for insert with check (true);
create policy "public update invoices" on invoices for update using (true);
create policy "public delete invoices" on invoices for delete using (true);

insert into invoices (invoice_number, customer_name, amount, status, issue_date, due_date) values
  ('INV-1001', 'Henry Clarke', 3200, 'Paid', '2026-06-28', '2026-07-12'),
  ('INV-1002', 'Oliver Bennett', 4100, 'Paid', '2026-06-30', '2026-07-14'),
  ('INV-1003', 'Sophie Turner', 5400, 'Sent', '2026-07-01', '2026-07-15'),
  ('INV-1004', 'Charlotte Hughes', 3600, 'Draft', '2026-07-03', '2026-07-17'),
  ('INV-1005', 'Grace Mitchell', 2800, 'Draft', '2026-07-02', '2026-07-16'),
  ('INV-1006', 'Thomas Reed', 1800, 'Overdue', '2026-06-10', '2026-06-24');
