import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { createResponseSchema } from '../utils/wrapper';
import { selectCompanySchema } from '../drizzle/schema';
import { createZodDto } from 'nestjs-zod';

const singleCompanyResponseSchema = createZodDto(
  createResponseSchema(selectCompanySchema),
);

@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('perusahaan')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @ApiCreatedResponse({
    type: singleCompanyResponseSchema,
  })
  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    const res = await this.companiesService.create(createCompanyDto);
    return res[0];
  }

  @ApiOkResponse({
    type: createZodDto(createResponseSchema(selectCompanySchema.array())),
  })
  @Get()
  findAll(@Query('q') q?: string) {
    return this.companiesService.findAll(q);
  }

  @Get(':id')
  @ApiResponse({
    type: singleCompanyResponseSchema,
  })
  async findOne(@Param('id') id: string) {
    await this.companiesService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ type: singleCompanyResponseSchema })
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    const company = await this.companiesService.update(id, updateCompanyDto);
    return company[0];
  }

  @Delete(':id')
  @ApiResponse({ type: singleCompanyResponseSchema })
  async remove(@Param('id') id: string) {
    const company = await this.companiesService.remove(id);
    return company[0];
  }
}
