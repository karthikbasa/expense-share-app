import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { getGroups, saveGroups } from '../utils/storage';

function AddUserToGroupForm({ group, allUsers, onUpdate }) {
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const safeGroupUsers = Array.isArray(group?.users) ? group.users : [];
    const safeAllUsers = Array.isArray(allUsers) ? allUsers : [];

    const availableUsers = safeAllUsers.filter(
        (user) => !safeGroupUsers.some((gu) => gu.email === user.email)
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const newUsers = safeAllUsers.filter(
                (u) =>
                    selectedEmails.includes(u.email) &&
                    !safeGroupUsers.some((gu) => gu.email === u.email)
            );

            const updatedUsers = [...safeGroupUsers, ...newUsers];

            // 🔄 Update local storage
            const groups = await getGroups();
            const updatedGroups = Array.isArray(groups)
                ? groups.map((g) =>
                    g.name === group.name ? { ...g, users: updatedUsers } : g
                )
                : [];

            await saveGroups(updatedGroups);

            // 🔄 Update Supabase group_members
            const { data: memberRecords, error: memberFetchError } = await supabase
                .from('members')
                .select('id, email')
                .in('email', selectedEmails);

            if (memberFetchError) {
                console.error('❌ Error fetching members:', memberFetchError);
                setError('Failed to fetch user records.');
                return;
            }

            const memberMap = Object.fromEntries(
                memberRecords.map((m) => [m.email.toLowerCase(), m.id])
            );

            const groupId = group.id;

            const groupMemberPayload = selectedEmails
                .map((email) => {
                    const memberId = memberMap[email.toLowerCase()];
                    return memberId ? { group_id: groupId, member_id: memberId } : null;
                })
                .filter(Boolean);

            if (groupMemberPayload.length > 0) {
                const { error: insertError } = await supabase
                    .from('group_members')
                    .insert(groupMemberPayload);

                if (insertError) {
                    console.error('❌ Error inserting group members:', insertError);
                    setError('Failed to add users to group.');
                    return;
                }
            }

            if (onUpdate) onUpdate();
            setSelectedEmails([]);
        } catch (err) {
            console.error('Error adding users to group:', err);
            setError('Failed to update group. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
            <label htmlFor="add-users">Add users to this group:</label>
            <br />
            {availableUsers.length === 0 ? (
                <p><em>All users are already in this group.</em></p>
            ) : (
                <select
                    id="add-users"
                    multiple
                    value={selectedEmails}
                    onChange={(e) =>
                        setSelectedEmails(
                            Array.from(e.target.selectedOptions).map((opt) => opt.value)
                        )
                    }
                    disabled={isSubmitting}
                >
                    {availableUsers.map((user) => (
                        <option key={user.email} value={user.email}>
                            {user.name} ({user.email})
                        </option>
                    ))}
                </select>
            )}
            <br /><br />
            {error && <p style={{ color: 'red' }}><strong>{error}</strong></p>}
            <button type="submit" disabled={isSubmitting || availableUsers.length === 0}>
                {isSubmitting ? 'Adding…' : 'Add Users'}
            </button>
        </form>
    );
}

export default AddUserToGroupForm;
