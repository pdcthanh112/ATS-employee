import { useMutation, useQueryClient } from "react-query";
import { approveRecruitmentPlan, createRecruitmentPlan, editRecruitmentPlan, rejectRecruitmentPlan,} from "../../../../apis/recruitmentPlanApi";

export const useCreateRecruitmentPlan = () => {
  const queryClient = useQueryClient();
  return useMutation("createRecruitmentPlan",
    async (data) => createRecruitmentPlan(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("listRecruitmentPlan");
      },
    }
  );
};

export const useEditRecruitmentPlan = () => {
  const queryClient = useQueryClient();
  return useMutation("editRecruitmentPlan",
    async (data) => editRecruitmentPlan(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("listRecruitmentPlan");
      },
    }
  );
};

export const useHandleApproveRecruitmentPlan = () => {
  const queryClient = useQueryClient();
  return useMutation("approveRecruitmentPlan",
    async (data) => {
      approveRecruitmentPlan(data.empId, data.planId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("listRecruitmentPlan");
      },
    }
  );
};

export const useHandleRejectRecruitmentPlan = () => {
  const queryClient = useQueryClient();
  return useMutation("rejectRecruitmentPlan",
    async (data) => {
      rejectRecruitmentPlan(data.empId, data.planId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("listRecruitmentPlan");
      },
    }
  );
};
