import type { UserResponseDto, AddressDto, CompanyDto } from "./user.types.ts";

export interface LoginDto {
  readonly email?: string;
  readonly username?: string;
  readonly password: string;
}

export interface SignupDto {
  readonly email: string;
  readonly password: string;
  readonly username?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly age?: number;
  readonly gender?: string;
  readonly address?: AddressDto;
  readonly company?: CompanyDto;
}

export interface AuthResponseDto {
  readonly user: UserResponseDto;
  readonly token: string;
}
