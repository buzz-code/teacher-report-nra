import { TeacherQuestion } from 'src/db/entities/TeacherQuestion.entity';
import { createEntityConfigTests } from '@shared/utils/testing/entity-config-tester';
import config from '../teacher-question.config';

createEntityConfigTests('TeacherQuestionConfig', config, {
  entity: TeacherQuestion,
  expectedJoins: {
    user: { eager: false },
    teacher: { eager: false },
    question: { eager: false },
    answer: { eager: false },
  },
});
