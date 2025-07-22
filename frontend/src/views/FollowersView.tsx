import { useQuery } from "@tanstack/react-query";
import { getMyFollowers } from "../api/DevTreeAPI";
import { User } from "../types";

export default function FollowersView() {
  const { data, isLoading, error } = useQuery<User[]>({
    queryKey: ["followers"],
    queryFn: getMyFollowers,
    placeholderData: [], // evita parpadeos
  });

  if (isLoading) return <p className="text-center mt-6">Cargando...</p>;
  if (error)
    return (
      <p className="text-center text-red-500 mt-6">
        Error: {(error as Error).message}
      </p>
    );

  return (
    <div className="max-w-lg mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Mis Seguidores</h2>
      {data?.length === 0 ? (
        <p className="text-center text-gray-500">Aún no tienes seguidores.</p>
      ) : (
        <ul className="space-y-4">
          {data?.map((user) => (
            <li
              key={user._id}
              className="p-4 border rounded-lg shadow-sm bg-white"
            >
              <p className="font-semibold text-lg">
                {user.name || "Sin nombre"}
              </p>
              <p className="text-gray-500">@{user.handle || "sin_handle"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
