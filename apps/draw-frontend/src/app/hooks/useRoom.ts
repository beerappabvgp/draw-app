import { useState } from 'react';
import axios from 'axios';

interface Room {
  id: number;
  name: string;
  roomId: number;
  createdById: number;
}

interface CreateRoomResponse {
  room: Room;
  message: string;
}

export const useRoom = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string>('');

  // Function to retrieve the token, could be from localStorage, sessionStorage, or a context
  const getAuthToken = () => {
    // This assumes the token is stored in localStorage after the user logs in
    return localStorage.getItem('token');
  };

  // Function to create a room
  const createRoom = async (name: string): Promise<string | null> => {
    try {
      // Retrieve the authentication token
      const token = getAuthToken();

      // If the token is not available, handle the error (e.g., user is not authenticated)
      if (!token) {
        setError('User not authenticated');
        return null;
      }

      // Axios POST request with Authorization header
      const response = await axios.post<CreateRoomResponse>(
        'http://localhost:4000/api/v1/rooms/create/',
        { name },
        {
          headers: {
            // Add the Authorization header with the Bearer token
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setRoom(response.data.room); // Store the room data in state
        console.log('Room is: ', response.data.room);
        return response.data.message; // Return the success message
      } else {
        setError('Failed to create room');
        return null;
      }
    } catch (err: any) {
      if ((axios as any).isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Error creating room');
      } else {
        setError('Error creating room');
      }
      return null;
    }
  };

  return {
    room,
    createRoom,
    error,
  };
};
