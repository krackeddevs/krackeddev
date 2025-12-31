-- Ensure the function exists and has correct permissions
create or replace function public.increment_question_view(question_id uuid)
returns void as $$
begin
  update public.questions
  set view_count = view_count + 1
  where id = question_id;
end;
$$ language plpgsql security definer;

-- Grant execution to all users (including anonymous)
grant execute on function public.increment_question_view(uuid) to anon, authenticated, service_role;
