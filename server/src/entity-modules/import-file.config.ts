import { BaseEntityModuleOptions } from '@shared/base-entity/interface';
import { IContent, IHeader } from '@shared/utils/exporter/types';
import { ImportFile } from '@shared/entities/ImportFile.entity';

const entityNameDictionary = {
  student: 'תלמידות',
  teacher: 'מורות',
  klass: 'כיתות',
  lesson: 'שיעורים',
  att_report: 'דיווחי נוכחות',
  grade: 'ציונים',
};

const successDictionary = {
  true: '✓ הצליח',
  false: '✗ נכשל',
};

function getConfig(): BaseEntityModuleOptions {
  return {
    entity: ImportFile,
    exporter: {
      getExportHeaders(): IHeader<ImportFile | IContent>[] {
        return [
          { value: 'fileName', label: 'שם הקובץ' },
          { value: 'fileSource', label: 'מקור הקובץ' },
          { value: 'entityIds.length', label: 'מספר רשומות' },
          {
            value: (record: ImportFile) => entityNameDictionary[record.entityName] || record.entityName,
            label: 'סוג טבלה',
          },
          {
            value: (record: ImportFile) => successDictionary[record.fullSuccess?.toString()],
            label: 'הצלחה',
          },
          { value: 'response', label: 'תגובה' },
          {
            value: (record: ImportFile) =>
              new Date(record.createdAt).toLocaleString('he-IL', {
                timeZone: 'Asia/Jerusalem',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              }),
            label: 'תאריך יצירה',
          },
        ];
      },
    },
  };
}

export default getConfig();
