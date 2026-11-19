export interface AddressDto {
  readonly address: string;
  readonly city: string;
  readonly state: string;
  readonly postalCode: string;
}

export interface CompanyDto {
  readonly name: string;
  readonly department: string;
  readonly title: string;
}

export interface UserResponseDto {
  readonly id: number;
  readonly email: string;
  readonly username: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly age?: number;
  readonly gender?: string;
  readonly address?: AddressDto;
  readonly company?: CompanyDto;
}
