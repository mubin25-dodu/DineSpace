import { PartialType } from "@nestjs/mapped-types";
import { FeedbackDTO } from "./Feedback.DTO";

export class PartialFeedbackDTO extends PartialType(FeedbackDTO) {}