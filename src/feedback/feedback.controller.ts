import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { FeedbackService } from './feedback.service';
import { FeedbackDTO } from './DTO/Feedback.DTO';
import { PartialFeedbackDTO } from './DTO/partialFeedback.dto';
import { FeedbackQueryDTO } from './DTO/feedbackQuery.dto';

@ApiTags('Feedback')
@ApiBearerAuth('bearerAuth')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiOperation({
    summary: 'Create feedback',
    description: 'Creates customer feedback for an order.',
  })
  @ApiResponse({
    status: 201,
    description: 'Feedback created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request.',
  })
  create(@Body() feedbackDTO: FeedbackDTO) {
    return this.feedbackService.create(feedbackDTO);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all feedback',
    description:
      'Retrieve feedback with optional filtering, searching, sorting, and pagination.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Number of feedback records per page',
  })
  @ApiQuery({
    name: 'rating',
    required: false,
    type: Number,
    example: 5,
    description: 'Filter feedback by rating (1-5)',
  })
  @ApiQuery({
    name: 'comment',
    required: false,
    type: String,
    example: 'good',
    description: 'Search feedback comments',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
    description: 'Sort by creation date',
  })
  @ApiResponse({
    status: 200,
    description: 'Feedback retrieved successfully.',
  })
  findAll(@Query() query: FeedbackQueryDTO) {
    return this.feedbackService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get feedback by ID',
    description: 'Retrieve a single feedback using its UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Feedback UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Feedback found.',
  })
  @ApiResponse({
    status: 404,
    description: 'Feedback not found.',
  })
  findOne(@Param('id') id: string) {
    return this.feedbackService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update feedback',
    description: 'Update an existing feedback.',
  })
  @ApiParam({
    name: 'id',
    description: 'Feedback UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Feedback updated successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Feedback not found.',
  })
  update(
    @Param('id') id: string,
    @Body() feedbackDTO: PartialFeedbackDTO,
  ) {
    return this.feedbackService.update(id, feedbackDTO);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete feedback',
    description: 'Delete feedback by UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Feedback UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Feedback deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Feedback not found.',
  })
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(id);
  }
}