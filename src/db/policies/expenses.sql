##Policy on expenses
CREATE POLICY "Group members can view expenses"
  ON expenses
  FOR SELECT
                          USING (
                          EXISTS (
                          SELECT 1 FROM group_members gm
                          JOIN members m ON gm.member_id = m.id
                          WHERE gm.group_id = expenses.group_id
                          AND m.user_id = auth.uid()
                          )
                          );

CREATE POLICY "Group members can insert expenses"
  ON expenses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM group_members gm
      JOIN members m ON gm.member_id = m.id
      WHERE gm.group_id = expenses.group_id
        AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Only payer can update expense"
  ON expenses
  FOR UPDATE
                        USING (
                        EXISTS (
                        SELECT 1 FROM members
                        WHERE user_id = auth.uid()
                        AND email = expenses.paid_by
                        )
                        );

CREATE POLICY "Only payer can delete expense"
  ON expenses
  FOR DELETE
USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE user_id = auth.uid()
        AND email = expenses.paid_by
    )
  );
