import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationOrdersComponent } from './notification-orders.component';

describe('NotificationOrdersComponent', () => {
  let component: NotificationOrdersComponent;
  let fixture: ComponentFixture<NotificationOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
