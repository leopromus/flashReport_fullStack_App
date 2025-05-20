import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton
} from '@mui/material';
import {
  Edit as EditIcon,
  Person as PersonIcon,
  Flag as FlagIcon,
  Build as BuildIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PendingActions as PendingIcon
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks';
import { updateProfile } from '../store/slices/profileSlice';
import { fetchReports } from '../store/slices/reportSlice';
import type { Report } from '../types';

const Profile = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { reports } = useAppSelector((state) => state.reports);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ open: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || ''
  });

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  // Calculate user statistics
  const userReports = reports.filter(report => report.createdBy === user?.id);
  const stats = {
    total: userReports.length,
    redFlags: userReports.filter(r => r.type === 'RED_FLAG').length,
    interventions: userReports.filter(r => r.type === 'INTERVENTION').length,
    resolved: userReports.filter(r => r.status === 'RESOLVED').length,
    pending: userReports.filter(r => ['DRAFT', 'UNDER_INVESTIGATION'].includes(r.status)).length,
    rejected: userReports.filter(r => r.status === 'REJECTED').length
  };

  const handleEditSubmit = async () => {
    try {
      await dispatch(updateProfile(formData)).unwrap();
      setEditDialogOpen(false);
      setNotification({
        open: true,
        message: 'Profile updated successfully',
        type: 'success'
      });
    } catch (error: any) {
      setNotification({
        open: true,
        message: error.message || 'Failed to update profile',
        type: 'error'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DRAFT': return 'default';
      case 'UNDER_INVESTIGATION': return 'warning';
      case 'RESOLVED': return 'success';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        {/* User Profile Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <PersonIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h5">{user?.firstname} {user?.lastname}</Typography>
                <Typography color="textSecondary">{user?.email}</Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setEditDialogOpen(true)}
              fullWidth
            >
              Edit Profile
            </Button>
          </Paper>
        </Grid>

        {/* Statistics Cards */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ bgcolor: 'primary.light' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    <FlagIcon />
                    <Typography variant="h6">Red Flags</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ mt: 2 }}>{stats.redFlags}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ bgcolor: 'info.light' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    <BuildIcon />
                    <Typography variant="h6">Interventions</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ mt: 2 }}>{stats.interventions}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ bgcolor: 'success.light' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircleIcon />
                    <Typography variant="h6">Resolved</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ mt: 2 }}>{stats.resolved}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Card sx={{ bgcolor: 'warning.light' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    <PendingIcon />
                    <Typography variant="h6">Pending</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ mt: 2 }}>{stats.pending}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Card sx={{ bgcolor: 'error.light' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CancelIcon />
                    <Typography variant="h6">Rejected</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ mt: 2 }}>{stats.rejected}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Recent Reports List */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Recent Reports</Typography>
            <List>
              {userReports.slice(0, 5).map((report) => (
                <ListItem
                  key={report.id}
                  divider
                  secondaryAction={
                    <Chip
                      label={report.status}
                      color={getStatusColor(report.status) as any}
                      size="small"
                    />
                  }
                >
                  <ListItemText
                    primary={report.title}
                    secondary={`${report.type} • ${new Date(report.createdOn).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstname}
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
            />
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastname}
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Alert
        severity={notification.type}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: notification.open ? 'flex' : 'none',
        }}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
      >
        {notification.message}
      </Alert>
    </Container>
  );
};

export default Profile; 