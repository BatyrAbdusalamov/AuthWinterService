import { SetMetadata } from '@nestjs/common';
export const Tags = (...tags: string[]) => SetMetadata('tags', tags);
