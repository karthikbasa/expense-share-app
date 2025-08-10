import { supabase } from '../supabaseClient';


// Load all groups from Supabase
export async function getGroups() {
    const { data, error } = await supabase
        .from('groups')
        .select(`
            *,
            group_members (
                name,
                email
            ),
            expenses (
                title,
                amount,
                paid_by,
                created_at
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching groups:', error);
        return [];
    }

    const enriched = data.map(group => ({
        ...group,
        users: group.group_members,
        expenses: (group.expenses || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }));

    return enriched;
}

// Save a new group with complete structure + invites
export async function addGroup(name, users = [], status = 'active') {
    // 🔐 Step 0: Get current authenticated user
    const {
        data: { user: currentUser },
        error: authError
    } = await supabase.auth.getUser();

    if (authError || !currentUser) {
        console.error('Failed to get authenticated user:', authError);
        return null;
    }

    const currentUserEmail = currentUser.email;

    // 🔍 Step 1: Resolve member.id from current user's email
    const { data: currentMember, error: memberLookupError } = await supabase
        .from('members')
        .select('id, name, email')
        .eq('email', currentUserEmail)
        .single();

    if (memberLookupError || !currentMember) {
        console.error('Current user not found in members table:', memberLookupError);
        return null;
    }

    const createdBy = currentMember.id;

    // 🔍 Step 2: Fetch full user details from 'members' table using emails
    const { data: fullUsers, error: fetchError } = await supabase
        .from('members')
        .select('id, name, email')
        .in('email', users);

    if (fetchError) {
        console.error('Error fetching user details:', fetchError);
    }

    const existingEmails = Array.isArray(fullUsers) ? fullUsers.map(u => u.email) : [];
    const pendingEmails = users.filter(email => !existingEmails.includes(email));

    // 🧱 Step 3: Create the group with created_by
    const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .insert([{ name, status, created_by: createdBy }])
        .select();

    if (groupError || !groupData?.length) {
        console.error('Error creating group:', groupError);
        return null;
    }

    const groupId = groupData[0].id;

    // 👥 Step 4: Insert confirmed members into group_members
    const memberPayload = [];

    // Add creator as a member
    memberPayload.push({
        group_id: groupId,
        member_id: currentMember.id,
        name: currentMember.name,
        email: currentMember.email,
        added_by: createdBy
    });

    // Add other confirmed members
    if (fullUsers?.length) {
        for (const u of fullUsers) {
            if (u.email !== currentUserEmail) {
                memberPayload.push({
                    group_id: groupId,
                    member_id: u.id,
                    name: u.name,
                    email: u.email,
                    added_by: createdBy
                });
            }
        }
    }

    const { error: memberError } = await supabase
        .from('group_members')
        .insert(memberPayload);

    if (memberError) {
        console.error('Error adding members:', memberError);
    }

    // 📨 Step 5: Insert pending invites
    if (pendingEmails.length > 0) {
        const invitePayload = pendingEmails.map(email => ({
            email,
            invited_by: currentUser.id,
            group_id: groupId,
            status: 'pending'
        }));

        const { error: inviteError } = await supabase
            .from('invites')
            .insert(invitePayload);

        if (inviteError) {
            console.error('Error creating invites:', inviteError);
        }
    }

    return groupData[0];
}

// Load all users (across all groups)
export async function getUsers() {
    const { data, error } = await supabase
        .from('members')
        .select('*'); // includes invited users with user_id = null

    if (error) {
        console.error('Error fetching users:', error);
        return [];
    }

    return data || [];
}

// Save users to Supabase (not tied to a group)
export async function saveUsers(users) {
    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error("Failed to get authenticated user:", authError);
        return;
    }

    const payload = users.map(u => ({
        user_id: user.id,
        name: u.name,
        email: u.email
    }));

    const { error } = await supabase
        .from('members')
        .insert(payload);

    if (error) {
        console.error('Error saving users:', error.message);
    }
}

// Add an expense to a specific group
export async function addExpenseToGroup(groupId, expense) {
    if (!groupId) {
        console.error('Missing group ID for expense insert.');
        return;
    }

    const { error: expenseError } = await supabase
        .from('expenses')
        .insert([{ ...expense, group_id: groupId }]);

    if (expenseError) {
        console.error('Error adding expense:', expenseError);
    }
}


// Save all groups directly (overwrite logic not recommended with Supabase)
export async function saveGroups(groups) {
    console.warn('Bulk overwrite not recommended with Supabase. Consider updating groups individually.');
}