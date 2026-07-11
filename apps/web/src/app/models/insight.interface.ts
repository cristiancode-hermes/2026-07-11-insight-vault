export interface Insight {
  id: number;
  title: string;
  content: string;
  categoryId?: number;
  category?: Category;
  tags?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  userId: number;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: { id: number; email: string; name: string; };
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}
