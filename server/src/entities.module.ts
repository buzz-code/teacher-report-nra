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
import studentConfig from './entity-modules/student.config';
import teacherConfig from './entity-modules/teacher.config';

// Teacher Report System entities
import { TeacherType } from './db/entities/TeacherType.entity';
import attReportConfig from './entity-modules/att-report.config';
import { AttType } from './db/entities/AttType.entity';
import { Price } from './db/entities/Price.entity';
import { Question } from './db/entities/Question.entity';
import { QuestionType } from './db/entities/QuestionType.entity';
import { Answer } from './db/entities/Answer.entity';
import { WorkingDate } from './db/entities/WorkingDate.entity';
import { SalaryReport } from './db/entities/SalaryReport.entity';

// Shared entities
import { YemotCall } from '@shared/entities/YemotCall.entity';
import { TextByUser } from '@shared/view-entities/TextByUser.entity';
import { RecievedMail } from '@shared/entities/RecievedMail.entity';
import { Image } from '@shared/entities/Image.entity';

@Module({
  imports: [
    BaseEntityModule.register(userConfig),

    // Shared entities used by teacher report system
    BaseEntityModule.register(studentConfig),
    BaseEntityModule.register(teacherConfig),

    // Teacher Report System entities
    BaseEntityModule.register({ entity: TeacherType }),
    BaseEntityModule.register(attReportConfig),
    BaseEntityModule.register({ entity: AttType }),
    BaseEntityModule.register({ entity: Price }),
    BaseEntityModule.register({ entity: Question }),
    BaseEntityModule.register({ entity: QuestionType }),
    BaseEntityModule.register({ entity: Answer }),
    BaseEntityModule.register({ entity: WorkingDate }),
    BaseEntityModule.register({ entity: SalaryReport }),

    // Common entities and utilities
    BaseEntityModule.register(textConfig),
    BaseEntityModule.register(auditLogConfig),
    BaseEntityModule.register(importFileConfig),
    BaseEntityModule.register({ entity: YemotCall }),
    BaseEntityModule.register(mailAddressConfig),
    BaseEntityModule.register({ entity: RecievedMail }),
    BaseEntityModule.register(pageConfig),
    BaseEntityModule.register({ entity: TextByUser }),
    BaseEntityModule.register({ entity: Image }),
    BaseEntityModule.register(paymentTrackConfig),
  ],
})
export class EntitiesModule {}
