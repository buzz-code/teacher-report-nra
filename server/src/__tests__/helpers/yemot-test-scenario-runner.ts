/**
 * Yemot Test Scenario Runner
 *
 * This module executes test scenarios defined in the scenario format.
 * It orchestrates the mock setup, step execution, and validation.
 *
 * This extends the generic Yemot testing framework with project-specific
 * entity mocking and service execution logic.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { Call } from 'yemot-router2';
import { GenericScenarioRunner } from '@shared/utils/yemot/testing/yemot-test-framework-runner';
import { RepositoryMockBuilder } from '@shared/utils/testing/repository-mock-builder';
import { YemotHandlerService } from '../../yemot-handler.service';
import { TestScenario, TestContext, DatabaseSetup, ScenarioStep } from './yemot-test-scenario.types';
import { User } from '@shared/entities/User.entity';
import { Teacher } from '../../db/entities/Teacher.entity';
import { TeacherType } from '../../db/entities/TeacherType.entity';
import { AttReport } from '../../db/entities/AttReport.entity';
import { Question } from '../../db/entities/Question.entity';
import { Answer } from '../../db/entities/Answer.entity';
import { WorkingDate } from '../../db/entities/WorkingDate.entity';
import { TeacherQuestion } from '../../db/entities/TeacherQuestion.entity';
import { TextByUser } from '@shared/view-entities/TextByUser.entity';

/**
 * Main test scenario runner (extends generic with project-specific logic)
 */
export class YemotTestScenarioRunner extends GenericScenarioRunner<TestScenario, TestContext, DatabaseSetup> {
  constructor() {
    super(YemotHandlerService);
  }

  /**
   * Define repositories - super simple with builder!
   */
  protected defineRepositories(builder: RepositoryMockBuilder<DatabaseSetup, TestContext>): any {
    const getCurrentSetup = () => this.currentSetup;

    return {
      user: builder.standard(User),
      // TeacherType - nested in setup.teacher.teacherType
      teacherType: builder.custom(TeacherType, {
        findOne: jest.fn().mockImplementation(() => {
          const setup = getCurrentSetup();
          return Promise.resolve(setup.teacher.teacherType);
        }),
      }),
      question: builder.standard(Question),
      teacherQuestion: builder.custom(TeacherQuestion, {
        find: jest.fn().mockImplementation((options) => {
          const setup = getCurrentSetup();
          if (setup.teacherQuestions && options?.where) {
            // Filter by where conditions
            return Promise.resolve(
              setup.teacherQuestions
                .filter((tq) => {
                  // Match userId if specified
                  if (options.where.userId && tq.userId !== options.where.userId) return false;
                  // Match teacherReferenceId if specified
                  if (options.where.teacherReferenceId && tq.teacherReferenceId !== options.where.teacherReferenceId)
                    return false;
                  // Match answerReferenceId: IsNull() means null or undefined
                  if (
                    options.where.answerReferenceId &&
                    typeof options.where.answerReferenceId === 'object' &&
                    tq.answerReferenceId != null
                  )
                    return false;
                  return true;
                })
                .map((tq) => {
                  // If relations include 'question', attach it from setup.questions
                  if (options.relations?.includes('question') && setup.questions) {
                    const question = setup.questions.find((q) => q.id === tq.questionReferenceId);
                    return { ...tq, question };
                  }
                  return tq;
                }),
            );
          }
          return Promise.resolve([]);
        }),
        update: jest.fn().mockResolvedValue(undefined),
        createQueryBuilder: jest.fn().mockImplementation(() => {
          const setup = getCurrentSetup();
          // Return the teacherQuestions from setup with questions attached
          const dataArray = setup.teacherQuestions
            ? setup.teacherQuestions.map((tq) => {
                const question = setup.questions?.find((q) => q.id === tq.questionReferenceId);
                return { ...tq, question };
              })
            : [];

          return {
            innerJoinAndSelect: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            orWhere: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue(dataArray),
            getOne: jest.fn().mockResolvedValue(dataArray[0] || null),
          };
        }),
      }),

      // With save tracking - uses setup.savedAttReports and setup.savedAnswers
      attReport: builder.withSaveTracking(AttReport),
      answer: builder.withSaveTracking(Answer),

      // Custom behavior
      teacher: builder.custom(Teacher, {
        findOne: jest.fn((options) => {
          const setup = getCurrentSetup();
          if (options?.where?.userId === setup.teacher.userId) {
            return Promise.resolve(setup.teacher);
          }
          // For MANHA teacher lookup by phone last 4 digits
          if (options?.where?.phone && setup.otherTeachers) {
            const phone = options.where.phone;
            return Promise.resolve(setup.otherTeachers.find((t) => t.phone && phone.test && phone.test(t.phone)));
          }
          return Promise.resolve(null);
        }),
        find: jest.fn().mockImplementation((options) => {
          const setup = getCurrentSetup();
          if (setup.otherTeachers) {
            return Promise.resolve(setup.otherTeachers);
          }
          return Promise.resolve([]);
        }),
      }),

      workingDate: builder.custom(WorkingDate, {
        findOne: jest.fn((options) => {
          const setup = getCurrentSetup();
          const requestedDate = options?.where?.workingDate;
          if (setup.workingDates && requestedDate) {
            return Promise.resolve(
              setup.workingDates.find((wd) => {
                const wdDate = new Date(wd.date);
                const reqDate = new Date(requestedDate);
                return wdDate.toDateString() === reqDate.toDateString();
              }) || null,
            );
          }
          return Promise.resolve(null);
        }),
      }),

      textByUser: builder.custom(TextByUser, {
        findOne: jest.fn((options) => {
          const setup = getCurrentSetup();
          const textKey = options?.where?.name;
          if (setup.texts) {
            const text = setup.texts.find((t) => t.name === textKey);
            if (text) return Promise.resolve(text);
          }
          // Return key as default
          return Promise.resolve({ value: textKey, filepath: null });
        }),
      }),
    };
  }

  /**
   * Create mock call - override to set project-specific phone/did from setup
   */
  protected createMockCall(setup: DatabaseSetup): Call {
    return {
      ...super.createMockCall(setup),
      did: setup.user.phoneNumber,
      phone: setup.teacher.phone,
      ApiPhone: setup.teacher.phone,
    };
  }

  /**
   * Validate results - calls parent for common validation then adds entity-specific validation
   */
  protected async validateResults(scenario: TestScenario): Promise<void> {
    // Call parent for common validation
    await super.validateResults(scenario);

    const { expectedResult } = scenario;

    // Validate saved report
    if (expectedResult.savedReport) {
      expect(this.context.setup.savedAttReports.length).toBeGreaterThan(0);
      const savedReport = this.context.setup.savedAttReports[0];
      expect(savedReport).toMatchObject(expectedResult.savedReport);
    }

    // Validate saved answers
    if (expectedResult.savedAnswers) {
      expect(this.context.setup.savedAnswers).toBeDefined();
      expect(this.context.setup.savedAnswers?.length).toBeGreaterThan(0);
      // Use toMatchObject to allow partial matching (ignores id, reportDate, etc.)
      expectedResult.savedAnswers.forEach((expectedAnswer, index) => {
        expect(this.context.setup.savedAnswers[index]).toMatchObject(expectedAnswer);
      });
    }
  }
}

/**
 * Helper function to run a scenario in a test
 */
export async function runScenario(scenario: TestScenario): Promise<TestContext> {
  const runner = new YemotTestScenarioRunner();
  return await runner.runScenario(scenario);
}
