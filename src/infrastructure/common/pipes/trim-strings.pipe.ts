import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

const excludeKeys = ['password', 'old_password', 'new_password'];

@Injectable()
export class TrimStringsPipe implements PipeTransform<any> {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      return this.transformObject(value);
    }
    return value;
  }

  private transformObject(obj: any): any {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'string' && !excludeKeys.includes(key)) {
          obj[key] = obj[key].trim();
        } else if (typeof obj[key] === 'object') {
          obj[key] = this.transformObject(obj[key]);
        }
      });
    }
    return obj;
  }
}
