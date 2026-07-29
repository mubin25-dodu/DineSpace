import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateAnnouncementDto } from './DTO/create-announcement.dto';
import { UpdateAnnouncementDto } from './DTO/update-announcement.dto';

@ApiTags('Admin Announcement Management')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('announcement')
  @ApiOperation({ summary: 'Create a new announcement' })
  @ApiBody({ type: CreateAnnouncementDto })
  @ApiResponse({
    status: 201,
    description: 'Announcement created successfully.',
  })
  create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.adminService.create(createAnnouncementDto);
  }

  @Get('announcement')
  @ApiOperation({ summary: 'Get all announcements' })
  @ApiResponse({
    status: 200,
    description: 'List of all announcements.',
  })
  findAll() {
    return this.adminService.findAll();
  }

  @Get('announcement/:id')
  @ApiOperation({ summary: 'Get announcement by ID' })
  @ApiResponse({
    status: 200,
    description: 'Announcement found.',
  })
  @ApiResponse({
    status: 404,
    description: 'Announcement not found.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.findOne(id);
  }

  @Patch('announcement/:id')
  @ApiOperation({ summary: 'Update announcement' })
  @ApiBody({ type: UpdateAnnouncementDto })
  @ApiResponse({
    status: 200,
    description: 'Announcement updated successfully.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ) {
    return this.adminService.update(id, updateAnnouncementDto);
  }

  @Delete('announcement/:id')
  @ApiOperation({ summary: 'Delete announcement' })
  @ApiResponse({
    status: 200,
    description: 'Announcement deleted successfully.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.remove(id);
  }
}