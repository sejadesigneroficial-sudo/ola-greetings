import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const adminEmail = 'scriptbank.json@gmail.com'
    const adminPassword = 'scriptbank.json@gmail.com'

    // Check if admin user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingAdmin = existingUsers?.users?.find(u => u.email === adminEmail)

    let userId: string

    if (existingAdmin) {
      userId = existingAdmin.id
      // Update password if user exists
      await supabaseAdmin.auth.admin.updateUserById(userId, { password: adminPassword })
    } else {
      // Create admin user
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { name: 'Administrador' }
      })

      if (createError) throw createError
      userId = newUser.user.id
    }

    // Check if already in admin_users
    const { data: existingAdminRow } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    if (!existingAdminRow) {
      // Add to admin_users table
      const { error: adminError } = await supabaseAdmin
        .from('admin_users')
        .insert({ user_id: userId })

      if (adminError) throw adminError
    }

    // Create profile if not exists
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    if (!existingProfile) {
      await supabaseAdmin.from('profiles').insert({
        user_id: userId,
        email: adminEmail,
        name: 'Administrador'
      })
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Admin configurado com sucesso!' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
