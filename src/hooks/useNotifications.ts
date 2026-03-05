import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

export interface Notification {
  id: string;
  type: 'arremate' | 'info';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  link?: string;
}

export function useNotifications() {
  const { user } = useAuthContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch user's arremates as notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('arremates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const notifs: Notification[] = (data || []).map(arremate => ({
        id: arremate.id,
        type: 'arremate' as const,
        title: 'Novo Arremate!',
        message: `Você arrematou: ${arremate.product_title}`,
        read: false, // You could track this in a separate table
        created_at: arremate.created_at || new Date().toISOString(),
        link: '/meus-arremates'
      }));

      setNotifications(notifs);
      setUnreadCount(notifs.length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [user]);

  // Subscribe to realtime changes
  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    // Subscribe to new arremates for this user
    const channel = supabase
      .channel('user-arremates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'arremates',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newArremate = payload.new as any;
          const newNotif: Notification = {
            id: newArremate.id,
            type: 'arremate',
            title: 'Novo Arremate!',
            message: `Você arrematou: ${newArremate.product_title}`,
            read: false,
            created_at: newArremate.created_at || new Date().toISOString(),
            link: '/meus-arremates'
          };
          setNotifications(prev => [newNotif, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchNotifications]);

  const markAllAsRead = () => {
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAllAsRead,
    clearNotifications,
    refresh: fetchNotifications
  };
}
