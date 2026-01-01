-- Update default balance for new virtual cards to 5000 MAD (500,000 cents)
ALTER TABLE public.virtual_cards ALTER COLUMN balance SET DEFAULT 500000;

-- Update existing virtual cards to have 5000 MAD balance
UPDATE public.virtual_cards SET balance = 500000;