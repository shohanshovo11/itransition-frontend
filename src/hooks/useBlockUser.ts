import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const blockUsers = async (userIds: string[]) => {
  return await api.put("/users/block", userIds);
};

export function useBlockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blockUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
