// Data Transfer Objects: the shape of data coming IN from requests.

export interface RegisterDTO {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

// Shape of the user we send back to the client (never includes the password).
export interface UserResponseDTO {
  id: string;
  fullName: string;
  email: string;
  createdAt: Date;
}
