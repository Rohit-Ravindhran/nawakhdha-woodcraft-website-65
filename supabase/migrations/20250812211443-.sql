-- Apply all pending content changes immediately and mark them approved
begin;

with originals as (
  select 
    r.id,
    r.page_slug,
    r.section_identifier,
    r.content_type,
    r.proposed_content,
    r.current_content,
    coalesce(pc.content_value, r.current_content) as original_value
  from public.content_change_requests r
  left join public.page_content pc 
    on pc.page_slug = r.page_slug 
   and pc.section_identifier = r.section_identifier
  where r.status = 'pending'
), upserted as (
  insert into public.page_content (page_slug, section_identifier, content_type, content_value, updated_at)
  select page_slug, section_identifier, content_type, proposed_content, now()
  from originals
  on conflict (page_slug, section_identifier) do update set
    content_type = excluded.content_type,
    content_value = excluded.content_value,
    updated_at = excluded.updated_at
  returning page_slug, section_identifier
)
update public.content_change_requests r
set 
  status = 'approved',
  reviewed_at = now(),
  applied_at = now(),
  original_content_before_change = o.original_value,
  can_rollback = true
from originals o
where r.id = o.id and r.status = 'pending';

commit;