import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserByHandle } from "../api/DevTreeAPI";
import UserProfile from "../views/UserProfile"; 

export default function HandleView() {
  const params = useParams();
  const handle = params.handle!;
  const { data, error, isLoading } = useQuery({
    queryFn: () => getUserByHandle(handle),
    queryKey: ["handle", handle],
    retry: 1,
  });

  if (isLoading) return <p className="text-center text-white">Cargando...</p>;
  if (error) return <Navigate to={"/404"} />;

  return <UserProfile user={data!} />
}
