import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import useOAuthLogin from '@/hooks/useOAuthLogin';
import useRegister from '@/hooks/useRegister';
import type { RegisterPayload } from '@/types/auth.types';

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPayload>();
  const { mutate, isPending, isError, error } = useRegister();
  const {
    mutate: oauthMutate,
    isPending: isOAuthPending,
    isError: isOAuthError,
    error: oauthError,
  } = useOAuthLogin();

  const onSubmit = (formData: RegisterPayload) => {
    mutate(formData);
  };

  const isLoading = isPending || isOAuthPending;

  return (
    <div className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-sm">
      <h1 className="mb-6 text-2xl font-semibold">Create account</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            {...register('username', { required: 'Username is required' })}
          />
          {errors.username ? (
            <p className="text-sm text-destructive">
              {errors.username.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email ? (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />
          {errors.password ? (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" {...register('bio')} />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isPending ? 'Creating account...' : 'Register'}
        </Button>

        {isError ? (
          <p className="text-sm text-destructive">
            {error?.message ?? 'Registration failed. Please try again.'}
          </p>
        ) : null}
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={isLoading}
        onClick={() => oauthMutate()}
      >
        {isOAuthPending ? 'Signing in...' : 'Google'}
      </Button>

      {isOAuthError ? (
        <p className="mt-2 text-sm text-destructive">
          {oauthError?.message ?? 'Google sign-in failed. Please try again.'}
        </p>
      ) : null}

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="text-foreground underline">
          Login
        </Link>
      </p>
    </div>
  );
}
