import { useMutation, useQueryClient } from "react-query";
import { editInterviewDetail } from "../../../../apis/interviewDetailApi";

export const useEditInterviewDetail = () => {
  const queryClient = useQueryClient();
  return useMutation("editInterviewDetail",
    async (data) => await editInterviewDetail(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("listInterviewDetail");
      },
    }
  );
};
