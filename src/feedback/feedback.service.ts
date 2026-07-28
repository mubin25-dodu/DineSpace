import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Feedback } from './Entity/Feedback.entity';
import { FeedbackDTO } from './DTO/Feedback.DTO';
import { PartialFeedbackDTO } from './DTO/partialFeedback.dto';
import { FeedbackQueryDTO } from './DTO/feedbackQuery.dto';

@Injectable()
export class FeedbackService {

    constructor(
        @InjectRepository(Feedback)
        private readonly feedbackRepository: Repository<Feedback>,
    ) {}

    async create(feedbackDTO: FeedbackDTO): Promise<Feedback> {
        const feedback = this.feedbackRepository.create(feedbackDTO);
        return await this.feedbackRepository.save(feedback);
    }

    async findAll(query: FeedbackQueryDTO): Promise<Feedback[]> {

    const {
        page = 1,
        limit = 10,
        rating,
        sort = 'desc',
        comment,
    } = query;

    const queryBuilder = this.feedbackRepository.createQueryBuilder('feedback');

    // Filter by rating
    if (rating) {
        queryBuilder.andWhere('feedback.rating = :rating', { rating });
    }

    // Search comment
    if (comment) {
        queryBuilder.andWhere(
            'LOWER(feedback.comment) LIKE LOWER(:comment)',
            {
                comment: `%${comment}%`,
            },
        );
    }

    // Sorting
    queryBuilder.orderBy('feedback.createdAt', sort.toUpperCase() as 'ASC' | 'DESC');

    // Pagination
    queryBuilder.skip((page - 1) * limit);
    queryBuilder.take(limit);

    return await queryBuilder.getMany();
}

    async findOne(id: string): Promise<Feedback> {
        const feedback = await this.feedbackRepository.findOne({
            where: { id },
        });

        if (!feedback) {
            throw new NotFoundException("Feedback not found");
        }

        return feedback;
    }

    async update(id: string, feedbackDTO: PartialFeedbackDTO): Promise<Feedback> {
        const feedback = await this.findOne(id);

        Object.assign(feedback, feedbackDTO);

        return await this.feedbackRepository.save(feedback);
    }

    async remove(id: string): Promise<{ message: string }> {
        const feedback = await this.findOne(id);

        await this.feedbackRepository.remove(feedback);

        return {
            message: "Feedback deleted successfully",
        };
    }

}