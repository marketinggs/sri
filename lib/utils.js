import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { API_ENDPOINTS, API_CONFIG } from './endpoints';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Real API function to fetch lists from the server
export async function fetchLists() {
  try {
    const response = await fetch(API_ENDPOINTS.GET_LISTS, {
      headers: API_CONFIG.HEADERS
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch lists: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Check if the response has the expected structure
    if (!result.success || !result.data) {
      throw new Error('Invalid API response format');
    }
    
    // Transform the API response to match the expected format
    return result.data.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type,
      count: item.contacts_count, // Map contacts_count to count
      created_at: item.created_at,
      last_updated_at: item.last_updated_at
    }));
    
  } catch (error) {
    console.error('Error fetching lists:', error);
    throw error;
  }
}
