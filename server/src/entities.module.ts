import { Module } from '@nestjs/common';
import { BaseEntityModule } from '@shared/base-entity/base-entity.module';

import userConfig from './entity-modules/user.config';
import auditLogConfig from './entity-modules/audit-log.config';
import importFileConfig from './entity-modules/import-file.config';
import pageConfig from './entity-modules/page.config';
import paymentTrackConfig from './entity-modules/payment-track.config';
import mailAddressConfig from '@shared/utils/mail/mail-address.config';
import textConfig from './entity-modules/text.config';

// Shared entities used by teacher report system
import studentGroupConfig from './entity-modules/student-group.config';
import teacherConfig from './entity-modules/teacher.config';
import teacherQuestionConfig from './entity-modules/teacher-question.config';

// Teacher Report System entities
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

// Shared entities
import { YemotCall } from '@shared/entities/YemotCall.entity';
import { TextByUser } from '@shared/view-entities/TextByUser.entity';
import { RecievedMail } from '@shared/entities/RecievedMail.entity';
import { Image } from '@shared/entities/Image.entity';

// View entities
import { PriceByUser } from './db/view-entities/PriceByUser.entity';
import { UserPricePivot } from './db/view-entities/UserPricePivot.entity';
import attReportWithPriceConfig from './entity-modules/att-report-with-price.config';

@Module({
  imports: [
    BaseEntityModule.register(userConfig),

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

    // Common entities and utilities
    BaseEntityModule.register(textConfig),
    BaseEntityModule.register(auditLogConfig),
    BaseEntityModule.register(importFileConfig),
    BaseEntityModule.register({ entity: YemotCall }),
    BaseEntityModule.register(mailAddressConfig),
    BaseEntityModule.register({ entity: RecievedMail }),
    BaseEntityModule.register(pageConfig),
    BaseEntityModule.register({ entity: TextByUser }),
    BaseEntityModule.register({ entity: PriceByUser }),
    BaseEntityModule.register({ entity: UserPricePivot }),
    BaseEntityModule.register(attReportWithPriceConfig),
    BaseEntityModule.register({ entity: Image }),
    BaseEntityModule.register(paymentTrackConfig),
  ],
})
export class EntitiesModule {}
