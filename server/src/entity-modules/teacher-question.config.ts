import { BaseEntityModuleOptions } from '@shared/base-entity/interface';
import { TeacherQuestion } from '../db/entities/TeacherQuestion.entity';

function getConfig(): BaseEntityModuleOptions {
  return {
    entity: TeacherQuestion,
    query: {
      join: {
        user: { eager: false },
        teacher: { eager: false },
        question: { eager: false },
        answer: { eager: false },
      },
    },
  };
}

export default getConfig();
