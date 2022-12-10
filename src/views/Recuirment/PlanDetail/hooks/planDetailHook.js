import { useMutation, useQueryClient } from "react-query";
import { approvePlanDetail, cancelPlanDetail } from "../../../../apis/planDetailApi";

export const useHandleApprovePlanDetail = () => { 
  const queryClient = useQueryClient();
  return useMutation("approvePlanDetail",
    async (data) => {
      approvePlanDetail(data.empId, data.planId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("listPlanDetail");
      },
    }
  );
};

export const useHandleRejectPlanDetail = () => {
  const queryClient = useQueryClient();
  return useMutation("rejectPlanDetail",
    async (data) => {
      cancelPlanDetail(data.empId, data.planId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("listPlanDetail");
      },
    }
  );
};