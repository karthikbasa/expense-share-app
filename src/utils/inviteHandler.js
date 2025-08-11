import { supabase } from '../supabaseClient';

export async function handlePostSignup() {
    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error("❌ Failed to get signed-up user:", authError);
        return { success: false };
    }

    const email = user.email;

    // 🔍 Step 1: Find pending invite
    const { data: invite, error: inviteError } = await supabase
        .from('invites')
        .select('*')
        .eq('email', email)
        .eq('status', 'pending')
        .maybeSingle();

    if (inviteError || !invite) {
        console.log("✅ No pending invite found for:", email);
        return { success: false };
    }

    // ✅ Step 2: Mark invite as accepted
    const { error: inviteUpdateError } = await supabase
        .from('invites')
        .update({ status: 'accepted' })
        .eq('id', invite.id);

    if (inviteUpdateError) {
        console.error("❌ Failed to update invite status:", inviteUpdateError);
        return { success: false };
    }

    console.log(`🎉 ${email} accepted invite from ${invite.invited_by}`);

    return {
        success: true,
        message: `You've accepted your invite to Splitzy!`
    };
}
