import { addRoom, getRooms } from "../state/roomState";
import { redisSubscriber } from "./redisClient";

export const subscribeToRoomEvents = async () => {
  try {
    redisSubscriber.subscribe("room-events", (message) => {
      const event = JSON.parse(message);
      console.log("Room event received:", event);

      // Add the room to the in-memory map
      addRoom(event.roomId, event.name);
      console.log(getRooms());
    });

    console.log("Subscribed to room-events channel");
  } catch (error) {
    console.error("Error subscribing to room-events channel:", error);
  }
};
