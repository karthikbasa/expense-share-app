CREATE TABLE members (
                         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                         user_id UUID REFERENCES auth.users(id),
                         name TEXT NOT NULL,
                         email TEXT UNIQUE NOT NULL,
                         created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE members ADD CONSTRAINT unique_email UNIQUE (email);

CREATE TABLE invites (
                         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                         email TEXT UNIQUE NOT NULL,
                         invited_by UUID REFERENCES auth.users(id),
                         group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
                         status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'expired'
                         created_at TIMESTAMP DEFAULT now()
);


CREATE TABLE groups (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        name TEXT NOT NULL,
                        status TEXT DEFAULT 'active',
                        settled_at TIMESTAMP,
                        created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE groups ADD COLUMN created_by UUID REFERENCES members(id);


CREATE TABLE group_members (
                               id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                               group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
                               name TEXT NOT NULL,
                               email TEXT NOT NULL,
                               created_at TIMESTAMP DEFAULT now()
);
CREATE UNIQUE INDEX unique_member_per_group ON group_members(group_id, email);
ALTER TABLE group_members ADD COLUMN member_id UUID REFERENCES members(id);
ALTER TABLE group_members ADD COLUMN added_by UUID REFERENCES members(id);
ALTER TABLE group_members ADD COLUMN role TEXT DEFAULT 'member';

CREATE TABLE expenses (
                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                          group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
                          title TEXT NOT NULL,
                          amount NUMERIC NOT NULL,
                          paid_by TEXT NOT NULL,
                          created_at TIMESTAMP DEFAULT now()
);

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

