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
import {
  TestScenario,
  TestContext,
  DatabaseSetup,
  ScenarioStep,
} from './yemot-test-scenario.types';
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
export class YemotTestScenarioRunner extends GenericScenarioRunner<
  TestScenario,
  TestContext,
  DatabaseSetup
> {
  /**
   * Get setup from scenario
   */
  protected getSetup(scenario: TestScenario): DatabaseSetup {
    return scenario.setup;
  }

  /**
   * Get steps from scenario
   */
  protected getSteps(scenario: TestScenario): ScenarioStep[] {
    return scenario.steps;
  }

  /**
   * Get mock call from context
   */
  protected getMockCall(): any {
    return this.context.call;
  }

  /**
   * Track interaction in context
   */
  protected trackInteraction(interaction: any): void {
    this.context.interactionHistory.push(interaction);
  }

  /**
   * Execute the service being tested
   */
  protected async executeService(): Promise<void> {
    await this.context.service.processCall();
  }

  /**
   * Initialize tracking arrays in setup
   */
  protected initializeTrackingArrays(setup: DatabaseSetup): void {
    setup.savedAttReports = setup.savedAttReports || [];
    setup.savedAnswers = setup.savedAnswers || [];
  }

  /**
   * Build test context - override to set currentSetup for repository callbacks
   */
  protected buildContext(setup: DatabaseSetup, repositories: any, call: any, service: any): TestContext {
    // Store setup for access in repository callbacks
    this.currentSetup = setup;
    // Call parent to build context
    return super.buildContext(setup, repositories, call, service);
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
            return Promise.resolve(
              setup.otherTeachers.find((t) => t.phone && phone.test && phone.test(t.phone)),
            );
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
   * Create mock call object
   */
  protected createMockCall(setup: DatabaseSetup): any {
    return {
      callId: 'test-call-' + Date.now(),
      did: setup.user.phoneNumber,
      phone: setup.teacher.phone,
      ApiPhone: setup.teacher.phone,
      read: jest.fn(),
      id_list_message: jest.fn(),
      hangup: jest.fn(),
    };
  }

  /**
   * Create service instance
   */
  protected createService(dataSource: any, call: any, callTracker: any): any {
    return new YemotHandlerService(dataSource, call as Call, callTracker);
  }

  private currentSetup: DatabaseSetup;

  /**
   * Validate results against expected outcomes
   */
  protected async validateResults(scenario: TestScenario): Promise<void> {
    const { expectedResult } = scenario;

    // Validate call ended
    if (expectedResult.callEnded) {
      expect(this.context.call.hangup).toHaveBeenCalled();
    }

    // Validate saved report
    if (expectedResult.savedReport) {
      expect(this.context.setup.savedAttReports.length).toBeGreaterThan(0);
      const savedReport = this.context.setup.savedAttReports[0];
      expect(savedReport).toMatchObject(expectedResult.savedReport);
    }

    // Validate saved answers
    if (expectedResult.savedAnswers) {
      expect(this.context.setup.savedAnswers).toEqual(
        expect.arrayContaining(expectedResult.savedAnswers),
      );
    }

    // Run custom validation
    if (expectedResult.customValidation) {
      await expectedResult.customValidation(this.context);
    }
  }
}

/**
 * Helper function to create test scenarios more easily
 */
export function createScenario(scenario: TestScenario): TestScenario {
  return scenario;
}

/**
 * Helper function to run a scenario in a test
 */
export async function runScenario(scenario: TestScenario): Promise<TestContext> {
  const runner = new YemotTestScenarioRunner();
  return await runner.runScenario(scenario);
}
