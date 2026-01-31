create table public.habits (
  id uuid not null default gen_random_uuid (),
  title text not null,
  created_at timestamp with time zone null default now(),
  constraint habits_pkey primary key (id)
) TABLESPACE pg_default;

create table public.week_days (
  id smallint not null,
  title text not null,
  constraint week_days_pkey primary key (id)
) TABLESPACE pg_default;

INSERT INTO "public"."week_days" ("id", "title") 
VALUES 
    ('0', 'Domingo'), 
    ('1', 'Segunda-feira'), 
    ('2', 'Terça-feira'), 
    ('3', 'Quarta-feira'), 
    ('4', 'Quinta-feira'), 
    ('5', 'Sexta-feira'), 
    ('6', 'Sábado');

create table public.habit_week_days (
  habit_id uuid not null,
  week_day_id smallint not null,
  constraint habit_week_days_pkey primary key (habit_id, week_day_id),
  constraint fk_habit foreign KEY (habit_id) references habits (id) on delete CASCADE,
  constraint fk_week_day foreign KEY (week_day_id) references week_days (id)
) TABLESPACE pg_default;

create table public.habit_day_completions (
  id uuid not null default gen_random_uuid(),
  habit_id uuid not null,
  date date not null,
  created_at timestamp with time zone null default now(),
  constraint habit_day_completions_pkey primary key (id),
  constraint fk_habit_completion foreign key (habit_id) references habits (id) on delete CASCADE,
  constraint habit_day_completions_unique unique (habit_id, date)
) TABLESPACE pg_default;