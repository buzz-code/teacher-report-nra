/**
 * Testing Infrastructure for Yemot Handler Service
 *
 * This module provides a scenario-based testing framework for IVR call flows.
 * It allows defining test scenarios as sequences of interactions between the system and user.
 *
 * This extends the generic Yemot testing framework with project-specific entity definitions.
 */

import {
  MessageMatcher,
  StepType,
  GenericScenarioStep,
  GenericExpectedResult,
  GenericTestContext,
} from '@shared/utils/yemot/testing/yemot-test-framework.types';
import { Call } from 'yemot-router2';
import { YemotHandlerService } from '../../yemot-handler.service';

// Re-export generic types for convenience
export { MessageMatcher, StepType };

/**
 * A single step in the call flow scenario (extends generic with custom validation)
 */
export interface ScenarioStep extends GenericScenarioStep {
  /** Optional custom validation after this step */
  validate?: (context: TestContext) => void | Promise<void>;
}

/**
 * Complete test scenario definition
 */
export interface TestScenario {
  /** Scenario name/description */
  name: string;

  /** Database setup before running scenario */
  setup: DatabaseSetup;

  /** Array of interaction steps */
  steps: ScenarioStep[];

  /** Expected final state after scenario completes */
  expectedResult: ExpectedResult;
}

/**
 * Database setup configuration
 */
export interface DatabaseSetup {
  /** User configuration */
  user: {
    id: number;
    phoneNumber: string;
    username: string;
    additionalData?: any;
  };

  /** Teacher configuration */
  teacher: {
    id: number;
    userId: number;
    name: string;
    phone: string;
    tz?: string;
    teacherTypeReferenceId: number;
    teacherType: {
      id: number;
      key: number;
      name: string;
    };
  };

  /** Working dates for valid report dates */
  workingDates?: Array<{
    id: number;
    date: Date;
    teacherTypeReferenceId: number;
    userId: number;
  }>;

  /** Existing reports (for testing overwrite scenarios) */
  existingReports?: any[];

  /** Questions (for dynamic questions) */
  questions?: any[];

  /** Teacher question assignments */
  teacherQuestions?: any[];

  /** Text translations */
  texts?: Array<{
    userId: number;
    name: string;
    value: string;
    filepath?: string;
  }>;

  /** Other teachers (for MANHA lookup) */
  otherTeachers?: any[];

  /** Student groups (for student count) */
  studentGroups?: any[];

  /** Saved reports tracking (populated during test) - convention: saved + PascalCase + s */
  savedAttReports?: any[];

  /** Saved answers tracking (populated during test) */
  savedAnswers?: any[];
}

/**
 * Expected result after scenario completes (extends generic with project-specific fields)
 */
export interface ExpectedResult extends GenericExpectedResult {
  /** Expected saved report data (partial match) */
  savedReport?: Partial<any>;

  /** Expected saved answers */
  savedAnswers?: any[];
}

/**
 * Test execution context - tracks state during test execution (extends generic with project-specific repositories)
 */
export interface TestContext extends GenericTestContext<YemotHandlerService, Call> {
  /** Mock repositories */
  repositories: {
    user: any;
    teacher: any;
    teacherType: any;
    attReport: any;
    question: any;
    answer: any;
    workingDate: any;
    teacherQuestion: any;
    student: any;
    textByUser: any;
  };

  /** Setup with tracking arrays */
  setup: DatabaseSetup;
}
