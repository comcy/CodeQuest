import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersLib } from './users-lib';

describe('UsersLib', () => {
  let component: UsersLib;
  let fixture: ComponentFixture<UsersLib>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersLib]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersLib);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
