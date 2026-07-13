import { Controller } from '@nestjs/common';
import { ResturantService } from './resturant.service';

@Controller('resturant')
export class ResturantController {
  constructor(private readonly resturantService: ResturantService) {}
}
