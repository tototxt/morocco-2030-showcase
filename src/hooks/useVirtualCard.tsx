import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface VirtualCard {
  id: string;
  masked_card_number: string;
  expiry_date: string;
  balance: number;
  currency: string;
  status: string;
}

interface PaymentResult {
  success: boolean;
  error?: string;
  transaction_id?: string;
  amount_charged?: number;
  balance_before?: number;
  balance_after?: number;
  currency?: string;
  available_balance?: number;
  required_amount?: number;
}

export const useVirtualCard = (userId: string | undefined) => {
  const [card, setCard] = useState<VirtualCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCard = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      const { data } = await supabase
        .from("virtual_cards")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      setCard(data);
      setIsLoading(false);
    };

    fetchCard();
  }, [userId]);

  const processPayment = async (
    cardNumber: string,
    expiry: string,
    cvv: string,
    amount: number,
    reference: string,
    description?: string
  ): Promise<PaymentResult> => {
    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }

    // Clean card number (remove spaces)
    const cleanCardNumber = cardNumber.replace(/\s/g, "");

    const { data, error } = await supabase.rpc("process_virtual_payment", {
      p_user_id: userId,
      p_card_number: cleanCardNumber,
      p_expiry: expiry,
      p_cvv: cvv,
      p_amount: amount,
      p_reference: reference,
      p_description: description || null,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const result = data as unknown as PaymentResult;

    // Refresh card data after payment
    if (result.success) {
      const { data: updatedCard } = await supabase
        .from("virtual_cards")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      
      setCard(updatedCard);
    }

    return result;
  };

  const formatBalance = (balance: number) => {
    return (balance / 100).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return {
    card,
    isLoading,
    processPayment,
    formatBalance,
  };
};
