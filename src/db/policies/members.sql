#RLS on members
CREATE POLICY "Members can view themselves"
  ON members
  FOR SELECT
                      USING (user_id = auth.uid());

CREATE POLICY "Members can update themselves"
  ON members
  FOR UPDATE
                 USING (user_id = auth.uid());

CREATE POLICY "Members can delete themselves"
  ON members
  FOR DELETE
USING (user_id = auth.uid());

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