import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { createResponseSchema } from '../utils/wrapper';
import { selectItemSchema } from '../drizzle/schema';
import { Public } from '../auth/constants';

const singleItemResponseSchema = createZodDto(
  createResponseSchema(selectItemSchema),
);
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('barang')
@Controller('barang')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @ApiCreatedResponse({
    type: singleItemResponseSchema,
  })
  @Post()
  async create(@Body() createItemDto: CreateItemDto) {
    try {
      const res = await this.itemsService.create(createItemDto);
      return res[0];
    } catch (e) {
      if (e instanceof Error && 'code' in e) {
        throw new BadRequestException('unique error or invalid foreign key');
      }

      throw e;
    }
  }

  @ApiOkResponse({
    type: createZodDto(createResponseSchema(selectItemSchema.array())),
  })
  @Get()
  @Public()
  findAll(@Query('q') q?: string, @Query('perusahaan') perusahaan?: string) {
    return this.itemsService.findAll(q, perusahaan);
  }

  @Get(':id')
  @ApiResponse({ type: singleItemResponseSchema })
  @Public()
  async findOne(@Param('id') id: string) {
    const item = await this.itemsService.findOne(id);

    if (item === null) {
      throw new BadRequestException('not found');
    }

    return item;
  }

  @Put(':id')
  @ApiResponse({ type: singleItemResponseSchema })
  @Public()
  async update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    try {
      const items = await this.itemsService.update(id, updateItemDto);

      if (items.length === 0) {
        throw new BadRequestException('not found');
      }

      return items[0];
    } catch (e) {
      if (e instanceof Error && 'code' in e) {
        throw new BadRequestException('unique error or invalid foreign key');
      }

      throw e;
    }
  }

  @Delete(':id')
  @ApiResponse({ type: singleItemResponseSchema })
  async remove(@Param('id') id: string) {
    const items = await this.itemsService.remove(id);

    if (items.length === 0) {
      throw new BadRequestException('not found');
    }

    return items[0];
  }
}
