
-- Create virtual cards table for test payments
CREATE TABLE public.virtual_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  masked_card_number TEXT NOT NULL DEFAULT '**** **** **** 4242',
  card_number_hash TEXT NOT NULL,
  expiry_date TEXT NOT NULL DEFAULT '12/30',
  balance INTEGER NOT NULL DEFAULT 100000, -- 1000.00 in cents (TEST_MAD)
  currency TEXT NOT NULL DEFAULT 'TEST_MAD',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create virtual transactions table
CREATE TABLE public.virtual_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id UUID NOT NULL REFERENCES public.virtual_cards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  amount INTEGER NOT NULL,
  balance_before INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  reference TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'failed', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.virtual_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.virtual_transactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for virtual_cards
CREATE POLICY "Users can view own virtual cards"
ON public.virtual_cards
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own virtual cards"
ON public.virtual_cards
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own virtual cards"
ON public.virtual_cards
FOR UPDATE
USING (auth.uid() = user_id);

-- RLS policies for virtual_transactions
CREATE POLICY "Users can view own transactions"
ON public.virtual_transactions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
ON public.virtual_transactions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_virtual_cards_updated_at
BEFORE UPDATE ON public.virtual_cards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to process virtual payment
CREATE OR REPLACE FUNCTION public.process_virtual_payment(
  p_user_id UUID,
  p_card_number TEXT,
  p_expiry TEXT,
  p_cvv TEXT,
  p_amount INTEGER,
  p_reference TEXT,
  p_description TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_card virtual_cards%ROWTYPE;
  v_card_hash TEXT;
  v_balance_before INTEGER;
  v_balance_after INTEGER;
  v_transaction_id UUID;
BEGIN
  -- Validate test card credentials
  IF p_card_number != '4242424242424242' AND p_card_number != '4242 4242 4242 4242' THEN
    RETURN json_build_object('success', false, 'error', 'Invalid test card number');
  END IF;
  
  IF p_expiry != '12/30' THEN
    RETURN json_build_object('success', false, 'error', 'Invalid expiry date');
  END IF;
  
  IF p_cvv != '123' THEN
    RETURN json_build_object('success', false, 'error', 'Invalid CVV');
  END IF;
  
  -- Create hash for card lookup
  v_card_hash := encode(sha256(p_card_number::bytea), 'hex');
  
  -- Get or create virtual card
  SELECT * INTO v_card FROM virtual_cards 
  WHERE user_id = p_user_id AND card_number_hash = v_card_hash;
  
  IF v_card.id IS NULL THEN
    -- Create new virtual card with initial balance
    INSERT INTO virtual_cards (user_id, card_number_hash, masked_card_number, expiry_date)
    VALUES (p_user_id, v_card_hash, '**** **** **** 4242', '12/30')
    RETURNING * INTO v_card;
  END IF;
  
  -- Check card status
  IF v_card.status != 'active' THEN
    RETURN json_build_object('success', false, 'error', 'Card is blocked');
  END IF;
  
  -- Check balance
  IF v_card.balance < p_amount THEN
    -- Record failed transaction
    INSERT INTO virtual_transactions (card_id, user_id, amount, balance_before, balance_after, reference, description, status)
    VALUES (v_card.id, p_user_id, p_amount, v_card.balance, v_card.balance, p_reference, p_description, 'failed');
    
    RETURN json_build_object(
      'success', false, 
      'error', 'Insufficient balance',
      'available_balance', v_card.balance,
      'required_amount', p_amount
    );
  END IF;
  
  -- Process payment
  v_balance_before := v_card.balance;
  v_balance_after := v_card.balance - p_amount;
  
  -- Update card balance
  UPDATE virtual_cards SET balance = v_balance_after WHERE id = v_card.id;
  
  -- Record transaction
  INSERT INTO virtual_transactions (card_id, user_id, amount, balance_before, balance_after, reference, description, status)
  VALUES (v_card.id, p_user_id, p_amount, v_balance_before, v_balance_after, p_reference, p_description, 'completed')
  RETURNING id INTO v_transaction_id;
  
  RETURN json_build_object(
    'success', true,
    'transaction_id', v_transaction_id,
    'amount_charged', p_amount,
    'balance_before', v_balance_before,
    'balance_after', v_balance_after,
    'currency', v_card.currency
  );
END;
$$;
