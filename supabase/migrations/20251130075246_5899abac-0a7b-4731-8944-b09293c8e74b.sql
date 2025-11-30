-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('user', 'admin');

-- Create user_roles table (secure role management)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create profiles table (user information)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  twitter_handle TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create payouts table
CREATE TABLE public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trader_name TEXT NOT NULL,
  twitter_handle TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  date DATE NOT NULL,
  proof_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_id UUID REFERENCES auth.users(id),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payout_id UUID REFERENCES public.payouts(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Create trigger function for profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create trigger for profile updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own role"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for payouts
CREATE POLICY "Approved payouts are viewable by everyone"
  ON public.payouts FOR SELECT
  USING (status = 'approved' OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Verified users can insert payouts"
  ON public.payouts FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_verified = true)
  );

CREATE POLICY "Admins can update payouts"
  ON public.payouts FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete payouts"
  ON public.payouts FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for reviews
CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Create storage bucket for payout proofs
INSERT INTO storage.buckets (id, name, public)
VALUES ('proofs', 'proofs', false);

-- Storage policies for proofs bucket
CREATE POLICY "Authenticated users can upload proofs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'proofs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own proofs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'proofs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all proofs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'proofs' AND
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Public can view approved payout proofs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'proofs' AND
    EXISTS (
      SELECT 1 FROM public.payouts
      WHERE proof_url = name AND status = 'approved'
    )
  );