import { UserHandle } from "../types";
import HandleData from "../components/HandleData";
import FollowButton from "../components/FollowButton";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api/DevTreeAPI";

type Props = {
  user: UserHandle;
};

export default function UserProfile({ user }: Props) {
  const { data: authUser } = useQuery({
    queryFn: getUser,
    queryKey: ["user"],
    refetchOnWindowFocus: false,
  });

  return (
    <div className="space-y-10">
      {/* Mostrar los datos del usuario */}
      <HandleData data={user} />

      {/* Mostrar el botón de seguir si no es tu propio perfil */}
      {authUser?._id !== user._id && (
        <div className="text-center">
          <FollowButton userId={user._id} />
        </div>
      )}
    </div>
  );
}
