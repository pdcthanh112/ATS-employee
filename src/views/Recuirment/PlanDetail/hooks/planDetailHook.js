import { useMutation, useQueryClient } from "react-query";
import { approvePlanDetail, cancelPlanDetail, createPlanDetail, editPlanDetail } from "../../../../apis/planDetailApi";

export const useCreatePlanDetail = () => {
  const queryClient = useQueryClient();
  return useMutation("createPlanDetail",
    async (data) => await createPlanDetail(data),
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
      await approvePlanDetail(data.empId, data.planId);
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
      await cancelPlanDetail(data.empId, data.planId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("listPlanDetail");
      },
    }
  );
};