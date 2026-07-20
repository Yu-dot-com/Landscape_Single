export interface authTypes {
  id: string;
  email: string;
  username: string;
  password: string;
}

export interface userTypes {
  user: {
    id: string;
    email: string;
    username: string;
    role: string;
  };
}
