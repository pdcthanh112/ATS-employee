import { useMutation, useQueryClient } from "react-query";
import { closeRecruimentRequestById, createRecruitmentRequest } from "../../../../apis/recruimentRequestApi";

export const useCreateRecruitmentRequest = () => {
  const queryClient = useQueryClient();
  return useMutation("createRecruitmentRequest",
    async (data) => await createRecruitmentRequest(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("listRecruitmentRequest");
      },
    }
  );
};

export const useHandleCloseRecruitmentRequest = () => {
  const queryClient = useQueryClient();
  return useMutation(
    "closeRecruitmentRequest",
    async (id) => {
      await closeRecruimentRequestById(id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("listRecruitmentRequest");
      },
    }
  );
};
