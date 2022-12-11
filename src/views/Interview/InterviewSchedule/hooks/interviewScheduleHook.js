import { useMutation, useQueryClient } from "react-query";
import { createInterview, confirmInterview, rejectInterview, searchInterviewSchedule, cancelInterview } from "../../../../apis/interviewScheduleApi";

export const useCreateInterviewSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation("createInterviewSchedule",
    async (data) => createInterview(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("listInterviewSchedule");
      },
    }
  );
};

export const useSearchInterviewSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation("searchInterviewSchedule",
    async (data) => searchInterviewSchedule(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("listInterviewSchedule");
      },
    }
  );
};

export const useHandleApproveInterviewSchedule = () => { 
  const queryClient = useQueryClient();
  return useMutation("approveInterviewSchedule",
    async (data) => {
      confirmInterview(data.idEmployee, data.idInterview);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("listInterviewSchedule");
      },
    }
  );
};

export const useHandleRejectInterviewSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation("rejectInterviewSchedule",
    async (data) => {
      rejectInterview(data.idEmployee, data.idInterview);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("listInterviewSchedule");
      },
    }
  );
};

export const useHandleCancelInterviewSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation("cancelInterviewSchedule",
    async (data) => {
      cancelInterview(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("listInterviewSchedule");
      },
    }
  );
};