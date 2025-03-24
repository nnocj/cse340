-- Type: account_type

-- DROP TYPE IF EXISTS public.account_type;

CREATE TYPE public.account_type AS ENUM
    ('Cleint', 'Employee', 'Admin');

ALTER TYPE public.account_type
    OWNER TO cse340noc;
