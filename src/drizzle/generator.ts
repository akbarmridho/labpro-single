import { faker } from '@faker-js/faker';

const companyCodeSet = new Set<string>();

const itemsCodeSet = new Set<string>();

export const generateCompany = () => {
  let code = faker.string.alpha({ length: 3 }).toUpperCase();

  while (companyCodeSet.has(code)) {
    code = faker.string.alpha({ length: 3 }).toUpperCase();
  }

  companyCodeSet.add(code);

  return {
    nama: faker.company.name(),
    alamat: faker.location.streetAddress(),
    no_telp: faker.string.numeric({ allowLeadingZeros: true, length: 12 }),
    kode: code,
  };
};

export const generateItem = (perusahaan_id: string) => {
  let code = faker.string.alpha({ length: 5 }).toUpperCase();

  while (itemsCodeSet.has(code)) {
    code = faker.string.alpha({ length: 5 }).toUpperCase();
  }

  itemsCodeSet.add(code);

  return {
    nama: faker.commerce.product(),
    harga: faker.number.int({ min: 1, max: 100 }) * 10000,
    stok: faker.number.int({ min: 0, max: 100 }),
    kode: code,
    perusahaan_id,
  };
};
