import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './Entity/Announcement.entity';
import { CreateAnnouncementDto } from './DTO/create-announcement.dto';
import { UpdateAnnouncementDto } from './DTO/update-announcement.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
  ) {}

  // Create Announcement
  async create(
    createAnnouncementDto: CreateAnnouncementDto,
  ): Promise<Announcement> {
    const announcement = this.announcementRepository.create(
      createAnnouncementDto,
    );
    return await this.announcementRepository.save(announcement);
  }

  // Get All Announcements
  async findAll(): Promise<Announcement[]> {
    return await this.announcementRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // Get Announcement By ID
  async findOne(id: number): Promise<Announcement> {
    const announcement = await this.announcementRepository.findOne({
      where: { id },
    });

    if (!announcement) {
      throw new NotFoundException(
        `Announcement with ID ${id} not found`,
      );
    }

    return announcement;
  }

  // Update Announcement
  async update(
    id: number,
    updateAnnouncementDto: UpdateAnnouncementDto,
  ): Promise<Announcement> {
    const announcement = await this.findOne(id);

    Object.assign(announcement, updateAnnouncementDto);

    return await this.announcementRepository.save(announcement);
  }

  // Delete Announcement
  async remove(id: number): Promise<{ message: string }> {
    const announcement = await this.findOne(id);

    await this.announcementRepository.remove(announcement);

    return {
      message: 'Announcement deleted successfully',
    };
  }
}