import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterLayoutComponent } from './waiter-layout.component';

describe('WaiterLayoutComponent', () => {
  let component: WaiterLayoutComponent;
  let fixture: ComponentFixture<WaiterLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaiterLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaiterLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
