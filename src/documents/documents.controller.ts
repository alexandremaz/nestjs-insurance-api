import { Controller, Delete, Param, Query } from '@nestjs/common';
import { DocumentQueryParamsDto, DocumentResponseDto } from './documents.dto';
import { ZodSerializerDto } from 'nestjs-zod';

/**
 * Feel free to change the order of the method, to check if router order declaration has any impact here
 */

@Controller('/api')
@ZodSerializerDto(DocumentResponseDto)
export class DocumentsController {
  @Delete('/documents')
  deleteDocumentByOriginIdWithQueryParams(
    @Query() { origin, originId }: DocumentQueryParamsDto,
  ) {
    console.log('delete document by origin/originId with query params', {
      origin,
      originId,
    });

    return {
      message: 'deleteDocumentByOriginIdWithQueryParams',
    };
  }

  @Delete('/documents/origin/:origin/originId/:originId')
  deleteDocumentByOriginIdWithRouteParams(
    @Param('origin') origin: string,
    @Param('originId') originId: string,
  ) {
    console.log('delete document by origin/originId with two route params', {
      origin,
      originId,
    });

    return {
      message: 'deleteDocumentByOriginIdWithRouteParams',
    };
  }

  @Delete('/documents/:id')
  deleteDocumentById(@Param('id') id: string) {
    console.log('delete document by id with one id route param', id);

    return {
      message: 'deleteDocumentById',
    };
  }
}
