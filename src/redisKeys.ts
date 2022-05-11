export class RedisKeys {
    private static room(roomId: string): string {
        return `room:{${roomId}}`;
    }
    public static roomSessions(roomId: string) {
        return `${RedisKeys.room(roomId)}:sessions`;
    }
    public static isTepmStorageLocked() {
        return "isTepmStorageLocked";
    }

    public static tempStorageKeys() {
        return "tempStorage";
    }

    public static tempStorageKey(id: string) {
        return `${RedisKeys.tempStorageKeys()}:${id}`;
    }

    public static lastKeyframe(streamId: string) {
        return `lastKeyframe: ${streamId}`;
    }

    public static roomContext(roomId: string) {
        return `roomContext:${roomId}`;
    }

    public static classAttendees(roomId: string) {
        return `classAttendees:${roomId}`;
    }
}