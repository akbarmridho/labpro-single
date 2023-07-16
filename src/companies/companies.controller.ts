import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  BadRequestException,
  Put,
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
  ApiTags,
} from '@nestjs/swagger';
import { createResponseSchema } from '../utils/wrapper';
import { selectCompanySchema } from '../drizzle/schema';
import { createZodDto } from 'nestjs-zod';

class SingleCompanyResponseDto extends createZodDto(
  createResponseSchema(selectCompanySchema),
) {}

class ManyCompanyResponseDto extends createZodDto(
  createResponseSchema(selectCompanySchema.array()),
) {}

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('perusahaan')
@Controller('perusahaan')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @ApiCreatedResponse({
    type: SingleCompanyResponseDto,
  })
  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    try {
      const res = await this.companiesService.create(createCompanyDto);

      return res[0];
    } catch (e) {
      if (e instanceof Error && 'code' in e && e.code === '23505') {
        throw new BadRequestException('unique error');
      }

      throw e;
    }
  }

  @ApiOkResponse({
    type: ManyCompanyResponseDto,
  })
  @Get()
  findAll(@Query('q') q?: string) {
    return this.companiesService.findAll(q);
  }

  @Get(':id')
  @ApiResponse({
    type: SingleCompanyResponseDto,
  })
  async findOne(@Param('id') id: string) {
    const company = await this.companiesService.findOne(id);

    if (company === null) {
      throw new BadRequestException('not found');
    }

    return company;
  }

  @Put(':id')
  @ApiResponse({ type: SingleCompanyResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    try {
      const company = await this.companiesService.update(id, updateCompanyDto);

      if (company.length === 0) {
        throw new BadRequestException('not found');
      }

      return company[0];
    } catch (e) {
      if (e instanceof Error && 'code' in e && e.code === '23505') {
        throw new BadRequestException('unique error');
      }

      throw e;
    }
  }

  @Delete(':id')
  @ApiResponse({ type: SingleCompanyResponseDto })
  async remove(@Param('id') id: string) {
    const company = await this.companiesService.remove(id);

    if (company.length === 0) {
      throw new BadRequestException('not found');
    }

    return company[0];
  }
}
