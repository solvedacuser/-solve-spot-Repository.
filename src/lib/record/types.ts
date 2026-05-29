import type { z } from "zod";
import type {
  createFeedbackRequestSchema,
  createdTeamRowSchema,
  createRecordTeamRequestSchema,
  createRecordRequestSchema,
  feedbackContributionRowSchema,
  feedbackCommentDtoSchema,
  feedbackCommentRowSchema,
  recordInsightRecordRowSchema,
  recordInsightsQuerySchema,
  recordInsightsResponseSchema,
  listRecordsQuerySchema,
  listRecordsResponseSchema,
  profileRowSchema,
  recordDetailResponseSchema,
  recordDtoSchema,
  recordRowSchema,
  recordTeamDtoSchema,
  recordTeamRowSchema,
  teamMembershipRowSchema,
} from "@/lib/record/schemas";

export type CreateRecordRequest = z.infer<typeof createRecordRequestSchema>;
export type ListRecordsQuery = z.infer<typeof listRecordsQuerySchema>;
export type RecordInsightsQuery = z.infer<typeof recordInsightsQuerySchema>;
export type CreateFeedbackRequest = z.infer<typeof createFeedbackRequestSchema>;
export type CreateRecordTeamRequest = z.infer<typeof createRecordTeamRequestSchema>;

export type RecordDto = z.infer<typeof recordDtoSchema>;
export type RecordTeamDto = z.infer<typeof recordTeamDtoSchema>;
export type FeedbackCommentDto = z.infer<typeof feedbackCommentDtoSchema>;
export type ListRecordsResponse = z.infer<typeof listRecordsResponseSchema>;
export type RecordDetailResponse = z.infer<typeof recordDetailResponseSchema>;
export type RecordInsightsResponse = z.infer<typeof recordInsightsResponseSchema>;

export type RecordRow = z.infer<typeof recordRowSchema>;
export type RecordInsightRecordRow = z.infer<typeof recordInsightRecordRowSchema>;
export type CreatedTeamRow = z.infer<typeof createdTeamRowSchema>;
export type RecordTeamRow = z.infer<typeof recordTeamRowSchema>;
export type TeamMembershipRow = z.infer<typeof teamMembershipRowSchema>;
export type FeedbackContributionRow = z.infer<typeof feedbackContributionRowSchema>;
export type FeedbackCommentRow = z.infer<typeof feedbackCommentRowSchema>;
export type ProfileRow = z.infer<typeof profileRowSchema>;

export type RecordAppErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export type RecordApiErrorPayload = {
  code: RecordAppErrorCode;
  message: string;
  status: number;
};
