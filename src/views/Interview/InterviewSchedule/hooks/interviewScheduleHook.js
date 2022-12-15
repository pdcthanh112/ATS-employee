import { useMutation, useQueryClient } from "react-query";
import { createInterview, confirmInterview, rejectInterview, cancelInterview, closeInterview,} from "../../../../apis/interviewScheduleApi";

export const useCreateInterviewSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation(
    "createInterviewSchedule",
    async (data) => await createInterview(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("listInterviewSchedule");
      },
    }
  );
};

// export const useSearchInterviewSchedule = () => {
//   const queryClient = useQueryClient();
//   return useMutation("searchInterviewSchedule",
//     async (data) => searchInterviewSchedule(data),
//     {
//       onSettled: () => {
//         queryClient.invalidateQueries("searchInterviewSchedule");
//       },
//     }
//   );
// };

export const useHandleApproveInterviewSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation(
    "approveInterviewSchedule",
    async (data) => {
      await confirmInterview(data.idEmployee, data.idInterview);
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
  return useMutation(
    "rejectInterviewSchedule",
    async (data) => {
      await rejectInterview(data.idEmployee, data.idInterview);
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
  return useMutation(
    "cancelInterviewSchedule",
    async (data) => {
      await cancelInterview(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("listInterviewSchedule");
      },
    }
  );
};

export const useHandleCloseInterviewSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation(
    "closeInterviewSchedule",
    async (data) => {
      await closeInterview(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("listInterviewSchedule");
      },
    }
  );
};
