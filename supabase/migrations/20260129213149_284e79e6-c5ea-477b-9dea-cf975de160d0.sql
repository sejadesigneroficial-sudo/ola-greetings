-- Create contracts table to store generated contracts
CREATE TABLE public.contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_number TEXT NOT NULL UNIQUE,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('entrega', '30percent')),
  buyer_name TEXT NOT NULL,
  buyer_cpf TEXT NOT NULL,
  buyer_email TEXT,
  buyer_phone TEXT,
  seller_name TEXT NOT NULL,
  seller_cnpj TEXT NOT NULL,
  vehicle_description TEXT,
  vehicle_lot_number TEXT,
  bid_value NUMERIC NOT NULL DEFAULT 0,
  freight_value NUMERIC DEFAULT 0,
  total_value NUMERIC NOT NULL DEFAULT 0,
  deposit_value NUMERIC DEFAULT 0,
  remaining_value NUMERIC DEFAULT 0,
  invoice_generated BOOLEAN DEFAULT false,
  invoice_number TEXT,
  invoice_generated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access only
CREATE POLICY "Admins can view all contracts" 
ON public.contracts 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert contracts" 
ON public.contracts 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update contracts" 
ON public.contracts 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete contracts" 
ON public.contracts 
FOR DELETE 
USING (is_admin(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_contracts_updated_at
BEFORE UPDATE ON public.contracts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();