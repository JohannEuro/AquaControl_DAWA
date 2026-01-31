import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPiscinaDialog } from './editar-piscina-dialog';

describe('EditarPiscinaDialog', () => {
  let component: EditarPiscinaDialog;
  let fixture: ComponentFixture<EditarPiscinaDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPiscinaDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarPiscinaDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
