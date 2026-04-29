import { StudentGroup } from 'src/db/entities/StudentGroup.entity';
import { createEntityConfigTests } from '@shared/utils/testing/entity-config-tester';
import config from '../student-group.config';

createEntityConfigTests('StudentGroupConfig', config, {
  entity: StudentGroup,
  expectedJoins: {
    teacher: { eager: false },
  },
  expectedExportJoins: {
    teacher: { eager: true },
  },
  expectedExportHeaders: {
    count: 6,
    first: { value: 'teacherTz', label: 'ת.ז. מורה' },
  },
});
