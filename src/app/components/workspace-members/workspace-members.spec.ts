import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceMembers } from './workspace-members.component';

describe('WorkspaceMembers', () => {
  let component: WorkspaceMembers;
  let fixture: ComponentFixture<WorkspaceMembers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceMembers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkspaceMembers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
