#RLS on group_members
CREATE POLICY "Can view members in shared groups"
  ON group_members
  FOR SELECT
                      USING (
                      EXISTS (
                      SELECT 1 FROM members
                      WHERE user_id = auth.uid()
                      AND group_id = group_members.group_id
                      )
                      );

CREATE POLICY "Can invite members to own group"
  ON group_members
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM members
      WHERE user_id = auth.uid()
        AND group_id = group_members.group_id
    )
  );

CREATE POLICY "Can update members in own group"
  ON group_members
  FOR UPDATE
                        USING (
                        EXISTS (
                        SELECT 1 FROM members
                        WHERE user_id = auth.uid()
                        AND group_id = group_members.group_id
                        )
                        );

CREATE POLICY "Can remove members from own group"
  ON group_members
  FOR DELETE
USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE user_id = auth.uid()
        AND group_id = group_members.group_id
    )
  );