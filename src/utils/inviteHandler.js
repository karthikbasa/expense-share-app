import { supabase } from '../supabaseClient';

export async function handlePostSignup() {
    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error("❌ Failed to get signed-up user:", authError);
        return;
    }

    const email = user.email;
    const name = user.user_metadata?.full_name || 'New User';

    const { data: invite, error: inviteError } = await supabase
        .from('invites')
        .select('*')
        .eq('email', email)
        .eq('status', 'pending')
        .single();

    if (inviteError || !invite) {
        console.log("✅ No pending invite found for:", email);
        return;
    }

    const { error: memberError } = await supabase
        .from('members')
        .insert({
            user_id: user.id,
            name,
            email
        });

    if (memberError) {
        console.error("❌ Failed to create member:", memberError);
        return;
    }

    const { error: groupMemberError } = await supabase
        .from('group_members')
        .insert({
            group_id: invite.group_id,
            name,
            email
        });

    if (groupMemberError) {
        console.error("❌ Failed to add user to group:", groupMemberError);
        return;
    }

    const { error: updateError } = await supabase
        .from('invites')
        .update({ status: 'accepted' })
        .eq('id', invite.id);

    if (updateError) {
        console.error("❌ Failed to update invite status:", updateError);
    } else {
        console.log(`🎉 ${email} accepted invite to group ${invite.group_id}`);
    }
}