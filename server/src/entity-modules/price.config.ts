import { BaseEntityModuleOptions } from '@shared/base-entity/interface';
import { IHeader } from '@shared/utils/exporter/types';
import { Price } from '../db/entities/Price.entity';

function getConfig(): BaseEntityModuleOptions {
  return {
    entity: Price,
    exporter: {
      getExportHeaders(): IHeader[] {
        return [
          { value: 'code', label: 'מזהה' },
          { value: 'description', label: 'תיאור' },
          { value: 'price', label: 'מחיר' },
        ];
      },
    },
  };
}

export default getConfig();
