import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Report } from '../types';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ImageList,
  ImageListItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectReport, updateReport, deleteReport } from '../store/slices/reportSlice';
import ReportForm from '../components/reports/ReportForm';
import StaticMap from '../components/map/StaticMap';

const ReportDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const report = useAppSelector((state) => state.reports.selectedReport);
  const { isLoading, error } = useAppSelector((state) => state.reports);
  const { user } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(selectReport(parseInt(id, 10)));
    }
  }, [dispatch, id]);

  if (!report) {
    return (
      <Container maxWidth="lg">
        <Typography>Report not found</Typography>
      </Container>
    );
  }

  const canEdit = report.status === 'DRAFT' && report.createdBy === user?.id;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = async (values: Report) => {
    if (id) {
      try {
        const updateData: Partial<Report> = {
          ...(values.location !== report.location && { location: values.location }),
          ...(values.comment !== report.comment && { comment: values.comment }),
          ...(values.status !== report.status && user?.role === 'ADMIN' && { status: values.status }),
          ...(values.title !== report.title && { title: values.title }),
          ...(values.type !== report.type && { type: values.type })
        };

        if (Object.keys(updateData).length > 0) {
          await dispatch(updateReport({
            id: parseInt(id, 10),
            data: updateData
          })).unwrap();
          setIsEditing(false);
        }
      } catch (error) {
        console.error('Failed to update report:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (id) {
      const resultAction = await dispatch(deleteReport(parseInt(id, 10)));
      if (deleteReport.fulfilled.match(resultAction)) {
        navigate('/dashboard');
      }
    }
  };

  const getStatusColor = (status: Report['status']) => {
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

  return (
    <Container maxWidth="lg">
      {isEditing ? (
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Edit Report
          </Typography>
          <ReportForm
            initialValues={report}
            onSubmit={handleUpdate}
            isLoading={isLoading}
            error={error}
          />
          <Button
            sx={{ mt: 2 }}
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4">{report.title}</Typography>
            {canEdit && (
              <Box>
                <Button
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  color="error"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete
                </Button>
              </Box>
            )}
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box display="flex" gap={1}>
                <Chip
                  label={report.type}
                  color={report.type === 'RED_FLAG' ? 'error' : 'primary'}
                />
                <Chip
                  label={report.status}
                  color={getStatusColor(report.status) as any}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Location</Typography>
              <Box sx={{ maxWidth: '600px' }}>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon color="primary" />
                  <Typography>
                    Coordinates: {report.location.split(',').map(coord => parseFloat(coord).toFixed(6)).join(', ')}
                  </Typography>
                </Box>
                <StaticMap location={report.location} />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Description</Typography>
              <Typography paragraph>{report.comment}</Typography>
            </Grid>

            {report.images && report.images.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Images
                </Typography>
                <ImageList cols={3} gap={8}>
                  {report.images.map((image, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={image}
                        alt={`Report image ${index + 1}`}
                        loading="lazy"
                        style={{ borderRadius: 4 }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Grid>
            )}

            {report.videos && report.videos.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Videos
                </Typography>
                <Grid container spacing={2}>
                  {report.videos.map((video, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <video
                        controls
                        style={{ width: '100%', borderRadius: 4 }}
                      >
                        <source src={video} />
                        Your browser does not support the video tag.
                      </video>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}

            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Created on: {new Date(report.createdOn).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>

          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this report? This action cannot be undone.
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleDelete} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      )}
    </Container>
  );
};

export default ReportDetails; 