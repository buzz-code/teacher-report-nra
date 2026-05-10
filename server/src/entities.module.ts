import { Module } from '@nestjs/common';
import { BaseEntityModule } from '@shared/base-entity/base-entity.module';
import { createSharedEntitiesImports } from '@shared/entities/createSharedEntitiesImports';

import userConfig from './entity-modules/user.config';

// Shared entities used by teacher report system
import studentGroupConfig from './entity-modules/student-group.config';
import teacherConfig from './entity-modules/teacher.config';
import teacherQuestionConfig from './entity-modules/teacher-question.config';

// Teacher Report System entities
import { Teacher } from './db/entities/Teacher.entity';
import { StudentGroup } from './db/entities/StudentGroup.entity';
import { TeacherType } from './db/entities/TeacherType.entity';
import attReportConfig from './entity-modules/att-report.config';
import priceConfig from './entity-modules/price.config';
import salaryReportConfig from './entity-modules/salary-report.config';
import { AttType } from './db/entities/AttType.entity';
import { Question } from './db/entities/Question.entity';
import { QuestionType } from './db/entities/QuestionType.entity';
import { Answer } from './db/entities/Answer.entity';
import { WorkingDate } from './db/entities/WorkingDate.entity';
import reportableItemConfig from './entity-modules/reportable-item.config';
import salaryReportByTeacherConfig from './entity-modules/salary-report-by-teacher.config';

// View entities
import { PriceByUser } from './db/view-entities/PriceByUser.entity';
import { UserPricePivot } from './db/view-entities/UserPricePivot.entity';
import attReportWithPriceConfig from './entity-modules/att-report-with-price.config';
import { AnswerWithPrice } from './db/view-entities/AnswerWithPrice.entity';
import reportableItemWithPriceConfig from './entity-modules/reportable-item-with-price.config';
import { createAuditLogConfig } from '@shared/entities/configs/audit-log.config';

@Module({
  imports: [
    ...createSharedEntitiesImports(userConfig),

    // Shared entities used by teacher report system
    BaseEntityModule.register(studentGroupConfig),
    BaseEntityModule.register(teacherConfig),
    BaseEntityModule.register(teacherQuestionConfig),

    // Teacher Report System entities
    BaseEntityModule.register({ entity: TeacherType }),
    BaseEntityModule.register(attReportConfig),
    BaseEntityModule.register({ entity: AttType }),
    BaseEntityModule.register(priceConfig),
    BaseEntityModule.register({ entity: Question }),
    BaseEntityModule.register({ entity: QuestionType }),
    BaseEntityModule.register({ entity: Answer }),
    BaseEntityModule.register({ entity: WorkingDate }),
    BaseEntityModule.register(salaryReportConfig),
    BaseEntityModule.register(reportableItemConfig),
    BaseEntityModule.register(salaryReportByTeacherConfig),

    // View entities
    BaseEntityModule.register(createAuditLogConfig({
      teacher: Teacher,
      student_group: StudentGroup,
    })),
    BaseEntityModule.register({ entity: PriceByUser }),
    BaseEntityModule.register({ entity: UserPricePivot }),
    BaseEntityModule.register(attReportWithPriceConfig),
    BaseEntityModule.register({ entity: AnswerWithPrice }),
    BaseEntityModule.register(reportableItemWithPriceConfig),
  ],
})
export class EntitiesModule {}
