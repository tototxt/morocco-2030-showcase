-- Create face_enrollments table to store face data references
CREATE TABLE public.face_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  purchase_id UUID REFERENCES public.purchases(id) ON DELETE CASCADE,
  face_image_url TEXT NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_verified BOOLEAN NOT NULL DEFAULT false,
  last_verification_at TIMESTAMP WITH TIME ZONE,
  last_verification_result TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.face_enrollments ENABLE ROW LEVEL SECURITY;

-- Users can view their own enrollments
CREATE POLICY "Users can view own face enrollments"
ON public.face_enrollments
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own enrollments
CREATE POLICY "Users can insert own face enrollments"
ON public.face_enrollments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own enrollments
CREATE POLICY "Users can update own face enrollments"
ON public.face_enrollments
FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can view all enrollments
CREATE POLICY "Admins can view all face enrollments"
ON public.face_enrollments
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update all enrollments (for verification results)
CREATE POLICY "Admins can update all face enrollments"
ON public.face_enrollments
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster lookups
CREATE INDEX idx_face_enrollments_user_id ON public.face_enrollments(user_id);
CREATE INDEX idx_face_enrollments_purchase_id ON public.face_enrollments(purchase_id);