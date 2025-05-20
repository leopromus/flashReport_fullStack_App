import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Title,
  Text,
  TextInput,
  Select,
  Table,
  Group,
  Button,
  Badge,
  Modal,
  Stack,
  Loader,
  Menu,
  Box,
  Alert,
  Card,
  ActionIcon,
  Tooltip,
  Divider,
  rem,
  Flex,
  Transition,
  Avatar,
  SegmentedControl,
  Skeleton,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconSearch,
  IconEdit,
  IconTrash,
  IconArrowUp,
  IconArrowDown,
  IconUsers,
  IconAlertCircle,
  IconCheck,
  IconUserPlus,
  IconUserMinus,
  IconDotsVertical,
  IconFilter,
  IconUserCircle,
  IconMail,
  IconPhone,
} from '@tabler/icons-react';
import { userService, User } from '../services/userService';
import { useMediaQuery } from '@mantine/hooks';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [adminCount, setAdminCount] = useState<number>(0);
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const isMobile = useMediaQuery('(max-width: 768px)');

  const form = useForm({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      phoneNumber: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      phoneNumber: (value) => (/^\+?[\d\s-]{10,}$/.test(value) ? null : 'Invalid phone number'),
    },
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data);
      const adminCountResponse = await userService.getAdminCount();
      setAdminCount(adminCountResponse.data);
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to fetch users',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: number, action: 'promote' | 'demote') => {
    try {
      if (action === 'promote') {
        await userService.promoteToAdmin(userId);
      } else {
        await userService.demoteFromAdmin(userId);
      }
      notifications.show({
        title: 'Success',
        message: `User ${action === 'promote' ? 'promoted' : 'demoted'} successfully`,
        color: 'green',
      });
      fetchUsers();
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || `Failed to ${action} user`,
        color: 'red',
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await userService.deleteUser(userId);
      notifications.show({
        title: 'Success',
        message: 'User deleted successfully',
        color: 'green',
      });
      setDeleteModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to delete user',
        color: 'red',
      });
    }
  };

  const handleEditUser = async (values: typeof form.values) => {
    if (!selectedUser) return;
    try {
      await userService.updateUser(selectedUser.id, values);
      notifications.show({
        title: 'Success',
        message: 'User updated successfully',
        color: 'green',
      });
      setEditModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to update user',
        color: 'red',
      });
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    form.setValues({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
    setEditModalOpen(true);
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.firstname.toLowerCase().includes(searchLower) ||
      user.lastname.toLowerCase().includes(searchLower);
    
    return selectedRole === 'ALL' ? matchesSearch : matchesSearch && user.role === selectedRole;
  });

  const UserStatsCard = () => (
    <Group gap="md" grow>
      <Card shadow="sm" p="md" radius="md" withBorder>
        <Group>
          <Box 
            style={{ 
              backgroundColor: 'var(--mantine-color-blue-1)', 
              padding: '12px',
              borderRadius: '50%'
            }}
          >
            <IconUsers size={24} style={{ color: 'var(--mantine-color-blue-6)' }} />
          </Box>
          <Box>
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Total Users</Text>
            <Title order={3}>{users.length}</Title>
          </Box>
        </Group>
      </Card>

      <Card shadow="sm" p="md" radius="md" withBorder>
        <Group>
          <Box 
            style={{ 
              backgroundColor: 'var(--mantine-color-green-1)', 
              padding: '12px',
              borderRadius: '50%'
            }}
          >
            <IconUserCircle size={24} style={{ color: 'var(--mantine-color-green-6)' }} />
          </Box>
          <Box>
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Administrators</Text>
            <Title order={3}>{adminCount}</Title>
          </Box>
        </Group>
      </Card>
    </Group>
  );

  const UserGridView = () => (
    <Grid gutter="md">
      {filteredUsers.map((user) => (
        <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3 }} key={user.id}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section p="md">
              <Group justify="center">
                <Avatar 
                  size={80} 
                  radius={80} 
                  color={user.role === 'ADMIN' ? 'blue' : 'green'}
                >
                  {user.firstname[0]}{user.lastname[0]}
                </Avatar>
              </Group>
            </Card.Section>

            <Stack gap="xs" align="center" mt="md">
              <Text fw={700} size="lg">{`${user.firstname} ${user.lastname}`}</Text>
              <Badge 
                color={user.role === 'ADMIN' ? 'blue' : 'green'} 
                variant="light"
                size="sm"
              >
                {user.role}
              </Badge>
              <Text size="sm" c="dimmed" style={{ wordBreak: 'break-all' }}>
                {user.email}
              </Text>
            </Stack>

            <Divider my="sm" />

            <Group justify="center" gap="xs">
              <Tooltip label="Edit">
                <ActionIcon 
                  variant="light" 
                  color="blue" 
                  onClick={() => openEditModal(user)}
                >
                  <IconEdit size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label={user.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}>
                <ActionIcon
                  variant="light"
                  color={user.role === 'ADMIN' ? 'orange' : 'green'}
                  onClick={() => handleRoleChange(
                    user.id,
                    user.role === 'ADMIN' ? 'demote' : 'promote'
                  )}
                >
                  {user.role === 'ADMIN' ? 
                    <IconUserMinus size={16} /> : 
                    <IconUserPlus size={16} />
                  }
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Delete">
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => {
                    setSelectedUser(user);
                    setDeleteModalOpen(true);
                  }}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );

  const TableView = () => (
    <Table.ScrollContainer minWidth={800}>
      <Table verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>User</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredUsers.map((user) => (
            <Table.Tr key={user.id}>
              <Table.Td>
                <Group gap="sm">
                  <Avatar 
                    size={40} 
                    radius={40} 
                    color={user.role === 'ADMIN' ? 'blue' : 'teal'}
                  >
                    {user.firstname[0]}{user.lastname[0]}
                  </Avatar>
                  <div>
                    <Text fz="sm" fw={500}>
                      {`${user.firstname} ${user.lastname}`}
                    </Text>
                    <Text fz="xs" c="dimmed">
                      {user.email}
                    </Text>
                  </div>
                </Group>
              </Table.Td>

              <Table.Td>
                <Select
                  data={[
                    { value: 'ADMIN', label: 'Administrator' },
                    { value: 'USER', label: 'Regular User' },
                  ]}
                  value={user.role}
                  onChange={(value) => handleRoleChange(
                    user.id,
                    value === 'ADMIN' ? 'demote' : 'promote'
                  )}
                  variant="unstyled"
                  allowDeselect={false}
                  styles={{
                    input: {
                      fontWeight: 500,
                      padding: 0,
                      color: user.role === 'ADMIN' ? 'var(--mantine-color-blue-6)' : 'var(--mantine-color-teal-6)',
                    },
                  }}
                />
              </Table.Td>

              <Table.Td>
                <Badge 
                  fullWidth 
                  variant="light" 
                  color={user.role === 'ADMIN' ? 'blue' : 'teal'}
                >
                  {user.role === 'ADMIN' ? 'Administrator' : 'Regular User'}
                </Badge>
              </Table.Td>

              <Table.Td>
                <Group gap="xs" justify="flex-start">
                  <Tooltip label="Edit user">
                    <ActionIcon 
                      variant="subtle" 
                      color="gray" 
                      onClick={() => openEditModal(user)}
                    >
                      <IconEdit style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Delete user">
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => {
                        setSelectedUser(user);
                        setDeleteModalOpen(true);
                      }}
                    >
                      <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );

  return (
    <Container size="xl" py="xl">
      {isLoading && (
        <Transition mounted={isLoading} transition="fade">
          {(styles) => (
            <Box 
              style={{ 
                ...styles,
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1000,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                padding: '2rem',
                borderRadius: '8px'
              }}
            >
              <Stack align="center" gap="sm">
                <Loader size="xl" variant="bars" />
                <Text size="sm" c="dimmed">Loading users...</Text>
              </Stack>
            </Box>
          )}
        </Transition>
      )}
      
      <Stack gap="lg">
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between" wrap="nowrap">
              <Box>
                <Title order={2}>User Management</Title>
                <Text c="dimmed" size="sm">Manage system users and their roles</Text>
              </Box>
              <SegmentedControl
                value={viewMode}
                onChange={(value) => setViewMode(value as 'table' | 'grid')}
                data={[
                  { label: 'Table', value: 'table' },
                  { label: 'Grid', value: 'grid' },
                ]}
              />
            </Group>

            <UserStatsCard />

            <Grid>
              <Grid.Col span={{ base: 12, sm: 8 }}>
                <TextInput
                  placeholder="Search by name, email, or username..."
                  leftSection={<IconSearch style={{ color: 'var(--mantine-color-gray-5)' }} size={18} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.currentTarget.value)}
                  size="md"
                  radius="md"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <Select
                  value={selectedRole}
                  onChange={(value) => setSelectedRole(value || 'ALL')}
                  data={[
                    { value: 'ALL', label: 'All Users' },
                    { value: 'ADMIN', label: 'Administrators' },
                    { value: 'USER', label: 'Regular Users' },
                  ]}
                  clearable={false}
                  size="md"
                  radius="md"
                  leftSection={<IconFilter size={18} />}
                />
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        {filteredUsers.length === 0 ? (
          <Alert
            variant="light"
            color="blue"
            title="No users found"
            icon={<IconAlertCircle />}
          >
            No users match your search criteria
          </Alert>
        ) : viewMode === 'grid' ? (
          <UserGridView />
        ) : (
          <Card shadow="sm" radius="md" withBorder>
            <TableView />
          </Card>
        )}
      </Stack>

      {/* Edit User Modal */}
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={<Title order={3}>Edit User</Title>}
        size="md"
        centered
      >
        <form onSubmit={form.onSubmit(handleEditUser)}>
          <Stack>
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="First Name"
                  placeholder="Enter first name"
                  leftSection={<IconUserCircle size={16} />}
                  {...form.getInputProps('firstname')}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Last Name"
                  placeholder="Enter last name"
                  leftSection={<IconUserCircle size={16} />}
                  {...form.getInputProps('lastname')}
                  required
                />
              </Grid.Col>
            </Grid>
            <TextInput
              label="Email"
              placeholder="Enter email"
              leftSection={<IconMail size={16} />}
              {...form.getInputProps('email')}
              required
            />
            <TextInput
              label="Phone Number"
              placeholder="Enter phone number"
              leftSection={<IconPhone size={16} />}
              {...form.getInputProps('phoneNumber')}
              required
            />
            <Divider my="sm" />
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" color="blue">Save Changes</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={
          <Group gap="xs">
            <IconAlertCircle size={20} style={{ color: 'var(--mantine-color-red-6)' }} />
            <Text size="lg" fw={700} c="red">Delete User</Text>
          </Group>
        }
        size="sm"
        centered
      >
        <Stack>
          <Text size="sm">
            Are you sure you want to delete the user <strong>{selectedUser?.firstname} {selectedUser?.lastname}</strong>? 
            This action cannot be undone.
          </Text>
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              color="red"
              onClick={() => selectedUser && handleDeleteUser(selectedUser.id)}
              leftSection={<IconTrash size={16} />}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default UserManagement; 