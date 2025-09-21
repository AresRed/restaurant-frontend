import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkUsComponent } from './work-us.component';

describe('WorkUsComponent', () => {
  let component: WorkUsComponent;
  let fixture: ComponentFixture<WorkUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkUsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
