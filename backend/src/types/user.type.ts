export type Address = {
  address: string;
  city: string;
  state: string;
  postalCode: string;
};

export type Company = {
  name: string;
  department: string;
  title: string;
};

export type UserModelType = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  email: string;
  password: string;
  username: string;
  address?: Address;
  company?: Company;
  isDeleted?: boolean;
  token?: string;
};
