export async function load ({ locals }) {
  if (locals.user) redirect(303, '/dashboard')
}
