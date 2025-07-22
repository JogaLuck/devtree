import { useEffect, useState } from "react";
import { checkFollowStatus, followUser, unfollowUser } from "../api/DevTreeAPI";

interface Props {
  userId: string;
}

export default function FollowButton({ userId }: Props) {
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await checkFollowStatus(userId);
        setIsFollowing(status);
      } catch (error) {
        console.error("Error al obtener el estado de seguimiento:", error);
      }
    };
    fetchStatus();
  }, [userId]);

  const handleClick = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(userId);
        setIsFollowing(false);
      } else {
        await followUser(userId);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error al seguir/dejar de seguir:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isFollowing === null) return null; // Esperando el estado

  return (
    <button
      className={`px-4 py-2 rounded text-white ${
        isFollowing
          ? "bg-red-500 hover:bg-red-600"
          : "bg-blue-500 hover:bg-blue-600"
      }`}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? "Cargando..." : isFollowing ? "Dejar de seguir" : "Seguir"}
    </button>
  );
}
