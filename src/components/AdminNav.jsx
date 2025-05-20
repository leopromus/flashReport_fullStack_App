import React, { useState } from 'react';
import {
  Box,
  Group,
  Burger,
  Drawer,
  Stack,
  Button,
  Menu,
  Text,
  rem,
  NavLink,
  useMantineTheme,
} from '@mantine/core';
import { IconChevronDown, IconUser, IconLogout } from '@tabler/icons-react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const Links = [
  { name: 'Dashboard', path: '/admin/dashboard' },
  { name: 'User Management', path: '/admin/users' },
  // Add more admin navigation items here
];

const AdminNav = () => {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const location = useLocation();
  const theme = useMantineTheme();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <Box
      bg={theme.colorScheme === 'dark' ? theme.colors.dark[7] : 'white'}
      px={rem(24)}
      py={rem(8)}
      style={{
        boxShadow: theme.shadows.sm,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <Group position="apart" align="center" h={rem(56)}>
        {/* Left: Brand and Nav */}
        <Group align="center" spacing="lg">
          <Text fw={700} size="lg">
            Admin Panel
          </Text>
          <Group spacing="sm" visibleFrom="md" as="nav">
            {Links.map((link) => (
              <NavLink
                key={link.path}
                component={RouterLink}
                to={link.path}
                label={link.name}
                active={location.pathname === link.path}
                variant={location.pathname === link.path ? 'filled' : 'light'}
                color="indigo"
                style={{ fontWeight: location.pathname === link.path ? 700 : 400 }}
              />
            ))}
          </Group>
        </Group>

        {/* Right: User Menu */}
        <Group>
          <Menu shadow="md" width={180} position="bottom-end">
            <Menu.Target>
              <Button
                variant="subtle"
                color="indigo"
                rightSection={<IconChevronDown size={16} />}
                radius="xl"
                px="md"
              >
                {user?.username || 'Admin'}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                component={RouterLink}
                to="/profile"
                icon={<IconUser size={16} />}
              >
                Profile
              </Menu.Item>
              <Menu.Item
                component={RouterLink}
                to="/logout"
                icon={<IconLogout size={16} />}
                color="red"
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          {/* Burger for mobile */}
          <Burger
            opened={drawerOpened}
            onClick={() => setDrawerOpened((o) => !o)}
            hiddenFrom="md"
            size="md"
            aria-label="Open navigation"
          />
        </Group>
      </Group>

      {/* Drawer for mobile nav */}
      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        padding="md"
        size="xs"
        title="Navigation"
        hiddenFrom="md"
        zIndex={200}
      >
        <Stack spacing="sm" mt="md">
          {Links.map((link) => (
            <NavLink
              key={link.path}
              component={RouterLink}
              to={link.path}
              label={link.name}
              active={location.pathname === link.path}
              variant={location.pathname === link.path ? 'filled' : 'light'}
              color="indigo"
              onClick={() => setDrawerOpened(false)}
              style={{ fontWeight: location.pathname === link.path ? 700 : 400 }}
            />
          ))}
        </Stack>
      </Drawer>
    </Box>
  );
};

export default AdminNav;