import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Typography,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogContentText,
  Snackbar,
  Alert,
  Checkbox,
  Toolbar,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import type { Report } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { updateReport, updateStatus, deleteReport } from '../../store/slices/reportSlice';

interface ReportListProps {
  reports: Report[];
  showActions?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'DRAFT':
      return 'default';
    case 'UNDER_INVESTIGATION':
      return 'warning';
    case 'RESOLVED':
      return 'success';
    case 'REJECTED':
      return 'error';
    default:
      return 'default';
  }
};

const ReportList = ({ reports, showActions = true }: ReportListProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [editForm, setEditForm] = useState<Partial<Report>>({});
  const [selectedReports, setSelectedReports] = useState<number[]>([]);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({ open: false, message: '', type: 'success' });

  const handleEdit = (report: Report) => {
    setSelectedReport(report);
    setEditForm({
      title: report.title,
      location: report.location,
      comment: report.comment,
      type: report.type,
      status: report.status
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (report: Report) => {
    setSelectedReport(report);
    setDeleteDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (selectedReport && editForm) {
      try {
        const updateData: Partial<Report> = {};
        let statusUpdateError = null;
        
        // Handle regular field updates
        if (editForm.location !== selectedReport.location) {
          updateData.location = editForm.location;
        }
        if (editForm.comment !== selectedReport.comment) {
          updateData.comment = editForm.comment;
        }
        if (editForm.title !== selectedReport.title) {
          updateData.title = editForm.title;
        }
        if (editForm.type !== selectedReport.type) {
          updateData.type = editForm.type;
        }

        // Handle regular field updates if any changes were made
        if (Object.keys(updateData).length > 0) {
          await dispatch(updateReport({
            id: selectedReport.id,
            data: updateData
          })).unwrap();
        }

        // Handle status update separately for admins
        if (editForm.status !== selectedReport.status && user?.role === 'ADMIN') {
          try {
            await dispatch(updateStatus({
              id: selectedReport.id,
              status: editForm.status!
            })).unwrap();
          } catch (error: any) {
            // If it's just a notification error, we can show a warning instead of error
            if (error.toString().includes('Failed to send email')) {
              statusUpdateError = 'Status updated successfully, but notification email could not be sent.';
            } else {
              throw error;
            }
          }
        }

        setEditDialogOpen(false);
        setNotification({
          open: true,
          message: statusUpdateError || 'Report updated successfully',
          type: statusUpdateError ? 'warning' : 'success'
        });
      } catch (error: any) {
        console.error('Failed to update report:', error);
        setNotification({
          open: true,
          message: error.toString() || 'Failed to update report',
          type: 'error'
        });
      }
    }
  };

  const handleDeleteConfirm = async () => {
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
        console.error('Failed to delete report:', error);
        setNotification({
          open: true,
          message: error.message || 'Failed to delete report',
          type: 'error'
        });
      }
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedReports.map(id => dispatch(deleteReport(id)).unwrap()));
      setSelectedReports([]);
      setNotification({
        open: true,
        message: 'Selected reports deleted successfully',
        type: 'success'
      });
    } catch (error: any) {
      setNotification({
        open: true,
        message: 'Failed to delete some reports',
        type: 'error'
      });
    }
  };

  const handleCheckboxClick = (event: React.MouseEvent, reportId: number) => {
    event.stopPropagation();
    setSelectedReports(prev => {
      if (prev.includes(reportId)) {
        return prev.filter(id => id !== reportId);
      } else {
        return [...prev, reportId];
      }
    });
  };

  // Removed unused handleSelectAll function to fix unused variable error.

  return (
    <>
      {showActions && (
        <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
          <Box sx={{ flex: '1 1 100%' }}>
            {selectedReports.length > 0 ? (
              <Typography color="inherit" variant="subtitle1">
                {selectedReports.length} selected
              </Typography>
            ) : (
              <Typography variant="h6">Reports</Typography>
            )}
          </Box>
          {selectedReports.length > 0 && (
            <Button
              color="error"
              variant="contained"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Selected
            </Button>
          )}
        </Toolbar>
      )}

      <List>
        {reports.map((report) => (
          <Paper
            key={report.id}
            elevation={1}
            sx={{ mb: 2, '&:hover': { bgcolor: 'action.hover' } }}
          >
            <ListItem
              onClick={() => navigate(`/reports/${report.id}`)}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              {showActions && (
                <Checkbox
                  checked={selectedReports.includes(report.id)}
                  onClick={(e) => handleCheckboxClick(e, report.id)}
                  sx={{ mr: 2 }}
                />
              )}
              <Box sx={{ flex: 1 }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Typography variant="h6">{report.title}</Typography>
                  <Chip
                    label={report.type}
                    color={report.type === 'RED_FLAG' ? 'error' : 'primary'}
                    size="small"
                  />
                  <Chip
                    label={report.status}
                    color={getStatusColor(report.status) as any}
                    size="small"
                  />
                </Box>
                <Typography
                  variant="body2"
                  color="text.primary"
                  paragraph
                >
                  {report.comment}
                </Typography>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <LocationIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {report.location}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Created on: {new Date(report.createdOn).toLocaleDateString()}
                </Typography>
              </Box>
              {showActions && (
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(report);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(report);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          </Paper>
        ))}
        {reports.length === 0 && (
          <Typography variant="body1" color="text.secondary" align="center">
            No reports found.
          </Typography>
        )}
      </List>

      {/* Edit Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Report</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Title"
              fullWidth
              value={editForm.title || ''}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            />
            <TextField
              label="Location"
              fullWidth
              value={editForm.location || ''}
              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
            />
            <TextField
              label="Comment"
              fullWidth
              multiline
              rows={4}
              value={editForm.comment || ''}
              onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={editForm.type || ''}
                label="Type"
                onChange={(e) => setEditForm({ ...editForm, type: e.target.value as Report['type'] })}
              >
                <MenuItem value="RED_FLAG">Red Flag</MenuItem>
                <MenuItem value="INTERVENTION">Intervention</MenuItem>
              </Select>
            </FormControl>
            {user?.role === 'ADMIN' && (
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editForm.status || ''}
                  label="Status"
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Report['status'] })}
                >
                  <MenuItem value="DRAFT">Draft</MenuItem>
                  <MenuItem value="UNDER_INVESTIGATION">Under Investigation</MenuItem>
                  <MenuItem value="RESOLVED">Resolved</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete {selectedReports.length > 0 ? 'Reports' : 'Report'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedReports.length > 0
              ? `Are you sure you want to delete ${selectedReports.length} selected reports? This action cannot be undone.`
              : 'Are you sure you want to delete this report? This action cannot be undone.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={selectedReports.length > 0 ? handleBulkDelete : handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
};

export default ReportList; 