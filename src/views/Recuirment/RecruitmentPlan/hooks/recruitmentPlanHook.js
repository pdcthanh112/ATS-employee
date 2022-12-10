import { useMutation, useQueryClient } from "react-query";
import { approveRecruitmentPlan, rejectRecruitmentPlan,} from "../../../../apis/recruitmentPlanApi";

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
