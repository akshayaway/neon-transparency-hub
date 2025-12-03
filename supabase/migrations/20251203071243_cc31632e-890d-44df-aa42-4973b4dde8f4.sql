-- Make the proofs bucket public so approved payout images can be displayed
UPDATE storage.buckets SET public = true WHERE id = 'proofs';

-- Add RLS policy for authenticated users to upload their own proofs
CREATE POLICY "Users can upload their own proofs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'proofs' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access to all proofs (since payouts are public after approval)
CREATE POLICY "Anyone can view proofs"
ON storage.objects
FOR SELECT
USING (bucket_id = 'proofs');