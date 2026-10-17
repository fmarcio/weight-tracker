import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';

const mockPush = jest.fn();
const mockLogin = jest.fn();
const mockRegister = jest.fn();
const mockLogout = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    login: mockLogin,
    register: mockRegister,
    logout: mockLogout,
  }),
}));

describe('LoginForm and RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('LoginForm logs in with valid credentials and redirects to home', async () => {
    mockLogin.mockResolvedValueOnce({ uid: '123', email: 'user@example.com' });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'password123');
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  test('RegisterForm blocks mismatched passwords and registers when matching', async () => {
    mockRegister.mockResolvedValueOnce({
      uid: '123',
      email: 'new@example.com',
    });

    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'new@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'different123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(
      screen.getByText(/Passwords do not match/i),
    ).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        'new@example.com',
        'password123',
      );
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
});
