import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Piscinas } from './piscinas';

describe('Piscinas', () => {
  let component: Piscinas;
  let fixture: ComponentFixture<Piscinas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Piscinas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Piscinas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
