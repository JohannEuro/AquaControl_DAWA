import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAlimentacionDialog } from './editar-alimentacion-dialog';

describe('EditarAlimentacionDialog', () => {
  let component: EditarAlimentacionDialog;
  let fixture: ComponentFixture<EditarAlimentacionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarAlimentacionDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarAlimentacionDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
