import { TestBed } from '@angular/core/testing';
import { DekolistaStore } from './dekolista.store';
import { DEKOLISTA_STORAGE_KEY } from './dekolista.model';

const sampleDecoration = {
  id: 'dec-1',
  name: 'Girlanda',
  slug: 'girlanda',
  description: 'Opis',
  imageUrl: null,
  stockQuantity: 3,
};

describe('DekolistaStore', () => {
  let store: DekolistaStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(DekolistaStore);
    store.clear();
  });

  it('adds a decoration and increments quantity on repeat add', () => {
    store.addDecoration(sampleDecoration, 'Balony');
    store.addDecoration(sampleDecoration, 'Balony');

    expect(store.entries()).toEqual([
      {
        decorationId: 'dec-1',
        name: 'Girlanda',
        slug: 'girlanda',
        categoryName: 'Balony',
        quantity: 2,
      },
    ]);
    expect(store.totalQuantity()).toBe(2);
  });

  it('persists items to localStorage when available', () => {
    if (typeof localStorage?.setItem !== 'function') {
      store.addDecoration(sampleDecoration, 'Balony');
      expect(store.entries().length).toBe(1);
      return;
    }

    store.addDecoration(sampleDecoration, 'Balony');
    expect(localStorage.getItem(DEKOLISTA_STORAGE_KEY)).toContain('Girlanda');
  });

  it('resets confirmed flag when list changes', () => {
    store.addDecoration(sampleDecoration, 'Balony');
    store.confirm();
    expect(store.confirmed()).toBe(true);

    store.setQuantity('dec-1', 3);
    expect(store.confirmed()).toBe(false);
  });
});
