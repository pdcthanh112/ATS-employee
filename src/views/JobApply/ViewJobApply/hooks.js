import { useMutation, useQueryClient } from "react-query";
import { approveJobApply, rejectJobApply } from "../../../apis/jobApplyApi";

export const useHandleApprovePassScreeningJobApply = () => { 
  const queryClient = useQueryClient();
  return useMutation("approvePassScreeningJobApply",
    async (data) => {
      await approveJobApply(data.jobApplyId, data.empId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("jobApplyPassScreening");
      },
    }
  );
};

export const useHandleRejectPassScreeningJobApply = () => {
  const queryClient = useQueryClient();
  return useMutation("rejectPassScreeningJobApply",
    async (data) => {
      await rejectJobApply(data.jobApplyId, data.empId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("jobApplyPassScreening");
      },
    }
  );
};

export const useHandleApproveFailScreeningJobApply = () => { 
  const queryClient = useQueryClient();
  return useMutation("approveFailScreeningJobApply",
    async (data) => {
      await approveJobApply(data.jobApplyId, data.empId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("jobApplyFailScreening");
      },
    }
  );
};

export const useHandleRejectFailScreeningJobApply = () => {
  const queryClient = useQueryClient();
  return useMutation("rejectFailScreeningJobApply",
    async (data) => {
      await rejectJobApply(data.jobApplyId, data.empId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("jobApplyFailScreening");
      },
    }
  );
};