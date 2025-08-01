import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const unblockUsers = async (userIds: string[]) => {
  return await api.put("/users/unblock", userIds);
};

export function useUnblockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unblockUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
