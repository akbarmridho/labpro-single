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
  BadRequestException,
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
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @ApiOkResponse({
    type: createZodDto(createResponseSchema(selectCompanySchema.array())),
  })
  @Get()
  findAll(@Query('q') q?: string) {
    return this.companiesService.findAll(q);
  }

  @Get(':id')
  @ApiCreatedResponse({
    type: singleCompanyResponseSchema,
  })
  async findOne(@Param('id') id: string) {
    const company = await this.companiesService.findOne(id);

    if (company === null) {
      throw new BadRequestException('Company not found');
    }

    return company;
  }

  @Patch(':id')
  @ApiResponse({ type: singleCompanyResponseSchema })
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    const company = await this.companiesService.update(id, updateCompanyDto);

    if (company === null) {
      throw new BadRequestException('Company not found');
    }

    return company;
  }

  @Delete(':id')
  @ApiResponse({ type: singleCompanyResponseSchema })
  async remove(@Param('id') id: string) {
    const deleted = await this.companiesService.findOne(id);

    if (deleted === null) {
      throw new BadRequestException('Company not found');
    }

    await this.companiesService.remove(id);

    return deleted;
  }
}
