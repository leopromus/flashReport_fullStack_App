import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  Snackbar,
  Card,
  CardContent
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Flag as FlagIcon,
  Build as BuildIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PendingActions as PendingIcon
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchReports, updateStatus, deleteReport } from '../store/slices/reportSlice';
import type { Report } from '../types';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { reports, isLoading, error } = useAppSelector((state) => state.reports);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ open: false, message: '', type: 'success' });

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  // Calculate statistics
  const stats = {
    total: reports.length,
    redFlags: reports.filter(r => r.type === 'RED_FLAG').length,
    interventions: reports.filter(r => r.type === 'INTERVENTION').length,
    resolved: reports.filter(r => r.status === 'RESOLVED').length,
    pending: reports.filter(r => ['DRAFT', 'UNDER_INVESTIGATION'].includes(r.status)).length,
    rejected: reports.filter(r => r.status === 'REJECTED').length
  };

  const handleStatusUpdate = async () => {
    if (selectedReport && newStatus) {
      try {
        await dispatch(updateStatus({
          id: selectedReport.id,
          status: newStatus as Report['status']
        })).unwrap();
        setStatusDialogOpen(false);
        setNotification({
          open: true,
          message: 'Status updated successfully',
          type: 'success'
        });
      } catch (error: any) {
        setNotification({
          open: true,
          message: error.message || 'Failed to update status',
          type: 'error'
        });
      }
    }
  };

  const handleDelete = async () => {
    if (selectedReport) {
      try {
        await dispatch(deleteReport(selectedReport.id)).unwrap();
        setDeleteDialogOpen(false);
        setNotification({
          open: true,
          message: 'Report deleted successfully',
          type: 'success'
        });
      } catch (error: any) {
        setNotification({
          open: true,
          message: error.message || 'Failed to delete report',
          type: 'error'
        });
      }
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesSearch = searchTerm === '' ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.comment.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesStatus && matchesSearch;
  });

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
    <Container maxWidth="xl">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Admin Dashboard</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/admin/users')}
          >
            Manage Users
          </Button>
        </Box>
        
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ bgcolor: 'primary.light' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  <FlagIcon />
                  <Typography variant="h6">Red Flags</Typography>
                </Box>
                <Typography variant="h3" sx={{ mt: 2 }}>{stats.redFlags}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>Total red flag reports</Typography>
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
                <Typography variant="body2" sx={{ mt: 1 }}>Total intervention reports</Typography>
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
                <Typography variant="body2" sx={{ mt: 1 }}>Total resolved reports</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ bgcolor: 'warning.light' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  <PendingIcon />
                  <Typography variant="h6">Pending</Typography>
                </Box>
                <Typography variant="h3" sx={{ mt: 2 }}>{stats.pending}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>Reports under investigation or draft</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ bgcolor: 'error.light' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  <CancelIcon />
                  <Typography variant="h6">Rejected</Typography>
                </Box>
                <Typography variant="h3" sx={{ mt: 2 }}>{stats.rejected}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>Total rejected reports</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Type Filter</InputLabel>
              <Select
                value={filterType}
                label="Type Filter"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="RED_FLAG">Red Flag</MenuItem>
                <MenuItem value="INTERVENTION">Intervention</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={filterStatus}
                label="Status Filter"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="DRAFT">Draft</MenuItem>
                <MenuItem value="UNDER_INVESTIGATION">Under Investigation</MenuItem>
                <MenuItem value="RESOLVED">Resolved</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Reports"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: <SearchIcon />
              }}
            />
          </Grid>
        </Grid>

        {/* Reports Table */}
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Created On</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id} hover>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>
                    <Chip
                      label={report.type}
                      color={report.type === 'RED_FLAG' ? 'error' : 'primary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={report.status}
                      color={getStatusColor(report.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{report.location}</TableCell>
                  <TableCell>
                    {new Date(report.createdOn).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setSelectedReport(report);
                        setNewStatus(report.status);
                        setStatusDialogOpen(true);
                      }}
                      color="primary"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelectedReport(report);
                        setDeleteDialogOpen(true);
                      }}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Status Update Dialog */}
        <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
          <DialogTitle>Update Report Status</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={newStatus}
                label="Status"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <MenuItem value="UNDER_INVESTIGATION">Under Investigation</MenuItem>
                <MenuItem value="RESOLVED">Resolved</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleStatusUpdate} variant="contained" color="primary">
              Update Status
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this report? This action cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        >
          <Alert
            onClose={() => setNotification(prev => ({ ...prev, open: false }))}
            severity={notification.type}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default AdminDashboard; 