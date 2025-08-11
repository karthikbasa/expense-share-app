GRANT SELECT ON auth.users TO postgres;

CREATE OR REPLACE FUNCTION claim_member_by_email(invite_email TEXT)
RETURNS VOID AS $$
DECLARE
invited_user UUID;
BEGIN
  -- Look up user ID from auth.users
SELECT id INTO invited_user
FROM auth.users
WHERE email = invite_email;

-- Update members table
UPDATE members
SET user_id = invited_user
WHERE email = invite_email
  AND user_id IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION on_invite_accepted()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' THEN
    PERFORM claim_member_by_email(NEW.email);
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_invite_accepted
    AFTER UPDATE ON invites
    FOR EACH ROW
    EXECUTE FUNCTION on_invite_accepted();