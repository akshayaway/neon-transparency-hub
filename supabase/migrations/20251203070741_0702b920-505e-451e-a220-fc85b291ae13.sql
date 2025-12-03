-- Drop the existing INSERT policy that requires verification
DROP POLICY IF EXISTS "Verified users can insert payouts" ON public.payouts;

-- Create new policy allowing any authenticated user to insert their own payouts
CREATE POLICY "Authenticated users can insert payouts"
ON public.payouts
FOR INSERT
WITH CHECK (auth.uid() = user_id);