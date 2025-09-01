import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useFavorites = (user: any) => {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserFavorites();
    } else {
      setFavoriteIds(new Set());
    }
  }, [user]);

  const fetchUserFavorites = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('car_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const ids = new Set(data?.map(fav => fav.car_id) || []);
      setFavoriteIds(ids);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (carId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add favorites",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const isFavorited = favoriteIds.has(carId);
      
      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('car_id', carId);
        
        if (error) throw error;
        
        setFavoriteIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(carId);
          return newSet;
        });
        
        toast({
          title: "Removed from favorites",
          description: "Car removed from your favorites",
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert([{ user_id: user.id, car_id: carId }]);
        
        if (error) throw error;
        
        setFavoriteIds(prev => new Set([...prev, carId]));
        
        toast({
          title: "Added to favorites",
          description: "Car added to your favorites",
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isFavorited = (carId: string) => favoriteIds.has(carId);

  return {
    favoriteIds,
    toggleFavorite,
    isFavorited,
    loading,
    refetchFavorites: fetchUserFavorites
  };
};