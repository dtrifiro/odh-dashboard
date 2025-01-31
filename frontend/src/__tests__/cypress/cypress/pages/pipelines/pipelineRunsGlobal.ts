import { PipelineRunSearchParam } from '~/concepts/pipelines/content/types';
import { DeleteModal } from '~/__tests__/cypress/cypress/pages/components/DeleteModal';

class PipelineRunsGlobal {
  visit(projectName: string, runType?: 'active' | 'archived' | 'scheduled') {
    cy.visitWithLogin(
      `/pipelineRuns/${projectName}${
        runType ? `?${PipelineRunSearchParam.RunType}=${runType}` : ''
      }`,
    );
    this.wait();
  }

  private wait() {
    cy.findByTestId('app-page-title').contains('Runs');
    cy.testA11y();
  }

  isApiAvailable() {
    return cy.findByTestId('pipelines-api-not-available').should('not.exist');
  }

  findSchedulesTab() {
    return cy.findByRole('tab', { name: 'Schedules tab' });
  }

  findActiveRunsTab() {
    return cy.findByRole('tab', { name: 'Active runs tab' });
  }

  findArchivedRunsTab() {
    return cy.findByRole('tab', { name: 'Archived runs tab' });
  }

  findProjectSelect() {
    return cy.findByTestId('project-selector-dropdown');
  }

  findCreateRunButton() {
    return cy.findByRole('button', { name: 'Create run' });
  }

  findCreateScheduleButton() {
    return cy.findByRole('button', { name: 'Schedule run' });
  }

  findRestoreRunButton() {
    return cy.findByRole('button', { name: 'Restore' });
  }

  findActiveRunsToolbar() {
    return cy.findByTestId('active-runs-table-toolbar');
  }

  findArchivedRunsToolbar() {
    return cy.findByTestId('archived-runs-table-toolbar');
  }

  selectFilterByName(name: string) {
    cy.findByTestId('pipeline-filter-dropdown').findDropdownItem(name).click();
  }

  selectProjectByName(name: string) {
    this.findProjectSelect().findDropdownItem(name).click();
  }
}

class SchedulesDeleteModal extends DeleteModal {
  constructor() {
    super();
  }

  find() {
    return cy.findByTestId('delete-schedule-modal').parents('div[role="dialog"]');
  }
}

class RunsDeleteModal extends DeleteModal {
  constructor() {
    super();
  }

  find() {
    return cy.findByTestId('delete-run-modal').parents('div[role="dialog"]');
  }
}

export const pipelineRunsGlobal = new PipelineRunsGlobal();
export const schedulesDeleteModal = new SchedulesDeleteModal();
export const runsDeleteModal = new RunsDeleteModal();
