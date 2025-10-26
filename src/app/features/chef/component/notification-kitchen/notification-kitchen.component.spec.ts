import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationKitchenComponent } from './notification-kitchen.component';

describe('NotificationKitchenComponent', () => {
  let component: NotificationKitchenComponent;
  let fixture: ComponentFixture<NotificationKitchenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationKitchenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationKitchenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
