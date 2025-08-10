### RLS on Groups

CREATE POLICY "Can view own groups"
ON groups
FOR SELECT
                   TO authenticated
                   USING (
                   -- Either the user is a member of the group
                   EXISTS (
                   SELECT 1 FROM group_members gm
                   JOIN members m ON gm.member_id = m.id
                   WHERE gm.group_id = groups.id
                   AND m.user_id = auth.uid()
                   )
                   -- Or the user is the creator of the group
                   OR groups.created_by IN (
                   SELECT id FROM members WHERE user_id = auth.uid()
                   )
                   );

CREATE POLICY "Can create group"
ON groups
FOR INSERT
TO authenticated
WITH CHECK (
  created_by IN (
    SELECT id FROM members
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Can update group if member"
ON groups
FOR UPDATE
                      TO authenticated
                      USING (
                      groups.id IN (
                      SELECT gm.group_id
                      FROM group_members gm
                      JOIN members m ON gm.member_id = m.id
                      WHERE m.user_id = auth.uid()
                      )
                      );

CREATE POLICY "Only creator can delete group"
ON groups
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM members
    WHERE members.id = groups.created_by
    AND members.user_id = auth.uid()
  )
);
