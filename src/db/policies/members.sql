#RLS on members
CREATE POLICY "Members can view themselves"
  ON members
  FOR SELECT
                      USING (user_id = auth.uid());

CREATE POLICY "Members can delete themselves"
  ON members
  FOR DELETE
USING (user_id = auth.uid());

CREATE POLICY "User can update their member record or claim invite"
  ON members
  FOR UPDATE
                 USING (
                 -- Already claimed
                 user_id = auth.uid()

                 -- Or claiming invite
                 OR (
                 email = auth.email()
                 AND user_id IS NULL
                 )
                 );


CREATE POLICY "Inviter can insert members they invited"
ON members
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM invites
    WHERE invited_by = auth.uid()
      AND invites.email = members.email
  )
);

CREATE POLICY "Inviter can delete member only if invite is pending"
ON members
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM invites
    WHERE invites.email = members.email
      AND invites.invited_by = auth.uid()
      AND invites.status = 'pending'
  )
  AND members.user_id IS NULL
);
