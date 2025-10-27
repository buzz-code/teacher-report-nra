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
import { Student } from '../../db/entities/Student.entity';
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
      teacherQuestion: builder.standard(TeacherQuestion),

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

      student: builder.custom(Student, {
        findOne: jest.fn((options) => {
          const setup = getCurrentSetup();
          if (setup.students && options?.where?.tz) {
            return Promise.resolve(setup.students.find((s) => s.tz === options.where.tz) || null);
          }
          return Promise.resolve(null);
        }),
        count: jest.fn().mockImplementation(() => {
          const setup = getCurrentSetup();
          return Promise.resolve(setup.students?.length || 0);
        }),
        createQueryBuilder: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getCount: jest.fn().mockImplementation(() => {
            const setup = getCurrentSetup();
            return Promise.resolve(setup.students?.length || 0);
          }),
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
      expect(this.context.setup.savedAnswers).toEqual(expect.arrayContaining(expectedResult.savedAnswers));
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
