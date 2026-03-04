import { Controller, Delete, Param, Query } from '@nestjs/common';
import { DocumentQueryParamsDto } from './documents.dto';

/**
 * Feel free to change the order of the method, to check if router order declaration has any impact here
 */

@Controller('/api')
export class DocumentsController {
  @Delete('/documents')
  deleteDocumentByOriginIdWithQueryParams(
    @Query() { origin, originId }: DocumentQueryParamsDto,
  ) {
    console.log('delete document by origin/originId with query params', {
      origin,
      originId,
    });
  }

  @Delete('/documents/origin/:origin/originId/:originId')
  deleteDocumentByOriginIdWithRouteParams(
    @Param('origin') origin: string,
    @Param('originId') originId: string,
  ) {
    console.log('delete document by origin/originId with route params', {
      origin,
      originId,
    });
  }

  @Delete('/documents/:id')
  deleteDocumentById(@Param('id') id: string) {
    console.log('delete document by id', id);
  }
}
