import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
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
} from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { createResponseSchema } from '../utils/wrapper';
import { selectItemSchema } from '../drizzle/schema';

const singleItemResponseSchema = createZodDto(
  createResponseSchema(selectItemSchema),
);
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @ApiCreatedResponse({
    type: singleItemResponseSchema,
  })
  @Post()
  async create(@Body() createItemDto: CreateItemDto) {
    const res = await this.itemsService.create(createItemDto);
    return res[0];
  }

  @ApiOkResponse({
    type: createZodDto(createResponseSchema(selectItemSchema.array())),
  })
  @Get()
  findAll(@Query('q') q?: string, @Query('perusahaan') perusahaan?: string) {
    return this.itemsService.findAll(q, perusahaan);
  }

  @Get(':id')
  @ApiResponse({ type: singleItemResponseSchema })
  async findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ type: singleItemResponseSchema })
  async update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    const items = await this.itemsService.update(id, updateItemDto);
    return items[0];
  }

  @Delete(':id')
  @ApiResponse({ type: singleItemResponseSchema })
  async remove(@Param('id') id: string) {
    const items = await this.itemsService.remove(id);
    return items[0];
  }
}
