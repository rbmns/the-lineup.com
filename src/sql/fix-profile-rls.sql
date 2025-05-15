
-- Enable Row Level Security on profiles table if not already enabled
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- Delete any existing RLS policies for profiles table to start fresh
DROP POLICY IF EXISTS "Users can view their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profiles" ON public.profiles;

-- Create policies that enable users to select, insert, and update their own profiles
-- This policy allows users to view their own profile
CREATE POLICY "Users can view their own profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- This policy allows users to insert their own profile
CREATE POLICY "Users can insert their own profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- This policy allows users to update their own profile
CREATE POLICY "Users can update their own profiles" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Create a trigger to automatically create profiles for new users if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (new.id, split_part(new.email, '@', 1), new.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
