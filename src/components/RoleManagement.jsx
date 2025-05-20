import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
  Heading,
  Flex,
  Badge,
  Select,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  Card,
  CardBody,
  Stack,
  Divider,
} from '@chakra-ui/react';
import axios from 'axios';

const RoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [adminCount, setAdminCount] = useState(0);
  const [selectedRole, setSelectedRole] = useState('ALL');
  const toast = useToast();

  // Fetch all users and admin count
  const fetchUsers = async () => {
    try {
      let response;
      if (selectedRole === 'ALL') {
        response = await axios.get('/api/v1/users');
      } else {
        response = await axios.get(`/api/v1/users/role/${selectedRole}`);
      }
      setUsers(response.data.data);
      
      // Fetch admin count
      const adminCountResponse = await axios.get('/api/v1/users/admins/count');
      setAdminCount(adminCountResponse.data.data);
    } catch (error) {
      toast({
        title: 'Error fetching users',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedRole]);

  const handleRoleChange = async (userId, action) => {
    try {
      const endpoint = action === 'promote' ? 'promote' : 'demote';
      await axios.patch(`/api/v1/users/${userId}/${endpoint}`);
      
      toast({
        title: `User ${action === 'promote' ? 'promoted' : 'demoted'} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      fetchUsers();
    } catch (error) {
      toast({
        title: `Error ${action === 'promote' ? 'promoting' : 'demoting'} user`,
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5}>
      <Stack spacing={6}>
        <Heading size="lg">Role Management</Heading>
        
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Current Admin Users</StatLabel>
              <StatNumber>{adminCount}</StatNumber>
            </Stat>
          </CardBody>
        </Card>

        <Flex justify="space-between" align="center">
          <Text fontSize="lg">Filter by Role:</Text>
          <Select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            width="200px"
          >
            <option value="ALL">All Users</option>
            <option value="ADMIN">Admins Only</option>
            <option value="USER">Regular Users Only</option>
          </Select>
        </Flex>

        <Divider />

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Username</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.username}</Td>
                <Td>{`${user.firstname} ${user.lastname}`}</Td>
                <Td>{user.email}</Td>
                <Td>
                  <Badge
                    colorScheme={user.role === 'ADMIN' ? 'green' : 'blue'}
                  >
                    {user.role}
                  </Badge>
                </Td>
                <Td>
                  {user.role === 'ADMIN' ? (
                    <Button
                      size="sm"
                      colorScheme="orange"
                      onClick={() => handleRoleChange(user.id, 'demote')}
                    >
                      Demote to User
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      colorScheme="green"
                      onClick={() => handleRoleChange(user.id, 'promote')}
                    >
                      Promote to Admin
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Stack>
    </Box>
  );
};

export default RoleManagement; 