
-- Enable RLS on the storage.objects table (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for the avatars bucket

-- Policy for public read access to avatar files
CREATE POLICY "Allow public read access for avatars"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

-- Policy for authenticated users to upload their own avatars
CREATE POLICY "Allow authenticated users to upload avatars"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1]::uuid = auth.uid()
  );

-- Policy for authenticated users to update their own avatars
CREATE POLICY "Allow authenticated users to update their own avatars"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1]::uuid = auth.uid()
  );

-- Policy for authenticated users to delete their own avatars
CREATE POLICY "Allow authenticated users to delete their own avatars"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1]::uuid = auth.uid()
  );

-- Create policies for the branding bucket

-- Policy for public read access to branding files
CREATE POLICY "Allow public read access for branding"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'branding');

-- Policy for authenticated users to upload branding files
-- In a production app, you might want to restrict this to admin users only
CREATE POLICY "Allow authenticated users to upload branding"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'branding');

-- Policy for authenticated users to update branding files
CREATE POLICY "Allow authenticated users to update branding"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'branding');

-- Policy for authenticated users to delete branding files
CREATE POLICY "Allow authenticated users to delete branding"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'branding');
