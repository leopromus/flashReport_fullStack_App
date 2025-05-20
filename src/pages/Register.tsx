import { useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Text,
  Grid,
  useMantineTheme,
  ActionIcon,
  Image,
  Alert,
} from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { register, clearError } from '../store/slices/authSlice';
import { useThemeContext } from '../contexts/ThemeContext';

const validationSchema = Yup.object({
  firstname: Yup.string().required('First name is required'),
  lastname: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phoneNumber: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .required('Phone number is required'),
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token, error, isLoading } = useAppSelector((state) => state.auth);
  const { isDarkMode, toggleTheme } = useThemeContext();
  const theme = useMantineTheme();

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
    return () => {
      dispatch(clearError());
    };
  }, [token, navigate, dispatch]);

  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      phoneNumber: '',
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(register(values));
    },
  });

  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'row',
        background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      }}
    >
      {/* Theme toggle button */}
      <Box
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1,
        }}
      >
        <ActionIcon
          variant="outline"
          color={isDarkMode ? 'yellow' : 'blue'}
          onClick={toggleTheme}
          size="lg"
        >
          {isDarkMode ? <IconSun size={20} /> : <IconMoon size={20} />}
        </ActionIcon>
      </Box>

      {/* Left side - Registration Form */}
      <Box
        style={{
          flex: '1 1 50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 32,
        }}
      >
        <Paper shadow="md" p="xl" radius="md" withBorder style={{ width: '100%', maxWidth: 500 }}>
          <Text size="xl" weight={700} mb="md">
            Create Account
          </Text>
          {error && (
            <Alert color="red" mb="md">
              {error}
            </Alert>
          )}
          <form onSubmit={formik.handleSubmit}>
            <Grid gutter="md">
              <Grid.Col span={6}>
                <TextInput
                  label="First Name"
                  id="firstname"
                  name="firstname"
                  autoComplete="given-name"
                  value={formik.values.firstname}
                  onChange={formik.handleChange}
                  error={formik.touched.firstname && formik.errors.firstname}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Last Name"
                  id="lastname"
                  name="lastname"
                  autoComplete="family-name"
                  value={formik.values.lastname}
                  onChange={formik.handleChange}
                  error={formik.touched.lastname && formik.errors.lastname}
                  required
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Email Address"
                  id="email"
                  name="email"
                  autoComplete="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && formik.errors.email}
                  required
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Phone Number"
                  id="phoneNumber"
                  name="phoneNumber"
                  autoComplete="tel"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  error={formik.touched.phoneNumber && formik.errors.phoneNumber}
                  required
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Username"
                  id="username"
                  name="username"
                  autoComplete="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  error={formik.touched.username && formik.errors.username}
                  required
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <PasswordInput
                  label="Password"
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && formik.errors.password}
                  required
                />
              </Grid.Col>
            </Grid>
            <Button
              type="submit"
              fullWidth
              loading={isLoading}
              mt="md"
              color="indigo"
              radius="md"
              size="md"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
            <Text ta="center" mt="md" size="sm" color="dimmed">
              Already have an account?{' '}
              <Text
                component={RouterLink}
                to="/login"
                color="indigo"
                weight={600}
                style={{ textDecoration: 'none' }}
              >
                Sign in
              </Text>
            </Text>
          </form>
        </Paper>
      </Box>

      {/* Right side - Minimal Content and Image */}
      <Box
        style={{
          flex: '1 1 50%',
          background: theme.colors.indigo[6],
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 64,
        }}
      >
        <Box style={{ maxWidth: 400, textAlign: 'center', zIndex: 2 }}>
          <Image
            src="https://giace.org/wp-content/uploads/2020/09/codes_GIACE-750x375.png"
            alt="Anti-corruption illustration"
            radius="md"
            mb="md"
            maw={300}
            mx="auto"
          />
          <Text size="lg" fw={700} mb="xs">
            Join the movement!
          </Text>
          <Text size="sm" mb="xs">
            Register and be part of the fight for integrity and good governance in Rwanda.
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;