import { useMutation, useQueryClient } from "react-query";
import { approvePlanDetail, cancelPlanDetail, createPlanDetail, editPlanDetail } from "../../../../apis/planDetailApi";

export const useCreatePlanDetail = () => {
  const queryClient = useQueryClient();
  return useMutation("createPlanDetail",
    async (data) => createPlanDetail(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("listPlanDetail");
      },
    }
  );
};

export const useEditPlanDetail = () => {
  const queryClient = useQueryClient();
  return useMutation("editPlanDetail",
    async (data) => await editPlanDetail(data),
    {
      onSettled: () => {
        queryClient.invalidateQueries("listPlanDetail");
      },
    }
  );
};

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