import { createTest, destroyVM } from '../util';
import Btn from 'packages/btn';

describe('Btn', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(Btn, true);
    expect(vm.$el).to.exist;
  });
});

