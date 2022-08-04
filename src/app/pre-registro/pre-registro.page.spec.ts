import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PreRegistroPage } from './pre-registro.page';

describe('PreRegistroPage', () => {
  let component: PreRegistroPage;
  let fixture: ComponentFixture<PreRegistroPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreRegistroPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PreRegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
