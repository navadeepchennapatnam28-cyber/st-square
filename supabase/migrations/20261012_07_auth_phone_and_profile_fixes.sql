-- Migration 07: Add phone column to profiles and update handle_new_auth_user to persist phone and user-defined name
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- Update trigger function to persist phone number and raw display name
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
DECLARE
    dept_id UUID;
    dept_name TEXT;
    roll_no TEXT;
    user_full_name TEXT;
    user_phone TEXT;
    user_role TEXT;
BEGIN
    user_full_name := COALESCE(
        NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
        split_part(NEW.email, '@', 1)
    );

    user_phone := NULLIF(TRIM(NEW.raw_user_meta_data->>'phone'), '');

    user_role := COALESCE(
        NEW.raw_user_meta_data->>'role',
        'student'
    );
    -- Restrict role values
    IF user_role NOT IN ('student', 'faculty') THEN
        user_role := 'student';
    END IF;

    dept_name := COALESCE(
        NEW.raw_user_meta_data->>'department',
        'Computer Science & AI'
    );

    SELECT id INTO dept_id FROM public.departments WHERE name = dept_name LIMIT 1;
    IF dept_id IS NULL THEN
        SELECT id, name INTO dept_id, dept_name FROM public.departments LIMIT 1;
    END IF;

    roll_no := COALESCE(
        NEW.raw_user_meta_data->>'student_id',
        'STU-' || to_char(now(), 'YYYY') || '-' || upper(substring(NEW.id::text from 1 for 6))
    );

    INSERT INTO public.profiles (
        id,
        role,
        name,
        email,
        phone,
        student_id,
        department_id,
        department_name,
        program,
        batch,
        current_semester,
        avatar_url
    ) VALUES (
        NEW.id,
        user_role,
        user_full_name,
        NEW.email,
        user_phone,
        roll_no,
        dept_id,
        dept_name,
        COALESCE(NEW.raw_user_meta_data->>'program', 'B.Tech Computer Science & AI'),
        COALESCE(NEW.raw_user_meta_data->>'batch', '2022 - 2026'),
        COALESCE((NEW.raw_user_meta_data->>'semester')::INT, 7),
        COALESCE(
            NEW.raw_user_meta_data->>'avatar_url',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
        )
    )
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
        updated_at = now();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
