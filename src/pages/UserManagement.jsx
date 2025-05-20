import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Input,
  Modal,
  Select,
  Stack,
  Table,
  Text,
  Title,
  Loader,
  Notification,
} from '@mantine/core';
import { IconSearch, IconEdit, IconTrash, IconArrowUp, IconArrowDown, IconChevronDown } from '@tabler/icons-react';
import { userService } from '../services/userService';

const roleOptions = [
  { value: 'ALL', label: 'All Users' },
  { value: 'ADMIN', label: 'Admins Only' },
  { value: 'USER', label: 'Regular Users Only' },
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [adminCount, setAdminCount] = useState(0);
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const [notification, setNotification] = useState(null);

  // Fetch all users and admin count
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      let response;
      if (selectedRole === 'ALL') {
        response = await userService.getAllUsers();
      } else {
        response = await userService.getUsersByRole(selectedRole);
      }
      setUsers(response.data);

      const adminCountResponse = await userService.getAdminCount();
      setAdminCount(adminCountResponse.data);
    } catch (error) {
      setNotification({
        message: error?.response?.data?.message || 'Error fetching users',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [selectedRole]);

  const handleRoleChange = async (userId, action) => {
    try {
      if (action === 'promote') {
        await userService.promoteToAdmin(userId);
      } else {
        await userService.demoteFromAdmin(userId);
      }
      setNotification({
        message: `User ${action === 'promote' ? 'promoted' : 'demoted'} successfully`,
        color: 'green',
      });
      fetchUsers();
    } catch (error) {
      setNotification({
        message: error?.response?.data?.message || `Error ${action === 'promote' ? 'promoting' : 'demoting'} user`,
        color: 'red',
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(userId);
        setNotification({ message: 'User deleted successfully', color: 'green' });
        fetchUsers();
      } catch (error) {
        setNotification({
          message: error?.response?.data?.message || 'Error deleting user',
          color: 'red',
        });
      }
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalOpened(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const userData = {
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname'),
        email: formData.get('email'),
        phoneNumber: formData.get('phoneNumber'),
      };
      await userService.updateUser(selectedUser.id, userData);
      setNotification({ message: 'User updated successfully', color: 'green' });
      setModalOpened(false);
      fetchUsers();
    } catch (error) {
      setNotification({
        message: error?.response?.data?.message || 'Error updating user',
        color: 'red',
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (user.username && user.username.toLowerCase().includes(searchLower)) ||
      (user.email && user.email.toLowerCase().includes(searchLower)) ||
      (user.firstname && user.firstname.toLowerCase().includes(searchLower)) ||
      (user.lastname && user.lastname.toLowerCase().includes(searchLower))
    );
  });

  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Title order={2}>User Management</Title>
          <Card withBorder>
            <Stack gap={0}>
              <Text size="xs" c="dimmed">
                Admin Users
              </Text>
              <Text size="xl" fw={700}>
                {adminCount}
              </Text>
            </Stack>
          </Card>
        </Group>

        <Group justify="space-between" wrap="nowrap">
          <Input
            leftSection={<IconSearch size={16} />}
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            w={300}
          />
          <Select
            data={roleOptions}
            value={selectedRole}
            onChange={(val) => setSelectedRole(val || 'ALL')}
            w={200}
          />
        </Group>

        <Divider />

        {notification && (
          <Notification color={notification.color} onClose={() => setNotification(null)}>
            {notification.message}
          </Notification>
        )}

        <Card withBorder p={0}>
          {isLoading ? (
            <Group justify="center" py="xl">
              <Loader />
            </Group>
          ) : (
            <Table.ScrollContainer minWidth={800}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Username</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Role</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredUsers.map((user) => (
                    <Table.Tr key={user.id}>
                      <Table.Td>
                        <Group gap="sm">
                          <Avatar size={32} src={user.avatar} radius="xl" />
                          <Text>{user.username}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        {user.firstname} {user.lastname}
                      </Table.Td>
                      <Table.Td>{user.email}</Table.Td>
                      <Table.Td>
                        <Badge color={user.role === 'ADMIN' ? 'green' : 'blue'}>
                          {user.role}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          <Button
                            size="xs"
                            variant="light"
                            leftSection={<IconEdit size={14} />}
                            onClick={() => handleEditUser(user)}
                          >
                            Edit
                          </Button>
                          {user.role === 'ADMIN' ? (
                            <Button
                              size="xs"
                              variant="light"
                              color="orange"
                              leftSection={<IconArrowDown size={14} />}
                              onClick={() => handleRoleChange(user.id, 'demote')}
                            >
                              Demote
                            </Button>
                          ) : (
                            <Button
                              size="xs"
                              variant="light"
                              color="green"
                              leftSection={<IconArrowUp size={14} />}
                              onClick={() => handleRoleChange(user.id, 'promote')}
                            >
                              Promote
                            </Button>
                          )}
                          <Button
                            size="xs"
                            variant="light"
                            color="red"
                            leftSection={<IconTrash size={14} />}
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Delete
                          </Button>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          )}
        </Card>
      </Stack>

      {/* Edit User Modal */}
     <Modal
  opened={modalOpened}
  onClose={() => setModalOpened(false)}
  title="Edit User"
  centered
>
  {selectedUser && (
    <form onSubmit={handleUpdateUser}>
      <Stack>
        <div>
          <Text size="sm" mb={4}>First Name</Text>
          <Input
            name="firstname"
            placeholder="First Name"
            defaultValue={selectedUser.firstname || ''}
            required
          />
        </div>
        <div>
          <Text size="sm" mb={4}>Last Name</Text>
          <Input
            name="lastname"
            placeholder="Last Name"
            defaultValue={selectedUser.lastname || ''}
            required
          />
        </div>
        <div>
          <Text size="sm" mb={4}>Email</Text>
          <Input
            name="email"
            placeholder="Email"
            type="email"
            defaultValue={selectedUser.email || ''}
            required
          />
        </div>
        <div>
          <Text size="sm" mb={4}>Phone Number</Text>
          <Input
            name="phoneNumber"
            placeholder="Phone Number"
            defaultValue={selectedUser.phoneNumber || ''}
          />
        </div>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setModalOpened(false)}>
            Cancel
          </Button>
          <Button type="submit" color="blue">
            Save Changes
          </Button>
        </Group>
      </Stack>
    </form>
  )}
</Modal>
    </Container>
  );
};

export default UserManagement;