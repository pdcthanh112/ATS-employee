import { useMutation, useQueryClient } from "react-query";
import { createRecruitmentRequest } from "../../../../apis/recruimentRequestApi";

export const useCreateRecruitmentRequest = () => {
  const queryClient = useQueryClient();
  return useMutation("createRecruitmentRequest",
    async (data) => createRecruitmentRequest(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("listRecruitmentRequest");
      },
    }
  );
};