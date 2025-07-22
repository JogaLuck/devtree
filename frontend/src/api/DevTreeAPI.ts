import { isAxiosError } from "axios";
import api from "../config/axios";
import { User, UserHandle } from "../types";

export async function getUser() {
  try {
    const { data } = await api<User>("/user");
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function updateProfile(formData: User) {
  try {
    const { data } = await api.patch<string>("/user", formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function uploadImage(file: File) {
  let formData = new FormData();
  formData.append("file", file);
  try {
    const {
      data: { image },
    }: { data: { image: string } } = await api.post("/user/image", formData);
    return image;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getUserByHandle(handle: string) {
  try {
    const url = `/${handle}`;
    const { data } = await api<UserHandle>(url);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function searchByHandle(handle: string) {
  try {
    const { data } = await api.post<string>("/search", { handle });
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function checkFollowStatus(userId: string): Promise<boolean> {
  try {
    const { data } = await api<{ isFollowing: boolean }>(
      `/users/${userId}/follow-status`
    );
    return data.isFollowing;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
    throw new Error("Error desconocido al verificar estado de seguimiento");
  }
}

export async function followUser(userId: string) {
  try {
    const { data } = await api.post<{ message: string }>(
      `/users/${userId}/follow`
    );
    return data.message;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function unfollowUser(userId: string) {
  try {
    const { data } = await api.delete<{ message: string }>(
      `/users/${userId}/unfollow`
    );
    return data.message;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getMyFollowers() {
  const response = await api.get("/users/me/followers");
  return response.data;
}
