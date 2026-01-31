import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuHorizontal } from './menu-horizontal';

describe('MenuHorizontal', () => {
  let component: MenuHorizontal;
  let fixture: ComponentFixture<MenuHorizontal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuHorizontal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuHorizontal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
