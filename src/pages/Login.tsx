import { useEffect } from 'react';
import logoImage from '../assets/logo.png';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Text,
  Group,
  Stack,
  Alert,
  Box,
  rem,
  useMantineTheme,
  ActionIcon,
  Image,
  SimpleGrid,
  Center,
  Container,
} from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { login, clearError } from '../store/slices/authSlice';
import { useThemeContext } from '../contexts/ThemeContext';

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
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
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(login(values));
    },
  });

  return (
    <Container size="xl" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
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
      <SimpleGrid
        cols={{ base: 1, md: 2 }}
        spacing={0}
        style={{
          width: '100%',
          minHeight: '80vh',
          background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
          borderRadius: rem(16),
          overflow: 'hidden',
        }}
      >
        {/* Left side - Login Form */}
        <Center p={{ base: 24, md: 48 }} bg={theme.colorScheme === 'dark' ? theme.colors.dark[7] : 'white'}>
          <Paper shadow="md" p="xl" radius="md" withBorder style={{ width: '100%', maxWidth: 400 }}>
            <Text size="xl" weight={700} mb="md">
              Welcome Back
            </Text>
            {error && (
              <Alert color="red" mb="md">
                {error}
              </Alert>
            )}
            <form onSubmit={formik.handleSubmit}>
              <Stack>
                <TextInput
                  label="Username"
                  id="username"
                  name="username"
                  placeholder="Enter username"
                  autoComplete="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  error={formik.touched.username && formik.errors.username}
                  required
                />
                <PasswordInput
                  label="Password"
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  autoComplete="current-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && formik.errors.password}
                  required
                />
                <Button
                  type="submit"
                  fullWidth
                  loading={isLoading}
                  mt="md"
                  color="indigo"
                  radius="md"
                  size="md"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
              </Stack>
            </form>
            <Text align="center" mt="md" size="sm" color="dimmed">
              Don't have an account?{' '}
              <Text
                component={RouterLink}
                to="/register"
                color="indigo"
                weight={600}
                style={{ textDecoration: 'none' }}
              >
                Sign up
              </Text>
            </Text>
          </Paper>
        </Center>

        {/* Right side - Minimal Content and Image */}
        <Box
          p={{ base: 24, md: 48 }}
          bg={theme.colors.indigo[6]}
          style={{
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Box style={{ maxWidth: 400, textAlign: 'center', zIndex: 2 }}>
            <Image
              src={logoImage}
              alt="Anti-corruption"
              radius="md"
              mb="md"
              maw={300}
              mx="auto"
            />
            <Box

            />
            <Text size="lg" weight={700} mb="xs" align="center">
              FlashReport Platform
            </Text>
            <Text size="sm" mb="xs">
              Join us in promoting integrity and fighting corruption in Rwanda.
            </Text>
            <Text size="sm" c="gray.2">
              Transparency • Integrity • Participation
            </Text>
          </Box>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default Login;