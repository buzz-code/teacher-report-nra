import { CrudRequest } from '@dataui/crud';
import { getUserIdFromUser } from '@shared/auth/auth.util';
import { CrudAuthCustomFilter, getUserIdFilter } from '@shared/auth/crud-auth.filter';
import { BaseEntityModuleOptions, Entity } from '@shared/base-entity/interface';
import { BaseEntityService } from '@shared/base-entity/base-entity.service';
import { IHeader } from '@shared/utils/exporter/types';
import { Teacher } from 'src/db/entities/Teacher.entity';
import { TeacherQuestion } from '../db/entities/TeacherQuestion.entity';
import { Question } from '../db/entities/Question.entity';
import { BadRequestException } from '@nestjs/common';

function getConfig(): BaseEntityModuleOptions {
  return {
    entity: Teacher,
    service: TeacherService,
    crudAuth: CrudAuthCustomFilter((user) => {
      const userFilter: Partial<Teacher> = getUserIdFilter(user);
      if (user.permissions?.teacher) {
        userFilter.ownUserId = user.id;
      }
      return userFilter;
    }),
    query: {
      join: {
        user: { eager: false },
        ownUser: { eager: false },
        events: { eager: false },
      },
    },
    exporter: {
      processReqForExport(req: CrudRequest, innerFunc) {
        req.options.query.join = {
          user: { eager: true },
          ownUser: { eager: true },
        };
        return innerFunc(req);
      },
      getExportHeaders(): IHeader[] {
        return [
          { value: 'tz', label: 'ת.ז.' },
          { value: 'name', label: 'שם' },
          { value: 'ownUser.email', label: 'כתובת מייל' },
          { value: 'ownUser.username', label: 'שם משתמש' },
        ];
      },
    },
  };
}

class TeacherService<T extends Entity | Teacher> extends BaseEntityService<T> {
  async doAction(req: CrudRequest, body: any): Promise<any> {
    const extra = req.parsed.extra as any;
    const userId = getUserIdFromUser(req.auth);

    switch (extra?.action) {
      case 'bulkAssignQuestion':
        return this.bulkAssignQuestion(userId, extra);
      default:
        return super.doAction(req, body);
    }
  }

  private async bulkAssignQuestion(userId: number, extra: any): Promise<any> {
    const { questionId } = extra;
    const ids = extra.ids.toString().split(',').map(Number).filter(Boolean);

    if (!questionId) {
      throw new BadRequestException('questionId is required');
    }

    if (!ids || ids.length === 0) {
      throw new BadRequestException('No teachers selected');
    }

    const questionRepository = this.dataSource.getRepository(Question);
    const teacherQuestionRepository = this.dataSource.getRepository(TeacherQuestion);

    // Verify question exists
    const question = await questionRepository.findOne({
      where: { id: questionId },
    });

    if (!question) {
      throw new BadRequestException(`Question with id ${questionId} not found`);
    }

    // Create assignments for each teacher
    const assignments = ids.map((teacherId) => ({
      userId,
      teacherReferenceId: teacherId,
      questionReferenceId: questionId,
      answerReferenceId: null, // Initially unanswered
    }));

    // Bulk insert
    const result = await teacherQuestionRepository.save(assignments);

    return {
      success: true,
      message: `Successfully assigned question to ${result.length} teacher(s)`,
      count: result.length,
    };
  }
}

export default getConfig();
