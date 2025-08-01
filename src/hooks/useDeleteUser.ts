import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteUsers = async (userIds: string[]) => {
  return await api.delete("/users/delete", { data: userIds });
};

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
