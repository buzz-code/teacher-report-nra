import { Module } from '@nestjs/common';
import { BaseEntityModule } from '@shared/base-entity/base-entity.module';

import userConfig from './entity-modules/user.config';
import auditLogConfig from './entity-modules/audit-log.config';
import importFileConfig from './entity-modules/import-file.config';
import pageConfig from './entity-modules/page.config';
import paymentTrackConfig from './entity-modules/payment-track.config';
import mailAddressConfig from '@shared/utils/mail/mail-address.config';
import textConfig from './entity-modules/text.config';

// Event Management System entities
import eventConfig from './entity-modules/event.config';
import eventTypeConfig from './entity-modules/event-type.config';
import eventNoteConfig from './entity-modules/event-note.config';
import giftConfig from './entity-modules/gift.config';
import eventGiftConfig from './entity-modules/event-gift.config';
import classConfig from './entity-modules/class.config';
import studentConfig from './entity-modules/student.config';
import teacherConfig from './entity-modules/teacher.config';
import levelTypeConfig from './entity-modules/level-type.config';
import studentClassConfig from './entity-modules/student-class.config';
import studentByYearConfig from './entity-modules/student-by-year.config';

// Teacher Report System entities
import { TeacherType } from './db/entities/TeacherType.entity';
import { AttReport } from './db/entities/AttReport.entity';
import { AttType } from './db/entities/AttType.entity';
import { Price } from './db/entities/Price.entity';
import { Question } from './db/entities/Question.entity';
import { QuestionType } from './db/entities/QuestionType.entity';
import { Answer } from './db/entities/Answer.entity';
import { WorkingDate } from './db/entities/WorkingDate.entity';
import { SalaryReport } from './db/entities/SalaryReport.entity';

// Teacher-Type Specific Report Views
import seminarKitaReportsConfig from './entity-modules/seminar-kita-reports.config';
import manhaReportsConfig from './entity-modules/manha-reports.config';
import pdsReportsConfig from './entity-modules/pds-reports.config';
import specialEducationReportsConfig from './entity-modules/special-education-reports.config';
import kindergartenReportsConfig from './entity-modules/kindergarten-reports.config';
import totalMonthlyReportsConfig from './entity-modules/total-monthly-reports.config';

// Shared entities
import { YemotCall } from '@shared/entities/YemotCall.entity';
import { TextByUser } from '@shared/view-entities/TextByUser.entity';
import { RecievedMail } from '@shared/entities/RecievedMail.entity';
import { Image } from '@shared/entities/Image.entity';

@Module({
  imports: [
    BaseEntityModule.register(userConfig),

    // Event Management System entities
    BaseEntityModule.register(eventConfig),
    BaseEntityModule.register(eventTypeConfig),
    BaseEntityModule.register(eventNoteConfig),
    BaseEntityModule.register(giftConfig),
    BaseEntityModule.register(eventGiftConfig),
    BaseEntityModule.register(classConfig),
    BaseEntityModule.register(studentConfig),
    BaseEntityModule.register(teacherConfig),
    BaseEntityModule.register(levelTypeConfig),
    BaseEntityModule.register(studentClassConfig),
    BaseEntityModule.register(studentByYearConfig),

    // Teacher Report System entities
    BaseEntityModule.register({ entity: TeacherType }),
    BaseEntityModule.register({ entity: AttReport }),
    BaseEntityModule.register({ entity: AttType }),
    BaseEntityModule.register({ entity: Price }),
    BaseEntityModule.register({ entity: Question }),
    BaseEntityModule.register({ entity: QuestionType }),
    BaseEntityModule.register({ entity: Answer }),
    BaseEntityModule.register({ entity: WorkingDate }),
    BaseEntityModule.register({ entity: SalaryReport }),

    // Teacher-Type Specific Report Views
    BaseEntityModule.register(seminarKitaReportsConfig),
    BaseEntityModule.register(manhaReportsConfig),
    BaseEntityModule.register(pdsReportsConfig),
    BaseEntityModule.register(specialEducationReportsConfig),
    BaseEntityModule.register(kindergartenReportsConfig),
    BaseEntityModule.register(totalMonthlyReportsConfig),

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
