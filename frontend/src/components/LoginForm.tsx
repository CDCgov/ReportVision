import { Alert, Button, Label  } from '@trussworks/react-uswds';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { mockLogin, useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

type LoginFormData = {
    email: string;
    password: string;
};

const loginSchema = yup.object().shape({
    email: yup
      .string()
      .email('Please enter a valid email address')
      .required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .required('Password is required'),
});

const LoginForm = () => {
    const { 
        register, 
        handleSubmit, 
        formState: { 
          errors, 
          isSubmitting,
          isSubmitted,  // Add this to track submission state
        },
        setError,
      } = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema),
        mode: 'onSubmit',
        criteriaMode: 'all',
        defaultValues: {
          email: '',
          password: ''
        }
      });
    const { login } = useAuth();  
    const navigate = useNavigate() 


  const onSubmit = async (data: LoginFormData) => {
    try {
      // Prevent default form behavior      
      const token = await mockLogin(data.email, data.password);   
      login(token.token)
      navigate('/');
    } catch (error) {
        console.log(error)
        setError('root', {
            type: 'manual',
            message: 'Login failed. Please try again.',
        });
    }
  };

  return (
    <div className="login-form-container">
      <h1>Log into my account</h1>

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="display-flex flex-column width-full">
        {isSubmitted && errors.email?.message && (
          <Alert type='error' headingLevel={'h2'}>
            {errors.email.message}
          </Alert>
        )}
        {isSubmitted && errors.password?.message && (
          <Alert type='error' headingLevel={'h2'}>
            {errors.password?.message}
          </Alert>
        )}

        {isSubmitted && errors.root?.message && (
          <Alert type='error' headingLevel={'h2'}>
            {errors.root?.message}
          </Alert>
        )}  

        <Label htmlFor="email">
          Email address
        </Label>
        <input
          {...register('email')}
          id="email"
          className='login-input usa-input'
          type="email"
          aria-required="true"
          aria-invalid={isSubmitted && !!errors.email}
          data-testid="email"
        />

        <Label htmlFor="password">
          Password
        </Label>
        <input
          {...register('password')}
          className='login-input usa-input'
          id="password"
          type="password"
          aria-required="true"
          aria-invalid={isSubmitted && !!errors.password}
          data-testid="password"
        />

        <a 
          className='login-link'
          href="#forgot-password"
        >
          Forgot password?
        </a>

        <Button
          className='login-button'
          type="submit"
          disabled={isSubmitting}
          aria-label="Login to your account"
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <div>
        <span>Don't have an account? </span>
        <a 
          className='login-submit-link'
          href="#create-account"
        >
          Create account
        </a>
      </div>
    </div>
  );
};

export default LoginForm;