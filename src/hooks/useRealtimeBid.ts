import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BidState {
  currentBid: number;
  isFlashing: boolean;
  bidCount: number;
}

/**
 * Subscribes to real-time updates for a single product's bid fields.
 * Returns the latest current_bid and a flash flag to animate the price change.
 */
export function useRealtimeBid(
  productId: string,
  initialBid: number
): BidState {
  const [currentBid, setCurrentBid] = useState(initialBid);
  const [isFlashing, setIsFlashing] = useState(false);
  const [bidCount, setBidCount] = useState(0);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync when the prop changes (e.g. initial data loads after mount)
  useEffect(() => {
    setCurrentBid(initialBid);
  }, [initialBid]);

  useEffect(() => {
    const channel = supabase
      .channel(`bid:${productId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products',
          filter: `id=eq.${productId}`,
        },
        (payload) => {
          const updated = payload.new as { current_bid?: number };
          if (updated.current_bid !== undefined) {
            setCurrentBid(updated.current_bid);
            setBidCount((c) => c + 1);

            // Trigger flash animation
            setIsFlashing(true);
            if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
            flashTimerRef.current = setTimeout(() => setIsFlashing(false), 900);
          }
        }
      )
      .subscribe();

    return () => {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      supabase.removeChannel(channel);
    };
  }, [productId]);

  return { currentBid, isFlashing, bidCount };
}
