import { supabase } from '../App'; // Import your Supabase client instance

const saveLocationToSupabase = async (email, latitude, longitude) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(
        {
          latitude: latitude,
          longitude: latitude,
          last_updated: new Date(),
        }
      ).eq('email', email);;

    if (error) {
      console.error('Error saving location to Supabase:', error.message);
    } else {
      console.log('Location saved successfully:', data);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

export default saveLocationToSupabase;