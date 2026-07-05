import { supabase } from './supabaseClient'

export async function softDeleteRecord(table, record) {
  const { error } = await supabase
    .from(table)
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', record.id)

  if (error) return { error }

  await supabase.from('audit_log').insert({
    table_name: table,
    record_id: record.id,
    action: 'delete',
    record_snapshot: record,
  })

  return { error: null }
}
